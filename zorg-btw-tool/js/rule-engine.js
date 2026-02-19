/* === Rule Engine - BTW classification rules for healthcare === */
App.RuleEngine = (function() {
    'use strict';

    var RULES_KEY = 'zorg_btw_rules';

    function getDefaultRules() {
        return [
            // Personeelskosten
            {
                id: 'r001', name: 'Personeelskosten algemeen', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4000-4099' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Personeelskosten worden in beginsel via pro rata verwerkt (mix belast/vrijgesteld).',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Huisvestingskosten
            {
                id: 'r002', name: 'Huurkosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4100-4109' }],
                classification: 'pre-pro-rata', deductionPercentage: 100, preProRataPercentage: 30,
                description: 'Huurkosten pand: eerst pre-pro-rata verdeling op basis van m2 gebruik.',
                active: true, askQuestion: true,
                questionText: 'Welk percentage van het gehuurde pand wordt gebruikt voor belaste activiteiten (kantoor, verhuur, catering)?',
                questionType: 'percentage', questionOptions: ''
            },
            {
                id: 'r003', name: 'Energiekosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4110-4119' }],
                classification: 'pre-pro-rata', deductionPercentage: 100, preProRataPercentage: 30,
                description: 'Energiekosten volgen de verdeling van het pand (pre-pro-rata).',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r004', name: 'Schoonmaakkosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4120-4129' }],
                classification: 'pre-pro-rata', deductionPercentage: 100, preProRataPercentage: 30,
                description: 'Schoonmaakkosten volgen de verdeling van het pand (pre-pro-rata).',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r005', name: 'Onderhoud gebouw', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4130-4149' }],
                classification: 'pre-pro-rata', deductionPercentage: 100, preProRataPercentage: 30,
                description: 'Onderhoud en verzekering gebouw: pre-pro-rata op basis van gebruik.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Kantoorkosten
            {
                id: 'r010', name: 'Kantoorbenodigdheden', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4200-4209' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Kantoorbenodigdheden: algemene kosten, pro rata aftrek.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r011', name: 'Telefoon en communicatie', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4210-4229' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Telefoon, internet en porti: algemene kosten, pro rata.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r012', name: 'Drukwerk', priority: 15,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4230-4239' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Drukwerk: afhankelijk van het doel. Standaard pro rata.',
                active: true, askQuestion: true,
                questionText: 'Is dit drukwerk bedoeld voor werving/commerciele activiteiten of voor interne/zorg doeleinden?',
                questionType: 'keuze',
                questionOptions: 'Commercieel/werving (volledig aftrekbaar)\nIntern/zorg (pro rata)\nOnbekend'
            },
            // Algemene kosten
            {
                id: 'r020', name: 'Accountantskosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4300-4309' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Accountantskosten: algemene overhead, pro rata.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r021', name: 'Advieskosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4310-4319' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Advieskosten: standaard pro rata, maar kan volledig aftrekbaar zijn als het advies uitsluitend betrekking heeft op belaste activiteiten.',
                active: true, askQuestion: true,
                questionText: 'Heeft dit advies uitsluitend betrekking op belaste activiteiten (bijv. commerciele verhuur, catering)?',
                questionType: 'keuze',
                questionOptions: 'Ja, uitsluitend belaste activiteiten (volledig aftrekbaar)\nNee, algemeen/gemengd (pro rata)\nJa, uitsluitend vrijgestelde zorgactiviteiten (niet-aftrekbaar)'
            },
            {
                id: 'r022', name: 'Administratiekosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4320-4329' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Administratiekosten: algemene overhead, pro rata.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r023', name: 'Bestuurskosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4330-4339' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Bestuurskosten: algemene overhead, pro rata.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Patientgebonden kosten
            {
                id: 'r030', name: 'Medische middelen', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4400-4409' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Medische middelen direct gerelateerd aan (vrijgestelde) zorgverlening.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r031', name: 'Geneesmiddelen', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4410-4419' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Geneesmiddelen voor patientenzorg: niet-aftrekbaar (vrijgesteld).',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r032', name: 'Laboratoriumkosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4420-4429' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Laboratoriumkosten voor patientenzorg: niet-aftrekbaar.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r033', name: 'Voeding patienten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4430-4439' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Voeding voor patienten is onderdeel van de vrijgestelde zorgprestatie.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Voeding/catering
            {
                id: 'r040', name: 'Keukenkosten/catering', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4500-4599' }],
                classification: 'pre-pro-rata', deductionPercentage: 100, preProRataPercentage: 50,
                description: 'Keukenkosten kunnen gemengd zijn: patientenvoeding (niet-aftrekbaar), medewerkersrestaurant (pro rata), externe catering (aftrekbaar).',
                active: true, askQuestion: true,
                questionText: 'Wat is de bestemming van deze voedings-/cateringkosten?',
                questionType: 'keuze',
                questionOptions: 'Uitsluitend patientenvoeding (niet-aftrekbaar)\nMedewerkerrestaurant (pro rata)\nExterne catering/horeca (volledig aftrekbaar)\nGemengd patient/medewerker (pre-pro-rata 50%)'
            },
            // Onderhoud/techniek
            {
                id: 'r050', name: 'Onderhoud installaties', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4600-4619' }],
                classification: 'pre-pro-rata', deductionPercentage: 100, preProRataPercentage: 30,
                description: 'Onderhoud installaties en apparatuur: pre-pro-rata op basis van gebruik.',
                active: true, askQuestion: true,
                questionText: 'Wordt deze installatie/apparatuur (deels) gebruikt voor belaste activiteiten?',
                questionType: 'keuze',
                questionOptions: 'Uitsluitend zorg/vrijgesteld (niet-aftrekbaar)\nAlgemeen gebruik (pre-pro-rata)\nUitsluitend belaste activiteiten (volledig aftrekbaar)'
            },
            // ICT
            {
                id: 'r060', name: 'ICT kosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4700-4799' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'ICT kosten (hardware, software, diensten): algemene overhead, pro rata.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Financiele kosten
            {
                id: 'r070', name: 'Rentekosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4800-4809' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Rentekosten zijn vrijgesteld van BTW (art. 11 lid 1 sub j Wet OB).',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r071', name: 'Bankkosten', priority: 10,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4810-4819' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Bankkosten: financiele dienstverlening is vrijgesteld.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r072', name: 'Afschrijvingen', priority: 15,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4820-4899' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Afschrijvingen: BTW is al beoordeeld bij aanschaf. Geen directe BTW-relevantie bij afschrijving zelf.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Omzet
            {
                id: 'r080', name: 'Omzet zorg (WLZ/ZVW)', priority: 5,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '8000-8099' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Zorgomzet is vrijgesteld van BTW. Geen vooraftrek.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r081', name: 'Omzet overig/belast', priority: 5,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '8100-8199' }],
                classification: 'aftrekbaar', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Overige belaste omzet (catering, verhuur, etc.). Kosten hiervoor zijn aftrekbaar.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // BTW code based rules (lower priority, act as fallback)
            {
                id: 'r090', name: 'BTW code 0% / vrijgesteld', priority: 50,
                conditions: [{ field: 'vatCode', operator: 'in', value: '0,0%,geen,vrij,vrijgesteld,exempt' }],
                classification: 'niet-aftrekbaar', deductionPercentage: 0, preProRataPercentage: 0,
                description: 'Facturen zonder BTW / met BTW-code vrijgesteld.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // Opleiding zorgpersoneel
            {
                id: 'r095', name: 'Opleidingskosten', priority: 12,
                conditions: [{ field: 'ledgerAccount', operator: 'range', value: '4050-4059' }],
                classification: 'pro-rata', deductionPercentage: 100, preProRataPercentage: 0,
                description: 'Opleidingskosten: standaard pro rata. Indien uitsluitend voor zorgpersoneel in het kader van vrijgestelde zorg, dan niet-aftrekbaar.',
                active: true, askQuestion: true,
                questionText: 'Is deze opleiding specifiek gericht op vrijgestelde zorgactiviteiten of betreft het algemene bijscholing?',
                questionType: 'keuze',
                questionOptions: 'Specifiek voor vrijgestelde zorg (niet-aftrekbaar)\nAlgemene bijscholing/management (pro rata)\nGericht op belaste activiteiten (volledig aftrekbaar)'
            }
        ];
    }

    var rules = null;

    function loadRules() {
        try {
            var stored = localStorage.getItem(RULES_KEY);
            if (stored) {
                rules = JSON.parse(stored);
            } else {
                rules = getDefaultRules();
                saveRules();
            }
        } catch(e) {
            rules = getDefaultRules();
        }
        return rules;
    }

    function saveRules() {
        try {
            localStorage.setItem(RULES_KEY, JSON.stringify(rules));
        } catch(e) {
            console.error('Fout bij opslaan regels:', e);
        }
    }

    function getRules() {
        if (!rules) loadRules();
        return rules;
    }

    function setRules(newRules) {
        rules = newRules;
        saveRules();
    }

    function resetToDefaults() {
        rules = getDefaultRules();
        saveRules();
    }

    function addRule(rule) {
        if (!rule.id) rule.id = App.Utils.generateId();
        getRules().push(rule);
        saveRules();
    }

    function updateRule(id, updates) {
        var r = getRules();
        for (var i = 0; i < r.length; i++) {
            if (r[i].id === id) {
                Object.assign(r[i], updates);
                saveRules();
                return r[i];
            }
        }
        return null;
    }

    function deleteRule(id) {
        var r = getRules();
        for (var i = 0; i < r.length; i++) {
            if (r[i].id === id) {
                r.splice(i, 1);
                saveRules();
                return true;
            }
        }
        return false;
    }

    function getRule(id) {
        var r = getRules();
        for (var i = 0; i < r.length; i++) {
            if (r[i].id === id) return r[i];
        }
        return null;
    }

    // Evaluate a single condition against a mutation
    function evaluateCondition(condition, mutation) {
        var fieldValue = String(mutation[condition.field] || '').trim();
        var condValue = String(condition.value || '').trim();

        switch (condition.operator) {
            case 'equals':
                return fieldValue.toLowerCase() === condValue.toLowerCase();

            case 'contains':
                return fieldValue.toLowerCase().indexOf(condValue.toLowerCase()) > -1;

            case 'starts_with':
                return fieldValue.toLowerCase().indexOf(condValue.toLowerCase()) === 0;

            case 'range':
                // Format: "4000-4099" - checks if numeric value of field is in range
                var parts = condValue.split('-');
                if (parts.length !== 2) return false;
                var low = parseInt(parts[0], 10);
                var high = parseInt(parts[1], 10);
                var val = parseInt(fieldValue, 10);
                if (isNaN(low) || isNaN(high) || isNaN(val)) return false;
                return val >= low && val <= high;

            case 'in':
                // Comma separated list of values
                var values = condValue.toLowerCase().split(',').map(function(v) { return v.trim(); });
                return values.indexOf(fieldValue.toLowerCase()) > -1;

            case 'not_empty':
                return fieldValue.length > 0;

            case 'empty':
                return fieldValue.length === 0;

            case 'greater_than':
                return parseFloat(fieldValue) > parseFloat(condValue);

            case 'less_than':
                return parseFloat(fieldValue) < parseFloat(condValue);

            default:
                return false;
        }
    }

    // Evaluate all conditions of a rule (AND logic)
    function evaluateRule(rule, mutation) {
        if (!rule.active) return false;
        if (!rule.conditions || rule.conditions.length === 0) return false;

        for (var i = 0; i < rule.conditions.length; i++) {
            if (!evaluateCondition(rule.conditions[i], mutation)) {
                return false;
            }
        }
        return true;
    }

    // Classify a single mutation, returning the matching rule or null
    function classify(mutation) {
        var sortedRules = getRules().slice().sort(function(a, b) {
            return (a.priority || 50) - (b.priority || 50);
        });

        for (var i = 0; i < sortedRules.length; i++) {
            if (evaluateRule(sortedRules[i], mutation)) {
                return sortedRules[i];
            }
        }
        return null;
    }

    // Check if a crediteur has a known classification
    function classifyByCrediteur(mutation, crediteuren) {
        if (!mutation.supplier) return null;
        for (var i = 0; i < crediteuren.length; i++) {
            if (crediteuren[i].code === mutation.supplier && crediteuren[i].classification) {
                return crediteuren[i];
            }
        }
        return null;
    }

    function conditionDescription(condition) {
        var fieldLabels = {
            'ledgerAccount': 'Grootboekrek.',
            'ledgerName': 'Naam rekening',
            'description': 'Omschrijving',
            'amount': 'Bedrag',
            'vatAmount': 'BTW bedrag',
            'vatCode': 'BTW code',
            'costCenter': 'Kostenplaats',
            'supplier': 'Crediteur',
            'supplierName': 'Naam crediteur'
        };
        var opLabels = {
            'equals': '=',
            'contains': 'bevat',
            'starts_with': 'begint met',
            'range': 'bereik',
            'in': 'in lijst',
            'not_empty': 'niet leeg',
            'empty': 'leeg',
            'greater_than': '>',
            'less_than': '<'
        };
        var field = fieldLabels[condition.field] || condition.field;
        var op = opLabels[condition.operator] || condition.operator;
        var val = condition.value || '';
        if (condition.operator === 'not_empty' || condition.operator === 'empty') {
            return field + ' ' + op;
        }
        return field + ' ' + op + ' "' + val + '"';
    }

    return {
        getDefaultRules: getDefaultRules,
        loadRules: loadRules,
        saveRules: saveRules,
        getRules: getRules,
        setRules: setRules,
        resetToDefaults: resetToDefaults,
        addRule: addRule,
        updateRule: updateRule,
        deleteRule: deleteRule,
        getRule: getRule,
        classify: classify,
        classifyByCrediteur: classifyByCrediteur,
        evaluateCondition: evaluateCondition,
        evaluateRule: evaluateRule,
        conditionDescription: conditionDescription
    };
})();
