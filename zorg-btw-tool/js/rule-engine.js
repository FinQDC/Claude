/* === Regelengine - BTW classificatieregels voor bouw/verbouw/duurzaamheid === */
App.RuleEngine = (function() {
    'use strict';

    var REGELS_SLEUTEL = 'zorg_btw_inv_regels';

    function getStandaardRegels() {
        return [
            // === BOUWKUNDIG ===
            {
                id: 'r001', name: 'Bouwkundig - nieuwbouw/verbouw', priority: 10,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'bouwkundig' }],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Bouwkundige werkzaamheden aan het gebouw: BTW-aftrek op basis van bestemmingsverhouding (m2). Onroerend goed, herzieningstermijn 10 jaar.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            // === INSTALLATIES ===
            {
                id: 'r010', name: 'Installaties - gebouwgebonden', priority: 10,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'installaties' }],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Gebouwgebonden installaties (HVAC, elektra, sanitair, liften): onroerend, aftrek op basis van bestemmingsverhouding.',
                active: true, askQuestion: true,
                questionText: 'Betreft deze installatie het gehele gebouw of een specifiek gebouwdeel?',
                questionType: 'keuze',
                questionOptions: 'Gehele gebouw (bestemmingsverhouding)\nAlleen zorggedeelte (niet-aftrekbaar)\nAlleen kantoor/commercieel gedeelte (aftrekbaar)\nSpecifiek voor keuken/restaurant (aftrekbaar)'
            },
            // === AFBOUW ===
            {
                id: 'r020', name: 'Afbouw - interieur', priority: 10,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'afbouw' }],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Afbouw en interieur (wanden, vloeren, plafonds): onroerend, aftrek op basis van bestemming van het betreffende gebouwdeel.',
                active: true, askQuestion: true,
                questionText: 'In welk gebouwdeel worden deze afbouwwerkzaamheden uitgevoerd?',
                questionType: 'keuze',
                questionOptions: 'Gehele gebouw / meerdere delen (bestemmingsverhouding)\nVerpleegafdeling / zorgruimtes (niet-aftrekbaar)\nKantoor / administratie (pro rata via bestemmingsverhouding)\nRestaurant / keuken (aftrekbaar)\nAlgemene ruimtes (hal, gang) (bestemmingsverhouding)'
            },
            // === TERREIN ===
            {
                id: 'r030', name: 'Terrein - buitenruimte', priority: 10,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'terrein' }],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Terreininrichting en buitenruimte: onroerend, aftrek op basis van bestemmingsverhouding gebouw.',
                active: true, askQuestion: true,
                questionText: 'Betreft de terreininrichting het parkeerterrein, de tuin of het gehele terrein?',
                questionType: 'keuze',
                questionOptions: 'Gehele terrein (bestemmingsverhouding)\nParkeerterrein bezoekers/personeel (bestemmingsverhouding)\nParkeerterrein commercieel/betaald (aftrekbaar)\nTuin/groen patientengebruik (niet-aftrekbaar)'
            },
            // === DUURZAAMHEID - specifieke regels ===
            {
                id: 'r040', name: 'Zonnepanelen', priority: 5,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'duurzaamheid' },
                    { field: 'omschrijving', operator: 'contains', value: 'zonnepa' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Zonnepanelen op het dak: BTW aftrekbaar op basis van bestemmingsverhouding gebouw. Let op: als stroom wordt teruggeleverd aan het net is dit een belaste prestatie die het pro rata percentage kan verhogen.',
                active: true, askQuestion: true,
                questionText: 'Worden de zonnepanelen gebruikt voor eigen verbruik, teruglevering aan het net, of beide?',
                questionType: 'keuze',
                questionOptions: 'Volledig eigen verbruik (bestemmingsverhouding gebouw)\nDeels teruglevering aan net (volledig aftrekbaar - belaste activiteit)\nVolledig teruglevering aan net (volledig aftrekbaar)'
            },
            {
                id: 'r041', name: 'Warmtepomp / WKO', priority: 5,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'duurzaamheid' },
                    { field: 'omschrijving', operator: 'contains', value: 'warmtepomp' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Warmtepomp/WKO installatie: gebouwgebonden, onroerend goed. BTW-aftrek op basis van bestemmingsverhouding.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r042', name: 'WKO installatie', priority: 5,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'duurzaamheid' },
                    { field: 'omschrijving', operator: 'contains', value: 'wko' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'WKO (warmte-koude opslag): gebouwgebonden, onroerend goed.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r043', name: 'Isolatie', priority: 5,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'duurzaamheid' },
                    { field: 'omschrijving', operator: 'contains', value: 'isolatie' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Isolatie (gevel, dak, vloer): onroerend, onderdeel van het gebouw. Aftrek op basis van bestemmingsverhouding.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r044', name: 'LED verlichting', priority: 5,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'duurzaamheid' },
                    { field: 'omschrijving', operator: 'contains', value: 'led' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'LED verlichting: als vast aangebracht geldt dit als onroerend. Aftrek op basis van bestemmingsverhouding.',
                active: true, askQuestion: true,
                questionText: 'Betreft de LED verlichting het gehele gebouw of een specifiek deel?',
                questionType: 'keuze',
                questionOptions: 'Gehele gebouw (bestemmingsverhouding)\nAlleen zorggedeelte (niet-aftrekbaar)\nAlleen kantoor/commercieel (aftrekbaar)'
            },
            {
                id: 'r045', name: 'Laadpalen', priority: 5,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'duurzaamheid' },
                    { field: 'omschrijving', operator: 'contains', value: 'laadp' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'roerend',
                description: 'Laadpalen: kwalificeren doorgaans als roerend goed (herzieningstermijn 5 jaar). Aftrek afhankelijk van gebruik.',
                active: true, askQuestion: true,
                questionText: 'Worden de laadpalen commercieel geexploiteerd (betaald laden) of gratis beschikbaar gesteld?',
                questionType: 'keuze',
                questionOptions: 'Commercieel / betaald laden (volledig aftrekbaar)\nGratis voor personeel (bestemmingsverhouding)\nGratis voor bezoekers/patienten (niet-aftrekbaar)\nMix commercieel en gratis (bestemmingsverhouding)'
            },
            {
                id: 'r046', name: 'Duurzaamheid overig', priority: 15,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'duurzaamheid' }],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Overige duurzaamheidsinvesteringen: standaard als onroerend/gebouwgebonden, aftrek op basis van bestemmingsverhouding.',
                active: true, askQuestion: true,
                questionText: 'Is deze duurzaamheidsinvestering gebouwgebonden (onroerend) of los/verplaatsbaar (roerend)?',
                questionType: 'keuze',
                questionOptions: 'Gebouwgebonden / onroerend (herzieningstermijn 10 jaar)\nLos / verplaatsbaar / roerend (herzieningstermijn 5 jaar)'
            },
            // === INRICHTING ===
            {
                id: 'r050', name: 'Inrichting - zorgmeubilair', priority: 8,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'inrichting' },
                    { field: 'omschrijving', operator: 'contains', value: 'zorg' }
                ],
                classification: 'niet-aftrekbaar', herzieningType: 'roerend',
                description: 'Zorgmeubilair (bedden, tilliften, etc.): direct bestemd voor vrijgestelde zorgverlening. Roerend goed.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r051', name: 'Inrichting - medische apparatuur', priority: 8,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'inrichting' },
                    { field: 'omschrijving', operator: 'contains', value: 'medisch' }
                ],
                classification: 'niet-aftrekbaar', herzieningType: 'roerend',
                description: 'Medische apparatuur: direct bestemd voor vrijgestelde zorgverlening.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r052', name: 'Inrichting - kantoormeubilair', priority: 8,
                conditions: [
                    { field: 'categorie', operator: 'equals', value: 'inrichting' },
                    { field: 'omschrijving', operator: 'contains', value: 'kantoor' }
                ],
                classification: 'pre-pro-rata', herzieningType: 'roerend',
                description: 'Kantoormeubilair: roerend goed, pro rata aftrek via bestemmingsverhouding.',
                active: true, askQuestion: false, questionText: '', questionType: '', questionOptions: ''
            },
            {
                id: 'r053', name: 'Inrichting - overig', priority: 20,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'inrichting' }],
                classification: 'pre-pro-rata', herzieningType: 'roerend',
                description: 'Overige inrichting/inventaris: roerend goed (herzieningstermijn 5 jaar). Bestemming bepaalt aftrekbaarheid.',
                active: true, askQuestion: true,
                questionText: 'Wat is de bestemming van deze inrichting/inventaris?',
                questionType: 'keuze',
                questionOptions: 'Zorgafdelingen / patientenzorg (niet-aftrekbaar)\nKantoor / administratie (bestemmingsverhouding)\nRestaurant / keuken (aftrekbaar)\nAlgemene ruimtes (bestemmingsverhouding)'
            },
            // === ADVIES ===
            {
                id: 'r060', name: 'Advies - bouwbegeleiding', priority: 10,
                conditions: [{ field: 'categorie', operator: 'equals', value: 'advies' }],
                classification: 'pre-pro-rata', herzieningType: 'onroerend',
                description: 'Advies- en begeleidingskosten (architect, bouwbegeleiding, fiscaal advies): volgen de bestemming van het bouwproject. Als gerelateerd aan het gehele gebouw: bestemmingsverhouding.',
                active: true, askQuestion: true,
                questionText: 'Heeft dit advies betrekking op het gehele bouwproject of op een specifiek onderdeel?',
                questionType: 'keuze',
                questionOptions: 'Gehele project (bestemmingsverhouding)\nAlleen zorggedeelte (niet-aftrekbaar)\nAlleen commercieel gedeelte (aftrekbaar)\nFiscaal/juridisch advies algemeen (bestemmingsverhouding)'
            },
            // === KEUKENINSTALLATIE ===
            {
                id: 'r070', name: 'Keukeninstallatie commercieel', priority: 5,
                conditions: [
                    { field: 'omschrijving', operator: 'contains', value: 'keuken' }
                ],
                classification: 'aftrekbaar', herzieningType: 'onroerend',
                description: 'Professionele keukeninstallatie: als de keuken (mede) wordt gebruikt voor commerciele catering/restaurant is de BTW (deels) aftrekbaar.',
                active: true, askQuestion: true,
                questionText: 'Wordt de keuken (mede) gebruikt voor commerciele catering of een personeelsrestaurant met vergoeding?',
                questionType: 'keuze',
                questionOptions: 'Ja, volledig commercieel restaurant (volledig aftrekbaar)\nJa, deels commercieel, deels patientenvoeding (bestemmingsverhouding)\nNee, uitsluitend patientenvoeding (niet-aftrekbaar)'
            }
        ];
    }

    var regels = null;

    function laadRegels() {
        try {
            var opgeslagen = localStorage.getItem(REGELS_SLEUTEL);
            if (opgeslagen) {
                regels = JSON.parse(opgeslagen);
            } else {
                regels = getStandaardRegels();
                slaRegelsOp();
            }
        } catch(e) {
            regels = getStandaardRegels();
        }
        return regels;
    }

    function slaRegelsOp() {
        try {
            localStorage.setItem(REGELS_SLEUTEL, JSON.stringify(regels));
        } catch(e) {
            console.error('Fout bij opslaan regels:', e);
        }
    }

    function getRegels() { if (!regels) laadRegels(); return regels; }
    function setRegels(nieuw) { regels = nieuw; slaRegelsOp(); }
    function resetNaarStandaard() { regels = getStandaardRegels(); slaRegelsOp(); }

    function voegRegelToe(regel) {
        if (!regel.id) regel.id = App.Utils.generateId();
        getRegels().push(regel);
        slaRegelsOp();
    }

    function updateRegel(id, updates) {
        var r = getRegels();
        for (var i = 0; i < r.length; i++) {
            if (r[i].id === id) { Object.assign(r[i], updates); slaRegelsOp(); return r[i]; }
        }
        return null;
    }

    function verwijderRegel(id) {
        var r = getRegels();
        for (var i = 0; i < r.length; i++) {
            if (r[i].id === id) { r.splice(i, 1); slaRegelsOp(); return true; }
        }
        return false;
    }

    function getRegel(id) {
        var r = getRegels();
        for (var i = 0; i < r.length; i++) {
            if (r[i].id === id) return r[i];
        }
        return null;
    }

    // Evalueer een enkele voorwaarde
    function evalueerVoorwaarde(voorwaarde, investering) {
        var veldWaarde = String(investering[voorwaarde.field] || '').trim();
        var voorwaardeWaarde = String(voorwaarde.value || '').trim();

        switch (voorwaarde.operator) {
            case 'equals':
                return veldWaarde.toLowerCase() === voorwaardeWaarde.toLowerCase();
            case 'contains':
                return veldWaarde.toLowerCase().indexOf(voorwaardeWaarde.toLowerCase()) > -1;
            case 'starts_with':
                return veldWaarde.toLowerCase().indexOf(voorwaardeWaarde.toLowerCase()) === 0;
            case 'in':
                var waarden = voorwaardeWaarde.toLowerCase().split(',').map(function(v) { return v.trim(); });
                return waarden.indexOf(veldWaarde.toLowerCase()) > -1;
            case 'not_empty':
                return veldWaarde.length > 0;
            case 'empty':
                return veldWaarde.length === 0;
            case 'greater_than':
                return parseFloat(veldWaarde) > parseFloat(voorwaardeWaarde);
            case 'less_than':
                return parseFloat(veldWaarde) < parseFloat(voorwaardeWaarde);
            default:
                return false;
        }
    }

    // Evalueer alle voorwaarden van een regel (EN-logica)
    function evalueerRegel(regel, investering) {
        if (!regel.active) return false;
        if (!regel.conditions || regel.conditions.length === 0) return false;
        for (var i = 0; i < regel.conditions.length; i++) {
            if (!evalueerVoorwaarde(regel.conditions[i], investering)) return false;
        }
        return true;
    }

    // Classificeer een investering, geeft de matchende regel terug
    function classificeer(investering) {
        var gesorteerd = getRegels().slice().sort(function(a, b) {
            return (a.priority || 50) - (b.priority || 50);
        });
        for (var i = 0; i < gesorteerd.length; i++) {
            if (evalueerRegel(gesorteerd[i], investering)) return gesorteerd[i];
        }
        return null;
    }

    function voorwaardeBeschrijving(voorwaarde) {
        var veldLabels = {
            'categorie': 'Categorie', 'projectType': 'Projecttype',
            'omschrijving': 'Omschrijving', 'leverancier': 'Leverancier',
            'bedragExclBTW': 'Bedrag', 'btwBedrag': 'BTW',
            'btwPercentage': 'BTW%', 'subcategorie': 'Subcategorie',
            'ruimte': 'Ruimte'
        };
        var opLabels = {
            'equals': '=', 'contains': 'bevat', 'starts_with': 'begint met',
            'in': 'in lijst', 'not_empty': 'niet leeg', 'empty': 'leeg',
            'greater_than': '>', 'less_than': '<'
        };
        var veld = veldLabels[voorwaarde.field] || voorwaarde.field;
        var op = opLabels[voorwaarde.operator] || voorwaarde.operator;
        if (voorwaarde.operator === 'not_empty' || voorwaarde.operator === 'empty') {
            return veld + ' ' + op;
        }
        return veld + ' ' + op + ' "' + (voorwaarde.value || '') + '"';
    }

    return {
        getStandaardRegels: getStandaardRegels,
        laadRegels: laadRegels, slaRegelsOp: slaRegelsOp,
        getRegels: getRegels, setRegels: setRegels,
        resetNaarStandaard: resetNaarStandaard,
        voegRegelToe: voegRegelToe, updateRegel: updateRegel,
        verwijderRegel: verwijderRegel, getRegel: getRegel,
        classificeer: classificeer,
        evalueerVoorwaarde: evalueerVoorwaarde,
        evalueerRegel: evalueerRegel,
        voorwaardeBeschrijving: voorwaardeBeschrijving
    };
})();
