/* === Data Store - localStorage opslag voor investeringsprojecten === */
App.DataStore = (function() {
    'use strict';

    var OPSLAG_SLEUTEL = 'zorg_btw_investering';

    var standaardData = {
        instellingen: {
            projectNaam: '',
            organisatie: '',
            proRataPercentage: 5,
            bouwjaar: 2024,
            periode: '',
            aangemaakt: null,
            laatstGewijzigd: null
        },
        investeringen: [],
        ruimtes: [],
        vragen: [],
        activiteitenLog: []
    };

    var data = null;

    function laden() {
        try {
            var opgeslagen = localStorage.getItem(OPSLAG_SLEUTEL);
            if (opgeslagen) {
                data = JSON.parse(opgeslagen);
                if (!data.instellingen) data.instellingen = JSON.parse(JSON.stringify(standaardData.instellingen));
                if (!data.investeringen) data.investeringen = [];
                if (!data.ruimtes) data.ruimtes = [];
                if (!data.vragen) data.vragen = [];
                if (!data.activiteitenLog) data.activiteitenLog = [];
            } else {
                data = JSON.parse(JSON.stringify(standaardData));
            }
        } catch(e) {
            console.error('Fout bij laden gegevens:', e);
            data = JSON.parse(JSON.stringify(standaardData));
        }
        return data;
    }

    function opslaan() {
        try {
            if (data) {
                data.instellingen.laatstGewijzigd = new Date().toISOString();
                localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(data));
            }
        } catch(e) {
            console.error('Fout bij opslaan:', e);
            App.Utils.showToast('Fout bij opslaan. Mogelijk is de opslag vol.', 'error');
        }
    }

    function getData() {
        if (!data) laden();
        return data;
    }

    // Instellingen
    function getInstellingen() { return getData().instellingen; }
    function saveInstellingen(inst) {
        Object.assign(getData().instellingen, inst);
        opslaan();
    }

    // Investeringen
    function getInvesteringen() { return getData().investeringen; }
    function setInvesteringen(inv) { getData().investeringen = inv; opslaan(); }
    function addInvesteringen(nieuw) {
        getData().investeringen = getData().investeringen.concat(nieuw);
        opslaan();
    }
    function updateInvestering(id, updates) {
        var lijst = getData().investeringen;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) {
                Object.assign(lijst[i], updates);
                opslaan();
                return lijst[i];
            }
        }
        return null;
    }
    function getInvestering(id) {
        var lijst = getData().investeringen;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) return lijst[i];
        }
        return null;
    }

    // Ruimtes
    function getRuimtes() { return getData().ruimtes; }
    function addRuimte(ruimte) {
        if (!ruimte.id) ruimte.id = App.Utils.generateId();
        getData().ruimtes.push(ruimte);
        opslaan();
    }
    function updateRuimte(id, updates) {
        var lijst = getData().ruimtes;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) {
                Object.assign(lijst[i], updates);
                opslaan();
                return lijst[i];
            }
        }
        return null;
    }
    function deleteRuimte(id) {
        var lijst = getData().ruimtes;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) { lijst.splice(i, 1); opslaan(); return true; }
        }
        return false;
    }
    function getRuimte(id) {
        var lijst = getData().ruimtes;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) return lijst[i];
        }
        return null;
    }

    // Bestemmingsverdeling berekenen op basis van ruimtes
    function berekenBestemmingspercentages() {
        var ruimtes = getRuimtes();
        var totaal = 0;
        var perBestemming = { zorg: 0, kantoor: 0, commercieel: 0, algemeen: 0 };

        ruimtes.forEach(function(r) {
            var opp = parseFloat(r.oppervlakte) || 0;
            totaal += opp;
            if (perBestemming[r.bestemming] !== undefined) {
                perBestemming[r.bestemming] += opp;
            }
        });

        if (totaal === 0) return { totaalM2: 0, zorgPct: 0, kantoorPct: 0, commercieelPct: 0, algemeenPct: 0, belastPct: 0 };

        var zorgPct = (perBestemming.zorg / totaal) * 100;
        var kantoorPct = (perBestemming.kantoor / totaal) * 100;
        var commercieelPct = (perBestemming.commercieel / totaal) * 100;
        var algemeenPct = (perBestemming.algemeen / totaal) * 100;

        // Belast percentage = commercieel + (kantoor + algemeen) als pro rata basis
        // Voor de pre-pro-rata: het deel dat NIET uitsluitend zorg is
        var belastPct = commercieelPct + kantoorPct + algemeenPct;

        return {
            totaalM2: totaal,
            zorgPct: zorgPct,
            kantoorPct: kantoorPct,
            commercieelPct: commercieelPct,
            algemeenPct: algemeenPct,
            belastPct: belastPct,
            perBestemming: perBestemming
        };
    }

    // Vragen
    function getVragen() { return getData().vragen; }
    function setVragen(vragen) { getData().vragen = vragen; opslaan(); }
    function addVragen(nieuw) {
        getData().vragen = getData().vragen.concat(nieuw);
        opslaan();
    }
    function updateVraag(id, updates) {
        var lijst = getData().vragen;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) {
                Object.assign(lijst[i], updates);
                opslaan();
                return lijst[i];
            }
        }
        return null;
    }
    function getVraag(id) {
        var lijst = getData().vragen;
        for (var i = 0; i < lijst.length; i++) {
            if (lijst[i].id === id) return lijst[i];
        }
        return null;
    }

    // Activiteitenlog
    function logActiviteit(bericht) {
        var log = getData().activiteitenLog;
        log.unshift({ tijdstip: new Date().toISOString(), bericht: bericht });
        if (log.length > 50) log.length = 50;
        opslaan();
    }
    function getActiviteitenLog() { return getData().activiteitenLog; }

    // Project beheer
    function wisAlles() {
        data = JSON.parse(JSON.stringify(standaardData));
        opslaan();
    }
    function exporteerProject() {
        return JSON.parse(JSON.stringify(getData()));
    }
    function importeerProject(projectData) {
        data = projectData;
        if (!data.instellingen) data.instellingen = JSON.parse(JSON.stringify(standaardData.instellingen));
        if (!data.investeringen) data.investeringen = [];
        if (!data.ruimtes) data.ruimtes = [];
        if (!data.vragen) data.vragen = [];
        if (!data.activiteitenLog) data.activiteitenLog = [];
        opslaan();
    }
    function nieuwProject(inst) {
        data = JSON.parse(JSON.stringify(standaardData));
        Object.assign(data.instellingen, inst);
        data.instellingen.aangemaakt = new Date().toISOString();
        opslaan();
    }

    return {
        laden: laden, opslaan: opslaan, getData: getData,
        getInstellingen: getInstellingen, saveInstellingen: saveInstellingen,
        getInvesteringen: getInvesteringen, setInvesteringen: setInvesteringen,
        addInvesteringen: addInvesteringen, updateInvestering: updateInvestering,
        getInvestering: getInvestering,
        getRuimtes: getRuimtes, addRuimte: addRuimte, updateRuimte: updateRuimte,
        deleteRuimte: deleteRuimte, getRuimte: getRuimte,
        berekenBestemmingspercentages: berekenBestemmingspercentages,
        getVragen: getVragen, setVragen: setVragen, addVragen: addVragen,
        updateVraag: updateVraag, getVraag: getVraag,
        logActiviteit: logActiviteit, getActiviteitenLog: getActiviteitenLog,
        wisAlles: wisAlles, exporteerProject: exporteerProject,
        importeerProject: importeerProject, nieuwProject: nieuwProject
    };
})();
