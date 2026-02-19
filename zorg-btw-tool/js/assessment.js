/* === Assessment & Questions Module === */
App.Assessment = (function() {
    'use strict';

    var U = App.Utils;
    var DS = App.DataStore;
    var RE = App.RuleEngine;

    // Run assessment on all mutations
    function assessAll() {
        var mutations = DS.getMutations();
        var crediteuren = DS.getCrediteuren();
        var newQuestions = [];
        var stats = { total: 0, classified: 0, needsReview: 0 };

        // Clear existing non-answered questions
        var existingQuestions = DS.getQuestions().filter(function(q) { return q.answered; });
        var answeredMap = {};
        existingQuestions.forEach(function(q) {
            // Group by rule+question combo to reuse answers
            var key = q.ruleId + '|' + q.questionText;
            answeredMap[key] = q;
        });

        mutations.forEach(function(mutation) {
            stats.total++;

            // Skip manually overridden mutations
            if (mutation.manualOverride) {
                stats.classified++;
                return;
            }

            // Step 1: Check crediteur classification
            var crediteurMatch = RE.classifyByCrediteur(mutation, crediteuren);

            // Step 2: Check rule engine
            var ruleMatch = RE.classify(mutation);

            // Determine classification
            if (crediteurMatch && crediteurMatch.classification) {
                // Crediteur classification takes precedence for direct matches
                mutation.classification = crediteurMatch.classification;
                mutation.confidence = 'high';
                mutation.rule = 'Crediteur: ' + crediteurMatch.name;
                mutation.status = 'auto-classified';

                // If rule also matches and has a question, still ask it
                if (ruleMatch && ruleMatch.askQuestion) {
                    generateQuestion(mutation, ruleMatch, newQuestions, answeredMap);
                    mutation.status = 'needs-review';
                    stats.needsReview++;
                } else {
                    stats.classified++;
                }
            } else if (ruleMatch) {
                mutation.classification = ruleMatch.classification;
                mutation.deductionPercentage = ruleMatch.deductionPercentage;
                mutation.preProRataPercentage = ruleMatch.preProRataPercentage;
                mutation.confidence = ruleMatch.askQuestion ? 'medium' : 'high';
                mutation.rule = ruleMatch.name;

                if (ruleMatch.askQuestion) {
                    generateQuestion(mutation, ruleMatch, newQuestions, answeredMap);
                    mutation.status = 'needs-review';
                    stats.needsReview++;
                } else {
                    mutation.status = 'auto-classified';
                    stats.classified++;
                }
            } else {
                // No rule matches - flag for review
                mutation.classification = 'onbeoordeeld';
                mutation.confidence = 'low';
                mutation.rule = '';
                mutation.status = 'needs-review';

                // Generate a generic question
                generateGenericQuestion(mutation, newQuestions, answeredMap);
                stats.needsReview++;
            }
        });

        // Deduplicate questions: group by similar mutations
        var deduplicatedQuestions = deduplicateQuestions(newQuestions);

        DS.setMutations(mutations);
        DS.setQuestions(existingQuestions.concat(deduplicatedQuestions));

        DS.addActivity('Beoordeling uitgevoerd: ' + stats.total + ' mutaties, ' +
            stats.classified + ' automatisch geclassificeerd, ' +
            stats.needsReview + ' met open vragen.');

        return stats;
    }

    function generateQuestion(mutation, rule, questionsList, answeredMap) {
        var key = rule.id + '|' + rule.questionText;
        var existingAnswer = answeredMap[key];

        if (existingAnswer) {
            // Apply existing answer
            applyAnswer(mutation, existingAnswer, rule);
            mutation.questionIds = [existingAnswer.id];
            return;
        }

        // Check if a similar question is already in the new questions list
        var existingNew = null;
        for (var i = 0; i < questionsList.length; i++) {
            if (questionsList[i].ruleId === rule.id && questionsList[i].questionText === rule.questionText) {
                existingNew = questionsList[i];
                break;
            }
        }

        if (existingNew) {
            // Add mutation to existing question
            existingNew.mutationIds.push(mutation.id);
            mutation.questionIds = [existingNew.id];
        } else {
            // Create new question
            var question = {
                id: U.generateId(),
                ruleId: rule.id,
                mutationIds: [mutation.id],
                questionText: rule.questionText,
                type: rule.questionType || 'keuze',
                options: rule.questionOptions ? rule.questionOptions.split('\n').filter(function(o) { return o.trim(); }) : [],
                answer: '',
                answered: false,
                impactDescription: 'Deze vraag heeft invloed op de classificatie van gerelateerde mutaties (' + rule.classification + ').',
                classification: rule.classification,
                deductionPercentage: rule.deductionPercentage,
                preProRataPercentage: rule.preProRataPercentage
            };
            questionsList.push(question);
            mutation.questionIds = [question.id];
        }
    }

    function generateGenericQuestion(mutation, questionsList, answeredMap) {
        var ledgerDesc = mutation.ledgerName || mutation.ledgerAccount;
        var questionText = 'Hoe moet de boeking op "' + ledgerDesc + '" worden geclassificeerd voor BTW-aftrek?';
        var key = 'generic|' + mutation.ledgerAccount;
        var existingAnswer = answeredMap[key];

        if (existingAnswer) {
            mutation.classification = existingAnswer.answerClassification || 'pro-rata';
            mutation.status = 'reviewed';
            mutation.questionIds = [existingAnswer.id];
            return;
        }

        // Check if same ledger account question exists in new list
        var existingNew = null;
        for (var i = 0; i < questionsList.length; i++) {
            if (questionsList[i].ruleId === 'generic' && questionsList[i].ledgerAccount === mutation.ledgerAccount) {
                existingNew = questionsList[i];
                break;
            }
        }

        if (existingNew) {
            existingNew.mutationIds.push(mutation.id);
            mutation.questionIds = [existingNew.id];
        } else {
            var question = {
                id: U.generateId(),
                ruleId: 'generic',
                ledgerAccount: mutation.ledgerAccount,
                mutationIds: [mutation.id],
                questionText: questionText,
                type: 'keuze',
                options: [
                    'Volledig aftrekbaar (kosten voor belaste activiteiten)',
                    'Niet-aftrekbaar (kosten voor vrijgestelde zorgactiviteiten)',
                    'Pro rata (algemene overhead)',
                    'Pre-pro-rata (deels belast/deels vrijgesteld)'
                ],
                answer: '',
                answered: false,
                impactDescription: 'Betreft ' + mutation.ledgerAccount + ' - ' + ledgerDesc + '. Geen automatische regel gevonden.',
                classification: 'onbeoordeeld'
            };
            questionsList.push(question);
            mutation.questionIds = [question.id];
        }
    }

    function deduplicateQuestions(questions) {
        // Questions with same ruleId and questionText are already grouped
        // Group questions for same ledger account range
        var grouped = {};
        var result = [];

        questions.forEach(function(q) {
            var groupKey = q.ruleId + '|' + q.questionText;
            if (!grouped[groupKey]) {
                grouped[groupKey] = q;
                result.push(q);
            } else {
                // Merge mutation IDs
                q.mutationIds.forEach(function(mid) {
                    if (grouped[groupKey].mutationIds.indexOf(mid) === -1) {
                        grouped[groupKey].mutationIds.push(mid);
                    }
                });
            }
        });

        return result;
    }

    // Apply an answer to a question and update related mutations
    function answerQuestion(questionId, answer) {
        var question = DS.getQuestion(questionId);
        if (!question) return;

        question.answer = answer;
        question.answered = true;
        question.answeredAt = new Date().toISOString();

        // Determine new classification based on answer
        var newClassification = determineClassificationFromAnswer(question, answer);
        question.answerClassification = newClassification.classification;

        // Update all related mutations
        question.mutationIds.forEach(function(mutId) {
            var mutation = DS.getMutation(mutId);
            if (mutation && !mutation.manualOverride) {
                mutation.classification = newClassification.classification;
                mutation.deductionPercentage = newClassification.deductionPercentage;
                mutation.preProRataPercentage = newClassification.preProRataPercentage;
                mutation.status = 'reviewed';
                mutation.confidence = 'high';
                DS.updateMutation(mutId, mutation);
            }
        });

        DS.updateQuestion(questionId, question);
        DS.addActivity('Vraag beantwoord: "' + question.questionText.substring(0, 50) + '..." -> ' +
            U.classificationLabel(newClassification.classification));
    }

    function determineClassificationFromAnswer(question, answer) {
        var result = {
            classification: question.classification || 'pro-rata',
            deductionPercentage: question.deductionPercentage || 100,
            preProRataPercentage: question.preProRataPercentage || 0
        };

        if (question.type === 'percentage') {
            var pct = parseFloat(answer);
            if (!isNaN(pct)) {
                result.classification = 'pre-pro-rata';
                result.preProRataPercentage = pct;
                result.deductionPercentage = 100;
            }
            return result;
        }

        if (question.type === 'ja-nee') {
            if (answer.toLowerCase() === 'ja') {
                result.classification = 'aftrekbaar';
                result.deductionPercentage = 100;
            } else {
                result.classification = 'niet-aftrekbaar';
                result.deductionPercentage = 0;
            }
            return result;
        }

        // For 'keuze' and 'tekst': parse classification from answer text
        var lowerAnswer = answer.toLowerCase();

        if (lowerAnswer.indexOf('volledig aftrekbaar') > -1 || lowerAnswer.indexOf('belaste activiteiten') > -1) {
            result.classification = 'aftrekbaar';
            result.deductionPercentage = 100;
            result.preProRataPercentage = 0;
        } else if (lowerAnswer.indexOf('niet-aftrekbaar') > -1 || lowerAnswer.indexOf('vrijgesteld') > -1 ||
                   lowerAnswer.indexOf('patientenvoeding') > -1 || lowerAnswer.indexOf('zorgactiviteiten') > -1 ||
                   lowerAnswer.indexOf('vrijgestelde zorg') > -1) {
            result.classification = 'niet-aftrekbaar';
            result.deductionPercentage = 0;
            result.preProRataPercentage = 0;
        } else if (lowerAnswer.indexOf('pre-pro-rata') > -1 || lowerAnswer.indexOf('deels') > -1 ||
                   lowerAnswer.indexOf('gemengd') > -1) {
            result.classification = 'pre-pro-rata';
            result.deductionPercentage = 100;
            // Try to extract percentage
            var pctMatch = lowerAnswer.match(/(\d+)\s*%/);
            result.preProRataPercentage = pctMatch ? parseInt(pctMatch[1], 10) : (question.preProRataPercentage || 30);
        } else if (lowerAnswer.indexOf('pro rata') > -1 || lowerAnswer.indexOf('algemeen') > -1 ||
                   lowerAnswer.indexOf('intern') > -1 || lowerAnswer.indexOf('management') > -1) {
            result.classification = 'pro-rata';
            result.deductionPercentage = 100;
            result.preProRataPercentage = 0;
        }

        return result;
    }

    // Apply a previously answered question to a mutation
    function applyAnswer(mutation, question, rule) {
        if (question.answered && question.answerClassification) {
            mutation.classification = question.answerClassification;
            mutation.status = 'reviewed';
            mutation.confidence = 'high';
        }
    }

    // Calculate summary statistics
    function calculateSummary() {
        var mutations = DS.getMutations();
        var settings = DS.getSettings();
        var proRataPct = settings.proRataPercentage || 5;

        var summary = {
            totaalMutaties: mutations.length,
            totaalBedrag: 0,
            totaalBTW: 0,
            classificaties: {
                'aftrekbaar': { count: 0, bedrag: 0, btw: 0, aftrekbareBTW: 0 },
                'niet-aftrekbaar': { count: 0, bedrag: 0, btw: 0, aftrekbareBTW: 0 },
                'pro-rata': { count: 0, bedrag: 0, btw: 0, aftrekbareBTW: 0 },
                'pre-pro-rata': { count: 0, bedrag: 0, btw: 0, aftrekbareBTW: 0 },
                'onbeoordeeld': { count: 0, bedrag: 0, btw: 0, aftrekbareBTW: 0 }
            },
            totaalAftrekbareBTW: 0,
            totaalNietAftrekbareBTW: 0,
            openVragen: 0,
            beantwoordeVragen: 0,
            proRataPercentage: proRataPct
        };

        mutations.forEach(function(m) {
            var cl = m.classification || 'onbeoordeeld';
            var bedrag = Math.abs(m.amount || 0);
            var btw = Math.abs(m.vatAmount || 0);

            summary.totaalBedrag += bedrag;
            summary.totaalBTW += btw;

            if (!summary.classificaties[cl]) {
                summary.classificaties[cl] = { count: 0, bedrag: 0, btw: 0, aftrekbareBTW: 0 };
            }

            summary.classificaties[cl].count++;
            summary.classificaties[cl].bedrag += bedrag;
            summary.classificaties[cl].btw += btw;

            // Calculate deductible VAT
            var aftrekbareBTW = 0;
            switch(cl) {
                case 'aftrekbaar':
                    aftrekbareBTW = btw;
                    break;
                case 'niet-aftrekbaar':
                    aftrekbareBTW = 0;
                    break;
                case 'pro-rata':
                    aftrekbareBTW = btw * (proRataPct / 100);
                    break;
                case 'pre-pro-rata':
                    var preProPct = m.preProRataPercentage || 30;
                    aftrekbareBTW = btw * (preProPct / 100) * (proRataPct / 100);
                    break;
                default:
                    aftrekbareBTW = 0;
            }

            summary.classificaties[cl].aftrekbareBTW += aftrekbareBTW;
            summary.totaalAftrekbareBTW += aftrekbareBTW;
            summary.totaalNietAftrekbareBTW += (btw - aftrekbareBTW);
        });

        var questions = DS.getQuestions();
        questions.forEach(function(q) {
            if (q.answered) {
                summary.beantwoordeVragen++;
            } else {
                summary.openVragen++;
            }
        });

        return summary;
    }

    return {
        assessAll: assessAll,
        answerQuestion: answerQuestion,
        calculateSummary: calculateSummary,
        determineClassificationFromAnswer: determineClassificationFromAnswer
    };
})();
