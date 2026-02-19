/* === Data Store - localStorage persistence === */
App.DataStore = (function() {
    'use strict';

    var STORAGE_KEY = 'zorg_btw_tool';

    var defaultData = {
        settings: {
            projectNaam: '',
            organisatie: '',
            proRataPercentage: 5,
            periode: '',
            created: null,
            lastModified: null
        },
        mutations: [],
        crediteuren: [],
        questions: [],
        activityLog: []
    };

    var data = null;

    function load() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                data = JSON.parse(stored);
                // Ensure all keys exist
                if (!data.settings) data.settings = Object.assign({}, defaultData.settings);
                if (!data.mutations) data.mutations = [];
                if (!data.crediteuren) data.crediteuren = [];
                if (!data.questions) data.questions = [];
                if (!data.activityLog) data.activityLog = [];
            } else {
                data = JSON.parse(JSON.stringify(defaultData));
            }
        } catch(e) {
            console.error('Fout bij laden gegevens:', e);
            data = JSON.parse(JSON.stringify(defaultData));
        }
        return data;
    }

    function save() {
        try {
            if (data) {
                data.settings.lastModified = new Date().toISOString();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        } catch(e) {
            console.error('Fout bij opslaan gegevens:', e);
            App.Utils.showToast('Fout bij opslaan. Mogelijk is de opslag vol.', 'error');
        }
    }

    function getData() {
        if (!data) load();
        return data;
    }

    function getSettings() {
        return getData().settings;
    }

    function saveSettings(settings) {
        Object.assign(getData().settings, settings);
        save();
    }

    function getMutations() {
        return getData().mutations;
    }

    function setMutations(mutations) {
        getData().mutations = mutations;
        save();
    }

    function addMutations(newMutations) {
        var existing = getData().mutations;
        getData().mutations = existing.concat(newMutations);
        save();
    }

    function updateMutation(id, updates) {
        var mutations = getData().mutations;
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].id === id) {
                Object.assign(mutations[i], updates);
                save();
                return mutations[i];
            }
        }
        return null;
    }

    function getMutation(id) {
        var mutations = getData().mutations;
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].id === id) return mutations[i];
        }
        return null;
    }

    function getCrediteuren() {
        return getData().crediteuren;
    }

    function setCrediteuren(crediteuren) {
        getData().crediteuren = crediteuren;
        save();
    }

    function addCrediteuren(newCrediteuren) {
        var existing = getData().crediteuren;
        // Merge: overwrite existing by code
        var map = {};
        existing.forEach(function(c) { map[c.code] = c; });
        newCrediteuren.forEach(function(c) { map[c.code] = c; });
        getData().crediteuren = Object.values(map);
        save();
    }

    function getCrediteur(code) {
        var crediteuren = getData().crediteuren;
        for (var i = 0; i < crediteuren.length; i++) {
            if (crediteuren[i].code === code) return crediteuren[i];
        }
        return null;
    }

    function getQuestions() {
        return getData().questions;
    }

    function setQuestions(questions) {
        getData().questions = questions;
        save();
    }

    function addQuestions(newQuestions) {
        var existing = getData().questions;
        getData().questions = existing.concat(newQuestions);
        save();
    }

    function updateQuestion(id, updates) {
        var questions = getData().questions;
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].id === id) {
                Object.assign(questions[i], updates);
                save();
                return questions[i];
            }
        }
        return null;
    }

    function getQuestion(id) {
        var questions = getData().questions;
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].id === id) return questions[i];
        }
        return null;
    }

    function addActivity(message) {
        var log = getData().activityLog;
        log.unshift({
            timestamp: new Date().toISOString(),
            message: message
        });
        // Keep last 50 entries
        if (log.length > 50) log.length = 50;
        save();
    }

    function getActivityLog() {
        return getData().activityLog;
    }

    function clearAll() {
        data = JSON.parse(JSON.stringify(defaultData));
        save();
    }

    function exportProject() {
        return JSON.parse(JSON.stringify(getData()));
    }

    function importProject(projectData) {
        data = projectData;
        if (!data.settings) data.settings = Object.assign({}, defaultData.settings);
        if (!data.mutations) data.mutations = [];
        if (!data.crediteuren) data.crediteuren = [];
        if (!data.questions) data.questions = [];
        if (!data.activityLog) data.activityLog = [];
        save();
    }

    function newProject(settings) {
        data = JSON.parse(JSON.stringify(defaultData));
        Object.assign(data.settings, settings);
        data.settings.created = new Date().toISOString();
        save();
    }

    return {
        load: load,
        save: save,
        getData: getData,
        getSettings: getSettings,
        saveSettings: saveSettings,
        getMutations: getMutations,
        setMutations: setMutations,
        addMutations: addMutations,
        updateMutation: updateMutation,
        getMutation: getMutation,
        getCrediteuren: getCrediteuren,
        setCrediteuren: setCrediteuren,
        addCrediteuren: addCrediteuren,
        getCrediteur: getCrediteur,
        getQuestions: getQuestions,
        setQuestions: setQuestions,
        addQuestions: addQuestions,
        updateQuestion: updateQuestion,
        getQuestion: getQuestion,
        addActivity: addActivity,
        getActivityLog: getActivityLog,
        clearAll: clearAll,
        exportProject: exportProject,
        importProject: importProject,
        newProject: newProject
    };
})();
