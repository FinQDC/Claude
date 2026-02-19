/* === Assessment Module - BTW-beoordeling investeringen zorginstellingen === */
/* Beoordeling van nieuwbouw, verbouw en duurzaamheidsinvesteringen op basis van
   bestemmingsverhouding (m2), regelengine en verduidelijkingsvragen. */
App.Assessment = (function() {
    'use strict';

    var U = App.Utils;
    var DS = App.DataStore;
    var RE = App.RuleEngine;

    // =========================================================================
    // Hoofdfunctie: beoordeel alle investeringsregels
    // =========================================================================
    function beoordeelAlles() {
        var investeringen = DS.getInvesteringen();
        var instellingen = DS.getInstellingen();
        var proRata = parseFloat(instellingen.proRataPercentage) || 5;
        var bestPct = DS.berekenBestemmingspercentages();

        var nieuweVragen = [];
        var stats = {
            totaal: 0,
            classified: 0,
            needsReview: 0,
            skipped: 0
        };

        // Bewaar beantwoorde vragen en bouw een lookup-map
        var bestaandeVragen = DS.getVragen();
        var beantwoordeVragen = bestaandeVragen.filter(function(v) { return v.beantwoord; });
        var antwoordMap = {};
        beantwoordeVragen.forEach(function(v) {
            var sleutel = v.regelId + '|' + v.vraagTekst;
            antwoordMap[sleutel] = v;
        });

        investeringen.forEach(function(inv) {
            stats.totaal++;

            // Sla handmatig overschreven investeringen over
            if (inv.handmatig) {
                stats.skipped++;
                stats.classified++;
                return;
            }

            // Stap 1: Classificeer via regelengine
            var regel = RE.classificeer(inv);

            if (regel) {
                inv.classification = regel.classification;
                inv.herzieningType = regel.herzieningType || 'onroerend';
                inv.herzieningPeriode = inv.herzieningType === 'roerend' ? 5 : 10;
                inv.regel = regel.name;

                // Stap 2: Bereken bestemmingspercentages op basis van classificatie
                berekenBestemmingVoorInvestering(inv, bestPct, proRata);

                // Stap 3: Controleer of er een vraag gesteld moet worden
                if (regel.askQuestion && regel.questionText) {
                    var resultaatVraag = genereerVraag(inv, regel, nieuweVragen, antwoordMap);

                    if (resultaatVraag === 'beantwoord') {
                        // Eerder beantwoorde vraag toegepast
                        inv.status = 'reviewed';
                        inv.confidence = 'high';
                        stats.classified++;
                    } else {
                        inv.status = 'needs-review';
                        inv.confidence = 'medium';
                        stats.needsReview++;
                    }
                } else {
                    inv.status = 'auto-classified';
                    inv.confidence = 'high';
                    stats.classified++;
                }
            } else {
                // Geen regel gevonden
                inv.classification = 'onbeoordeeld';
                inv.confidence = 'low';
                inv.regel = '';
                inv.status = 'needs-review';
                inv.herzieningType = 'onroerend';
                inv.herzieningPeriode = 10;
                inv.aftrekbareBTW = 0;

                genereerGeneriekVraag(inv, nieuweVragen, antwoordMap);
                stats.needsReview++;
            }
        });

        // Dedupliceer nieuwe vragen
        var gedeupVragen = dedupliceerVragen(nieuweVragen);

        // Sla op
        DS.setInvesteringen(investeringen);
        DS.setVragen(beantwoordeVragen.concat(gedeupVragen));

        DS.logActiviteit(
            'Beoordeling uitgevoerd: ' + stats.totaal + ' investeringsregels, ' +
            stats.classified + ' automatisch geclassificeerd, ' +
            stats.needsReview + ' met open vragen.'
        );

        return stats;
    }

    // =========================================================================
    // Bestemmingsberekening per investering
    // =========================================================================
    function berekenBestemmingVoorInvestering(inv, bestPct, proRata) {
        var btwBedrag = Math.abs(parseFloat(inv.btwBedrag) || 0);

        // Sla bestemmingspercentages op bij de investering (voor rapportage)
        inv.bestemmingZorgPct = bestPct.zorgPct || 0;
        inv.bestemmingKantoorPct = bestPct.kantoorPct || 0;
        inv.bestemmingCommercieelPct = bestPct.commercieelPct || 0;
        inv.bestemmingAlgemeenPct = bestPct.algemeenPct || 0;

        switch (inv.classification) {
            case 'aftrekbaar':
                // Volledig aftrekbaar - 100% van BTW
                inv.aftrekbareBTW = btwBedrag;
                break;

            case 'niet-aftrekbaar':
                // Niet-aftrekbaar - 0% van BTW
                inv.aftrekbareBTW = 0;
                break;

            case 'pre-pro-rata':
                // Pre-pro-rata berekening op basis van bestemmingsverhouding (m2)
                //
                // Formule (art. 15 Wet OB / art. 13 Uitv.besch. OB):
                //   Commercieel deel  : BTW x (commercieelPct / 100)          -> volledig aftrekbaar
                //   Kantoor/alg. deel : BTW x ((kantoorPct + algemeenPct) / 100) x (proRata / 100)
                //   Zorg deel         : niet aftrekbaar (vrijgesteld)
                //
                // Totaal aftrekbaar = commercieel deel + kantoor/alg. deel
                inv.aftrekbareBTW = berekenPreProRata(btwBedrag, bestPct, proRata);
                break;

            default:
                // Onbeoordeeld of onbekend
                inv.aftrekbareBTW = 0;
                break;
        }
    }

    /**
     * Berekent de aftrekbare BTW volgens pre-pro-rata methode.
     *
     * @param {number} btwBedrag - Het BTW-bedrag
     * @param {object} bestPct - Bestemmingspercentages (commercieelPct, kantoorPct, algemeenPct, zorgPct)
     * @param {number} proRata - Pro rata percentage van de instelling
     * @returns {number} Aftrekbare BTW
     */
    function berekenPreProRata(btwBedrag, bestPct, proRata) {
        if (btwBedrag === 0) return 0;

        // Commercieel gedeelte: volledig aftrekbaar
        var commercieelDeel = btwBedrag * ((bestPct.commercieelPct || 0) / 100);

        // Kantoor en algemeen: aftrekbaar via pro rata
        var kantoorAlgemeenDeel = btwBedrag *
            (((bestPct.kantoorPct || 0) + (bestPct.algemeenPct || 0)) / 100) *
            (proRata / 100);

        // Zorgdeel: niet aftrekbaar (vrijgesteld)
        // var zorgDeel = 0;

        return commercieelDeel + kantoorAlgemeenDeel;
    }

    // =========================================================================
    // Vraagbeheer
    // =========================================================================

    /**
     * Genereert een verduidelijkingsvraag voor een investering op basis van een regel.
     * Retourneert 'beantwoord' als een eerder antwoord is hergebruikt, anders 'nieuw'.
     */
    function genereerVraag(inv, regel, vragenLijst, antwoordMap) {
        var sleutel = regel.id + '|' + regel.questionText;
        var bestaandAntwoord = antwoordMap[sleutel];

        // Hergebruik eerder gegeven antwoord
        if (bestaandAntwoord) {
            pasAntwoordToe(inv, bestaandAntwoord);
            if (!inv.vraagIds) inv.vraagIds = [];
            if (inv.vraagIds.indexOf(bestaandAntwoord.id) === -1) {
                inv.vraagIds.push(bestaandAntwoord.id);
            }
            // Voeg investering toe aan de beantwoorde vraag als dat nog niet is gebeurd
            if (bestaandAntwoord.investeringIds.indexOf(inv.id) === -1) {
                bestaandAntwoord.investeringIds.push(inv.id);
            }
            return 'beantwoord';
        }

        // Zoek of er al een identieke nieuwe vraag bestaat
        var bestaandeNieuwe = null;
        for (var i = 0; i < vragenLijst.length; i++) {
            if (vragenLijst[i].regelId === regel.id &&
                vragenLijst[i].vraagTekst === regel.questionText) {
                bestaandeNieuwe = vragenLijst[i];
                break;
            }
        }

        if (bestaandeNieuwe) {
            // Voeg investering toe aan bestaande vraag
            if (bestaandeNieuwe.investeringIds.indexOf(inv.id) === -1) {
                bestaandeNieuwe.investeringIds.push(inv.id);
            }
            if (!inv.vraagIds) inv.vraagIds = [];
            if (inv.vraagIds.indexOf(bestaandeNieuwe.id) === -1) {
                inv.vraagIds.push(bestaandeNieuwe.id);
            }
        } else {
            // Maak een nieuwe vraag aan
            var vraag = {
                id: U.generateId(),
                regelId: regel.id,
                investeringIds: [inv.id],
                vraagTekst: regel.questionText,
                type: regel.questionType || 'keuze',
                opties: regel.questionOptions ?
                    regel.questionOptions.split('\n').filter(function(o) { return o.trim(); }) : [],
                antwoord: '',
                beantwoord: false,
                impactOmschrijving: bouwImpactOmschrijving(inv, regel),
                classificatie: regel.classification,
                herzieningType: regel.herzieningType || 'onroerend'
            };
            vragenLijst.push(vraag);

            if (!inv.vraagIds) inv.vraagIds = [];
            inv.vraagIds.push(vraag.id);
        }

        return 'nieuw';
    }

    /**
     * Genereert een generieke vraag voor investeringen zonder matchende regel.
     */
    function genereerGeneriekVraag(inv, vragenLijst, antwoordMap) {
        var omschrijving = inv.omschrijving || inv.leverancier || 'Onbekend';
        var vraagTekst = 'Hoe moet de investering "' + omschrijving.substring(0, 60) +
            '" worden geclassificeerd voor BTW-aftrek?';
        var sleutel = 'generiek|' + (inv.categorie || '') + '|' + vraagTekst;
        var bestaandAntwoord = antwoordMap[sleutel];

        if (bestaandAntwoord) {
            inv.classification = bestaandAntwoord.antwoordClassificatie || 'pre-pro-rata';
            inv.status = 'reviewed';
            if (!inv.vraagIds) inv.vraagIds = [];
            inv.vraagIds.push(bestaandAntwoord.id);
            if (bestaandAntwoord.investeringIds.indexOf(inv.id) === -1) {
                bestaandAntwoord.investeringIds.push(inv.id);
            }
            return;
        }

        // Zoek bestaande generieke vraag met dezelfde categorie
        var bestaandeNieuwe = null;
        for (var i = 0; i < vragenLijst.length; i++) {
            if (vragenLijst[i].regelId === 'generiek' &&
                vragenLijst[i].categorie === (inv.categorie || '')) {
                bestaandeNieuwe = vragenLijst[i];
                break;
            }
        }

        if (bestaandeNieuwe) {
            if (bestaandeNieuwe.investeringIds.indexOf(inv.id) === -1) {
                bestaandeNieuwe.investeringIds.push(inv.id);
            }
            if (!inv.vraagIds) inv.vraagIds = [];
            inv.vraagIds.push(bestaandeNieuwe.id);
        } else {
            var vraag = {
                id: U.generateId(),
                regelId: 'generiek',
                categorie: inv.categorie || '',
                investeringIds: [inv.id],
                vraagTekst: vraagTekst,
                type: 'keuze',
                opties: [
                    'Volledig aftrekbaar (belaste activiteiten)',
                    'Niet-aftrekbaar (vrijgestelde zorgactiviteiten)',
                    'Pre-pro-rata (bestemmingsverhouding gebouw)',
                    'Specifieke bestemming - nadere toelichting vereist'
                ],
                antwoord: '',
                beantwoord: false,
                impactOmschrijving: 'Betreft: ' + U.escapeHtml(omschrijving) +
                    (inv.categorie ? ' | Categorie: ' + inv.categorie : '') +
                    '. Geen automatische regel gevonden.',
                classificatie: 'onbeoordeeld',
                herzieningType: 'onroerend'
            };
            vragenLijst.push(vraag);

            if (!inv.vraagIds) inv.vraagIds = [];
            inv.vraagIds.push(vraag.id);
        }
    }

    /**
     * Bouwt een impact-omschrijving voor een vraag.
     */
    function bouwImpactOmschrijving(inv, regel) {
        var delen = [];
        if (inv.leverancier) delen.push(inv.leverancier);
        if (inv.categorie) {
            var categorieLabels = {
                'bouwkundig': 'Bouwkundig',
                'installaties': 'Installaties',
                'afbouw': 'Afbouw',
                'terrein': 'Terrein',
                'duurzaamheid': 'Duurzaamheid',
                'inrichting': 'Inrichting',
                'advies': 'Advies'
            };
            delen.push(categorieLabels[inv.categorie] || inv.categorie);
        }
        if (inv.projectType) {
            var typeLabels = {
                'nieuwbouw': 'Nieuwbouw',
                'verbouw': 'Verbouw',
                'verduurzaming': 'Verduurzaming'
            };
            delen.push(typeLabels[inv.projectType] || inv.projectType);
        }
        var omschrijving = delen.join(' | ');
        omschrijving += ' | Huidige classificatie: ' + U.classificationLabel(regel.classification);
        return omschrijving;
    }

    /**
     * Dedupliceer vragen: groepeer op regelId + vraagTekst.
     */
    function dedupliceerVragen(vragen) {
        var gegroepeerd = {};
        var resultaat = [];

        vragen.forEach(function(v) {
            var sleutel = v.regelId + '|' + v.vraagTekst;
            if (!gegroepeerd[sleutel]) {
                gegroepeerd[sleutel] = v;
                resultaat.push(v);
            } else {
                // Merge investeringIds
                v.investeringIds.forEach(function(iid) {
                    if (gegroepeerd[sleutel].investeringIds.indexOf(iid) === -1) {
                        gegroepeerd[sleutel].investeringIds.push(iid);
                    }
                });
            }
        });

        return resultaat;
    }

    // =========================================================================
    // Vraag beantwoorden
    // =========================================================================

    /**
     * Beantwoord een vraag en werk alle gerelateerde investeringen bij.
     *
     * @param {string} vraagId - ID van de vraag
     * @param {string} antwoord - Het gegeven antwoord
     */
    function beantwoordVraag(vraagId, antwoord) {
        var vraag = DS.getVraag(vraagId);
        if (!vraag) return;

        var instellingen = DS.getInstellingen();
        var proRata = parseFloat(instellingen.proRataPercentage) || 5;
        var bestPct = DS.berekenBestemmingspercentages();

        vraag.antwoord = antwoord;
        vraag.beantwoord = true;
        vraag.beantwoordOp = new Date().toISOString();

        // Bepaal classificatie op basis van antwoord
        var nieuwResultaat = bepaalClassificatieUitAntwoord(vraag, antwoord);
        vraag.antwoordClassificatie = nieuwResultaat.classification;
        vraag.antwoordHerzieningType = nieuwResultaat.herzieningType;

        // Werk alle gerelateerde investeringen bij
        var investeringIds = vraag.investeringIds || [];
        investeringIds.forEach(function(invId) {
            var inv = DS.getInvestering(invId);
            if (inv && !inv.handmatig) {
                inv.classification = nieuwResultaat.classification;
                inv.herzieningType = nieuwResultaat.herzieningType || inv.herzieningType;
                inv.herzieningPeriode = inv.herzieningType === 'roerend' ? 5 : 10;
                inv.status = 'reviewed';
                inv.confidence = 'high';

                // Herbereken aftrekbare BTW
                berekenBestemmingVoorInvestering(inv, bestPct, proRata);

                DS.updateInvestering(invId, inv);
            }
        });

        DS.updateVraag(vraagId, vraag);
        DS.logActiviteit(
            'Vraag beantwoord: "' + vraag.vraagTekst.substring(0, 50) + '..." -> ' +
            U.classificationLabel(nieuwResultaat.classification)
        );
    }

    /**
     * Bepaal de classificatie op basis van het antwoord op een vraag.
     * Parst het antwoord om de juiste classificatie, herzieningstype, etc. af te leiden.
     */
    function bepaalClassificatieUitAntwoord(vraag, antwoord) {
        var resultaat = {
            classification: vraag.classificatie || 'pre-pro-rata',
            herzieningType: vraag.herzieningType || 'onroerend'
        };

        // Percentage-type vragen
        if (vraag.type === 'percentage') {
            var pct = parseFloat(antwoord);
            if (!isNaN(pct)) {
                if (pct >= 100) {
                    resultaat.classification = 'aftrekbaar';
                } else if (pct <= 0) {
                    resultaat.classification = 'niet-aftrekbaar';
                } else {
                    resultaat.classification = 'pre-pro-rata';
                }
            }
            return resultaat;
        }

        // Ja/Nee-type vragen
        if (vraag.type === 'ja-nee') {
            if (antwoord.toLowerCase() === 'ja') {
                resultaat.classification = 'aftrekbaar';
            } else {
                resultaat.classification = 'niet-aftrekbaar';
            }
            return resultaat;
        }

        // Keuze- en tekst-type vragen: parse de tekst
        var la = antwoord.toLowerCase();

        // Aftrekbaar-patronen
        if (la.indexOf('volledig aftrekbaar') > -1 ||
            la.indexOf('volledig commercieel') > -1 ||
            la.indexOf('belaste activiteit') > -1 ||
            la.indexOf('volledig teruglevering') > -1 ||
            la.indexOf('commercieel / betaald') > -1 ||
            la.indexOf('commercieel/betaald') > -1 ||
            la.indexOf('(volledig aftrekbaar)') > -1 ||
            la.indexOf('(aftrekbaar)') > -1) {
            resultaat.classification = 'aftrekbaar';
            return resultaat;
        }

        // Niet-aftrekbaar-patronen
        if (la.indexOf('niet-aftrekbaar') > -1 ||
            la.indexOf('vrijgesteld') > -1 ||
            la.indexOf('zorgactiviteiten') > -1 ||
            la.indexOf('patientenvoeding') > -1 ||
            la.indexOf('patientengebruik') > -1 ||
            la.indexOf('uitsluitend patient') > -1 ||
            la.indexOf('alleen zorg') > -1 ||
            la.indexOf('zorgruimtes') > -1 ||
            la.indexOf('zorgafdelingen') > -1 ||
            la.indexOf('zorggedeelte') > -1 ||
            la.indexOf('verpleegafdeling') > -1 ||
            la.indexOf('gratis voor bezoekers') > -1) {
            resultaat.classification = 'niet-aftrekbaar';
            return resultaat;
        }

        // Bestemmingsverhouding / pre-pro-rata patronen
        if (la.indexOf('bestemmingsverhouding') > -1 ||
            la.indexOf('gehele gebouw') > -1 ||
            la.indexOf('gehele terrein') > -1 ||
            la.indexOf('gehele project') > -1 ||
            la.indexOf('meerdere delen') > -1 ||
            la.indexOf('deels commercieel') > -1 ||
            la.indexOf('mix commercieel') > -1 ||
            la.indexOf('gratis voor personeel') > -1 ||
            la.indexOf('parkeerterrein bezoekers') > -1 ||
            la.indexOf('kantoor / administratie') > -1 ||
            la.indexOf('kantoor/administratie') > -1 ||
            la.indexOf('algemene ruimtes') > -1 ||
            la.indexOf('fiscaal/juridisch') > -1 ||
            la.indexOf('fiscaal advies') > -1 ||
            la.indexOf('(bestemmingsverhouding)') > -1) {
            resultaat.classification = 'pre-pro-rata';
            return resultaat;
        }

        // Herzieningstype: roerend vs. onroerend
        if (la.indexOf('roerend') > -1 || la.indexOf('verplaatsbaar') > -1 ||
            la.indexOf('los') > -1 || la.indexOf('5 jaar') > -1) {
            resultaat.herzieningType = 'roerend';
        }
        if (la.indexOf('onroerend') > -1 || la.indexOf('gebouwgebonden') > -1 ||
            la.indexOf('10 jaar') > -1) {
            resultaat.herzieningType = 'onroerend';
        }

        // Specifieke catering/keuken patronen
        if (la.indexOf('restaurant') > -1 || la.indexOf('keuken') > -1 ||
            la.indexOf('catering') > -1) {
            if (la.indexOf('nee') > -1 || la.indexOf('uitsluitend') > -1) {
                resultaat.classification = 'niet-aftrekbaar';
            } else if (la.indexOf('deels') > -1) {
                resultaat.classification = 'pre-pro-rata';
            } else {
                resultaat.classification = 'aftrekbaar';
            }
            return resultaat;
        }

        return resultaat;
    }

    /**
     * Past een eerder gegeven antwoord toe op een investering.
     */
    function pasAntwoordToe(inv, vraag) {
        if (vraag.beantwoord && vraag.antwoordClassificatie) {
            inv.classification = vraag.antwoordClassificatie;
            inv.status = 'reviewed';
            inv.confidence = 'high';

            if (vraag.antwoordHerzieningType) {
                inv.herzieningType = vraag.antwoordHerzieningType;
                inv.herzieningPeriode = inv.herzieningType === 'roerend' ? 5 : 10;
            }

            // Herbereken aftrekbare BTW met huidige bestemmingspercentages
            var instellingen = DS.getInstellingen();
            var proRata = parseFloat(instellingen.proRataPercentage) || 5;
            var bestPct = DS.berekenBestemmingspercentages();
            berekenBestemmingVoorInvestering(inv, bestPct, proRata);
        }
    }

    // =========================================================================
    // Samenvatting berekenen
    // =========================================================================

    /**
     * Berekent een compleet overzicht inclusief:
     * - Totalen per classificatie
     * - Bestemmingsverhouding
     * - Herzieningsoverzicht (10jr onroerend, 5jr roerend)
     * - Per categorie
     * - Per projecttype
     */
    function berekenSamenvatting() {
        var investeringen = DS.getInvesteringen();
        var instellingen = DS.getInstellingen();
        var proRata = parseFloat(instellingen.proRataPercentage) || 5;
        var bouwjaar = parseInt(instellingen.bouwjaar, 10) || new Date().getFullYear();
        var bestPct = DS.berekenBestemmingspercentages();
        var vragen = DS.getVragen();

        var samenvatting = {
            // Basistotalen
            totaalRegels: investeringen.length,
            totaalBedragExcl: 0,
            totaalBTW: 0,
            totaalAftrekbareBTW: 0,
            totaalNietAftrekbareBTW: 0,

            // Per classificatie
            classificaties: {
                'aftrekbaar':       { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 },
                'niet-aftrekbaar':  { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 },
                'pre-pro-rata':     { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 },
                'onbeoordeeld':     { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 }
            },

            // Per categorie
            categorieen: {},

            // Per projecttype
            projectTypen: {},

            // Herzieningsoverzicht
            herziening: {
                onroerend: { bedragExcl: 0, btw: 0, aftrekbareBTW: 0, periode: 10, startjaar: bouwjaar, regels: 0 },
                roerend:   { bedragExcl: 0, btw: 0, aftrekbareBTW: 0, periode: 5,  startjaar: bouwjaar, regels: 0 }
            },

            // Herzieningsjaartabel (voor rapport)
            herzieningsjaren: {
                onroerend: [],
                roerend: []
            },

            // Bestemmingsverhouding
            bestemming: bestPct,

            // Vragen
            openVragen: 0,
            beantwoordeVragen: 0,

            // Instellingen
            proRataPercentage: proRata,
            bouwjaar: bouwjaar
        };

        // Verwerk investeringen
        investeringen.forEach(function(inv) {
            var bedragExcl = Math.abs(parseFloat(inv.bedragExclBTW) || 0);
            var btw = Math.abs(parseFloat(inv.btwBedrag) || 0);
            var cl = inv.classification || 'onbeoordeeld';
            var aftrekbaar = Math.abs(parseFloat(inv.aftrekbareBTW) || 0);

            // Totalen
            samenvatting.totaalBedragExcl += bedragExcl;
            samenvatting.totaalBTW += btw;
            samenvatting.totaalAftrekbareBTW += aftrekbaar;
            samenvatting.totaalNietAftrekbareBTW += (btw - aftrekbaar);

            // Per classificatie
            if (!samenvatting.classificaties[cl]) {
                samenvatting.classificaties[cl] = { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 };
            }
            samenvatting.classificaties[cl].count++;
            samenvatting.classificaties[cl].bedragExcl += bedragExcl;
            samenvatting.classificaties[cl].btw += btw;
            samenvatting.classificaties[cl].aftrekbareBTW += aftrekbaar;

            // Per categorie
            var cat = inv.categorie || 'overig';
            if (!samenvatting.categorieen[cat]) {
                samenvatting.categorieen[cat] = { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 };
            }
            samenvatting.categorieen[cat].count++;
            samenvatting.categorieen[cat].bedragExcl += bedragExcl;
            samenvatting.categorieen[cat].btw += btw;
            samenvatting.categorieen[cat].aftrekbareBTW += aftrekbaar;

            // Per projecttype
            var pt = inv.projectType || 'overig';
            if (!samenvatting.projectTypen[pt]) {
                samenvatting.projectTypen[pt] = { count: 0, bedragExcl: 0, btw: 0, aftrekbareBTW: 0 };
            }
            samenvatting.projectTypen[pt].count++;
            samenvatting.projectTypen[pt].bedragExcl += bedragExcl;
            samenvatting.projectTypen[pt].btw += btw;
            samenvatting.projectTypen[pt].aftrekbareBTW += aftrekbaar;

            // Herzieningsoverzicht
            var hType = inv.herzieningType || 'onroerend';
            if (hType === 'roerend') {
                samenvatting.herziening.roerend.bedragExcl += bedragExcl;
                samenvatting.herziening.roerend.btw += btw;
                samenvatting.herziening.roerend.aftrekbareBTW += aftrekbaar;
                samenvatting.herziening.roerend.regels++;
            } else {
                samenvatting.herziening.onroerend.bedragExcl += bedragExcl;
                samenvatting.herziening.onroerend.btw += btw;
                samenvatting.herziening.onroerend.aftrekbareBTW += aftrekbaar;
                samenvatting.herziening.onroerend.regels++;
            }
        });

        // Bouw herzieningsjaartabel
        samenvatting.herzieningsjaren.onroerend = bouwHerzieningsjaren(
            samenvatting.herziening.onroerend, 10, bouwjaar
        );
        samenvatting.herzieningsjaren.roerend = bouwHerzieningsjaren(
            samenvatting.herziening.roerend, 5, bouwjaar
        );

        // Vragen tellen
        vragen.forEach(function(v) {
            if (v.beantwoord) {
                samenvatting.beantwoordeVragen++;
            } else {
                samenvatting.openVragen++;
            }
        });

        return samenvatting;
    }

    /**
     * Bouwt een jaartabel voor de herzieningsregeling.
     * Bij onroerend goed: 10 herzieningsjaren (art. 13 lid 2 Uitv.besch. OB).
     * Bij roerend goed: 5 herzieningsjaren (art. 13 lid 3 Uitv.besch. OB).
     *
     * Per herzieningsjaar wordt 1/n van de initieel in aftrek gebrachte BTW herzien
     * als het werkelijke gebruik afwijkt van het gebruik in het boekjaar van ingebruikname.
     *
     * De tabel toont het overzicht op basis van constante bestemmingsverhouding (scenario).
     */
    function bouwHerzieningsjaren(herzData, periodeJaren, startjaar) {
        var jaren = [];
        if (herzData.btw === 0) return jaren;

        var jaarlijksFractie = 1 / periodeJaren;
        var aftrekPerJaar = herzData.aftrekbareBTW * jaarlijksFractie;
        var btwPerJaar = herzData.btw * jaarlijksFractie;

        for (var j = 0; j < periodeJaren; j++) {
            var jaar = startjaar + j;
            jaren.push({
                jaar: jaar,
                herzieningsjaar: j + 1,
                btwFractie: btwPerJaar,
                aftrekbareFractie: aftrekPerJaar,
                nietAftrekbareFractie: btwPerJaar - aftrekPerJaar,
                isStartjaar: j === 0
            });
        }

        return jaren;
    }

    // =========================================================================
    // Publieke API
    // =========================================================================
    return {
        beoordeelAlles: beoordeelAlles,
        beantwoordVraag: beantwoordVraag,
        berekenSamenvatting: berekenSamenvatting,
        berekenPreProRata: berekenPreProRata,
        bepaalClassificatieUitAntwoord: bepaalClassificatieUitAntwoord,

        // Backwards-compatible aliassen (gebruikt door app.js)
        assessAll: beoordeelAlles,
        answerQuestion: beantwoordVraag,
        calculateSummary: berekenSamenvatting
    };
})();
