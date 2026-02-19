/* === Main Application Controller === */
App.Main = (function() {
    'use strict';

    var U = App.Utils;
    var DS = App.DataStore;
    var IH = App.ImportHandler;
    var RE = App.RuleEngine;
    var AS = App.Assessment;
    var RP = App.Reports;

    // Labels
    var PROJECT_TYPE_LABELS = {
        nieuwbouw: 'Nieuwbouw',
        verbouw: 'Verbouw',
        verduurzaming: 'Verduurzaming'
    };
    var CATEGORIE_LABELS = {
        bouwkundig: 'Bouwkundig',
        installaties: 'Installaties',
        afbouw: 'Afbouw',
        terrein: 'Terrein',
        duurzaamheid: 'Duurzaamheid',
        inrichting: 'Inrichting',
        advies: 'Advies'
    };
    var BESTEMMING_LABELS = {
        zorg: 'Zorgverlening (vrijgesteld)',
        kantoor: 'Kantoor / administratie',
        commercieel: 'Commercieel belast',
        algemeen: 'Algemeen / gedeeld'
    };
    var HERZIENINGS_LABELS = {
        onroerend: 'Onroerend goed (10 jaar)',
        roerend: 'Roerend goed (5 jaar)'
    };
    var CONDITION_FIELDS = [
        { key: 'categorie', label: 'Categorie' },
        { key: 'projectType', label: 'Projecttype' },
        { key: 'omschrijving', label: 'Omschrijving' },
        { key: 'leverancier', label: 'Leverancier' },
        { key: 'bedragExclBTW', label: 'Bedrag excl. BTW' },
        { key: 'btwBedrag', label: 'BTW bedrag' },
        { key: 'btwPercentage', label: 'BTW percentage' },
        { key: 'subcategorie', label: 'Subcategorie' },
        { key: 'ruimte', label: 'Ruimte' }
    ];
    var CONDITION_OPERATORS = [
        { key: 'equals', label: 'Gelijk aan' },
        { key: 'contains', label: 'Bevat' },
        { key: 'starts_with', label: 'Begint met' },
        { key: 'in', label: 'In lijst (kommagescheiden)' },
        { key: 'not_empty', label: 'Niet leeg' },
        { key: 'empty', label: 'Leeg' },
        { key: 'greater_than', label: 'Groter dan' },
        { key: 'less_than', label: 'Kleiner dan' }
    ];

    // State
    var currentFactuurHeaders = [];
    var currentFactuurRows = [];
    var investeringenPage = 1;
    var investeringenPerPage = 25;
    var investeringenSortField = '';
    var investeringenSortDir = 'asc';
    var editingRuleId = null;
    var editingRuimteId = null;

    /* ====================================================================
     *  Initialisation
     * ==================================================================== */
    function init() {
        DS.laden();
        RE.laadRegels();

        bindNavigation();
        bindProjectButtons();
        bindRuimtes();
        bindImport();
        bindInvesteringen();
        bindVragen();
        bindRapportage();
        bindInstellingen();
        bindModals();

        updateProjectName();
        refreshDashboard();
        refreshRulesTable();
        refreshRuimtesTable();
        refreshInstellingen();
        updateBadges();
    }

    /* ====================================================================
     *  Navigation
     * ==================================================================== */
    function bindNavigation() {
        document.querySelectorAll('.nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                switchTab(this.dataset.tab);
            });
        });
    }

    function switchTab(tab) {
        document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });

        var btn = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
        var content = document.getElementById('tab-' + tab);
        if (btn) btn.classList.add('active');
        if (content) content.classList.add('active');

        if (tab === 'dashboard') refreshDashboard();
        if (tab === 'ruimtes') { refreshRuimtesTable(); refreshBestemmingSummary(); }
        if (tab === 'investeringen') refreshInvesteringenTable();
        if (tab === 'vragen') refreshVragen();
        if (tab === 'instellingen') { refreshInstellingen(); refreshRulesTable(); }
    }

    /* ====================================================================
     *  Project header
     * ==================================================================== */
    function updateProjectName() {
        var inst = DS.getInstellingen();
        document.getElementById('projectName').textContent = inst.projectNaam || 'Geen project';
    }

    function bindProjectButtons() {
        document.getElementById('btnNewProject').addEventListener('click', function() {
            showModal('modalNieuwProject');
        });

        document.getElementById('btnCreateProject').addEventListener('click', function() {
            var naam = document.getElementById('newProjectNaam').value.trim();
            var org = document.getElementById('newProjectOrganisatie').value.trim();
            var proRata = parseFloat(document.getElementById('newProjectProRata').value) || 5;
            var bouwjaar = parseInt(document.getElementById('newProjectBouwjaar').value, 10) || 2024;

            if (!naam) {
                U.showToast('Voer een projectnaam in.', 'warning');
                return;
            }

            DS.nieuwProject({
                projectNaam: naam,
                organisatie: org,
                proRataPercentage: proRata,
                bouwjaar: bouwjaar
            });
            RE.resetNaarStandaard();
            DS.logActiviteit('Nieuw project aangemaakt: ' + naam);
            updateProjectName();
            hideModal('modalNieuwProject');
            refreshDashboard();
            refreshRuimtesTable();
            refreshRulesTable();
            refreshInstellingen();
            updateBadges();
            U.showToast('Project "' + naam + '" aangemaakt.', 'success');
        });

        document.getElementById('btnSaveProject').addEventListener('click', function() {
            DS.opslaan();
            U.showToast('Project opgeslagen.', 'success');
        });
    }

    /* ====================================================================
     *  Ruimtes & Bestemmingen
     * ==================================================================== */
    function bindRuimtes() {
        document.getElementById('btnAddRuimte').addEventListener('click', function() {
            openRuimteEditor(null);
        });

        document.getElementById('btnSaveRuimte').addEventListener('click', saveRuimte);
    }

    function openRuimteEditor(ruimteId) {
        editingRuimteId = ruimteId;
        var r = ruimteId ? DS.getRuimte(ruimteId) : null;

        document.getElementById('modalRuimteTitle').textContent = r ? 'Ruimte bewerken' : 'Ruimte toevoegen';
        document.getElementById('ruimteNaam').value = r ? (r.naam || '') : '';
        document.getElementById('ruimteOppervlakte').value = r ? (r.oppervlakte || '') : '';
        document.getElementById('ruimteBestemming').value = r ? (r.bestemming || 'zorg') : 'zorg';
        document.getElementById('ruimteToelichting').value = r ? (r.toelichting || '') : '';

        showModal('modalRuimte');
    }

    function saveRuimte() {
        var naam = document.getElementById('ruimteNaam').value.trim();
        var oppervlakte = parseFloat(document.getElementById('ruimteOppervlakte').value) || 0;
        var bestemming = document.getElementById('ruimteBestemming').value;
        var toelichting = document.getElementById('ruimteToelichting').value.trim();

        if (!naam) {
            U.showToast('Voer een naam in voor de ruimte.', 'warning');
            return;
        }
        if (oppervlakte <= 0) {
            U.showToast('Voer een geldige oppervlakte in.', 'warning');
            return;
        }

        var data = {
            naam: naam,
            oppervlakte: oppervlakte,
            bestemming: bestemming,
            toelichting: toelichting
        };

        if (editingRuimteId) {
            DS.updateRuimte(editingRuimteId, data);
            DS.logActiviteit('Ruimte bijgewerkt: ' + naam);
            U.showToast('Ruimte bijgewerkt.', 'success');
        } else {
            DS.addRuimte(data);
            DS.logActiviteit('Ruimte toegevoegd: ' + naam + ' (' + oppervlakte + ' m2, ' + bestemming + ')');
            U.showToast('Ruimte toegevoegd.', 'success');
        }

        hideModal('modalRuimte');
        refreshRuimtesTable();
        refreshBestemmingSummary();
    }

    function refreshRuimtesTable() {
        var ruimtes = DS.getRuimtes();
        var tbody = document.getElementById('ruimtesBody');

        if (ruimtes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nog geen ruimtes gedefinieerd.</td></tr>';
            refreshBestemmingSummary();
            return;
        }

        tbody.innerHTML = ruimtes.map(function(r) {
            return '<tr>' +
                '<td>' + U.escapeHtml(r.naam || '') + '</td>' +
                '<td class="num">' + U.formatNumber(r.oppervlakte || 0) + '</td>' +
                '<td>' + U.escapeHtml(BESTEMMING_LABELS[r.bestemming] || r.bestemming || '') + '</td>' +
                '<td>' + U.escapeHtml(r.toelichting || '') + '</td>' +
                '<td>' +
                    '<button class="btn btn-sm btn-outline btn-edit-ruimte" data-id="' + r.id + '">Bewerk</button> ' +
                    '<button class="btn btn-sm btn-danger btn-delete-ruimte" data-id="' + r.id + '">X</button>' +
                '</td>' +
                '</tr>';
        }).join('');

        tbody.querySelectorAll('.btn-edit-ruimte').forEach(function(btn) {
            btn.addEventListener('click', function() { openRuimteEditor(this.dataset.id); });
        });
        tbody.querySelectorAll('.btn-delete-ruimte').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (confirm('Ruimte verwijderen?')) {
                    DS.deleteRuimte(this.dataset.id);
                    refreshRuimtesTable();
                    refreshBestemmingSummary();
                    DS.logActiviteit('Ruimte verwijderd.');
                    U.showToast('Ruimte verwijderd.', 'success');
                }
            });
        });

        refreshBestemmingSummary();
    }

    function refreshBestemmingSummary() {
        var el = document.getElementById('bestemmingSummary');
        var pcts = DS.berekenBestemmingspercentages();

        if (pcts.totaalM2 === 0) {
            el.innerHTML = '<p class="text-muted">Voeg ruimtes toe om de bestemmingsverdeling te berekenen.</p>';
            return;
        }

        var html = '<table class="report-table">';
        html += '<thead><tr><th>Bestemming</th><th class="num">Oppervlakte (m2)</th><th class="num">Percentage</th></tr></thead>';
        html += '<tbody>';

        var items = [
            { label: 'Zorgverlening (vrijgesteld)', m2: pcts.perBestemming.zorg, pct: pcts.zorgPct },
            { label: 'Kantoor / administratie', m2: pcts.perBestemming.kantoor, pct: pcts.kantoorPct },
            { label: 'Commercieel belast', m2: pcts.perBestemming.commercieel, pct: pcts.commercieelPct },
            { label: 'Algemeen / gedeeld', m2: pcts.perBestemming.algemeen, pct: pcts.algemeenPct }
        ];

        items.forEach(function(item) {
            html += '<tr>';
            html += '<td>' + item.label + '</td>';
            html += '<td class="num">' + U.formatNumber(item.m2) + '</td>';
            html += '<td class="num">' + U.formatPercentage(item.pct) + '</td>';
            html += '</tr>';
        });

        html += '</tbody>';
        html += '<tfoot><tr style="font-weight:600;border-top:2px solid var(--border);">';
        html += '<td>Totaal</td>';
        html += '<td class="num">' + U.formatNumber(pcts.totaalM2) + '</td>';
        html += '<td class="num">100,0%</td>';
        html += '</tr></tfoot></table>';

        html += '<p style="font-size:0.82rem;color:var(--text-light);margin-top:0.5rem;">';
        html += 'Niet-zorg aandeel (kantoor + commercieel + algemeen): <strong>' + U.formatPercentage(pcts.belastPct) + '</strong>';
        html += '</p>';

        el.innerHTML = html;
    }

    /* ====================================================================
     *  Import
     * ==================================================================== */
    function bindImport() {
        // CSV file upload
        var uploadArea = document.getElementById('uploadFacturen');
        var fileInput = document.getElementById('fileFacturen');
        var btnSelect = document.getElementById('btnSelectFacturen');

        btnSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.click();
        });
        uploadArea.addEventListener('click', function() { fileInput.click(); });
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                handleFactuurFile(e.dataTransfer.files[0]);
            }
        });
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) handleFactuurFile(this.files[0]);
        });

        document.getElementById('btnImportFacturen').addEventListener('click', importFacturen);
        document.getElementById('btnCancelFacturen').addEventListener('click', function() {
            document.getElementById('facturenPreview').style.display = 'none';
            currentFactuurHeaders = [];
            currentFactuurRows = [];
        });

        // Manual entry
        document.getElementById('btnAddManual').addEventListener('click', addManualInvestering);

        // Example download
        document.getElementById('btnDownloadExample').addEventListener('click', function() {
            U.downloadCSV(IH.genereerVoorbeeldFacturen(), 'voorbeeld-investeringsfacturen.csv');
            U.showToast('Voorbeeldbestand gedownload.', 'success');
        });
    }

    function handleFactuurFile(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var text = e.target.result;
            var parsed = U.csvToArray(text);
            if (parsed.length < 2) {
                U.showToast('Het bestand bevat onvoldoende gegevens.', 'error');
                return;
            }
            currentFactuurHeaders = parsed[0];
            currentFactuurRows = parsed.slice(1);

            var mapping = IH.autoMapColumns(currentFactuurHeaders, IH.factuurVelden);
            IH.renderMapping('factuurMapping', currentFactuurHeaders, IH.factuurVelden, mapping);
            IH.renderPreviewTable('facturenPreviewTable', currentFactuurHeaders, currentFactuurRows);

            document.getElementById('facturenPreview').style.display = 'block';
            U.showToast(currentFactuurRows.length + ' regels gevonden in bestand.', 'success');
        };
        reader.readAsText(file, 'UTF-8');
    }

    function importFacturen() {
        if (currentFactuurRows.length === 0) return;

        var mapping = IH.getMapping('factuurMapping');

        // Validate: at least omschrijving or bedragExclBTW mapped
        if (mapping.omschrijving < 0 && mapping.bedragExclBTW < 0) {
            U.showToast('Wijs minimaal "Omschrijving" of "Bedrag excl. BTW" toe.', 'warning');
            return;
        }

        var investeringen = IH.parseFactuurregels(currentFactuurRows, mapping);
        DS.addInvesteringen(investeringen);
        DS.logActiviteit(investeringen.length + ' investeringsregels geimporteerd.');

        // Run assessment
        var stats = AS.beoordeelAlles();

        document.getElementById('facturenPreview').style.display = 'none';
        currentFactuurHeaders = [];
        currentFactuurRows = [];

        updateBadges();
        U.showToast(investeringen.length + ' factuurregels geimporteerd en beoordeeld.', 'success');

        switchTab('investeringen');
    }

    function addManualInvestering() {
        var datum = document.getElementById('manualDatum').value;
        var factuurNr = document.getElementById('manualFactuurNr').value.trim();
        var leverancier = document.getElementById('manualLeverancier').value.trim();
        var omschrijving = document.getElementById('manualOmschrijving').value.trim();
        var projectType = document.getElementById('manualProjectType').value;
        var categorie = document.getElementById('manualCategorie').value;
        var bedrag = parseFloat(document.getElementById('manualBedrag').value) || 0;
        var btw = parseFloat(document.getElementById('manualBTW').value) || 0;
        var btwPerc = parseFloat(document.getElementById('manualBTWPerc').value) || 21;

        if (!omschrijving) {
            U.showToast('Voer een omschrijving in.', 'warning');
            return;
        }
        if (bedrag === 0) {
            U.showToast('Voer een bedrag in.', 'warning');
            return;
        }

        // Auto-calculate BTW if not given
        if (btw === 0 && bedrag !== 0 && btwPerc > 0) {
            btw = bedrag * (btwPerc / 100);
        }

        var investering = {
            id: U.generateId(),
            factuurDatum: datum ? U.parseDate(datum) : '',
            factuurNummer: factuurNr,
            leverancier: leverancier,
            omschrijving: omschrijving,
            projectType: projectType,
            categorie: categorie,
            subcategorie: '',
            bedragExclBTW: bedrag,
            btwBedrag: btw,
            btwPercentage: btwPerc,
            ruimte: '',
            classification: '',
            confidence: '',
            status: '',
            herzieningType: 'onroerend',
            herzieningPeriode: 10,
            bestemmingZorgPct: 0,
            bestemmingKantoorPct: 0,
            bestemmingCommercieelPct: 0,
            bestemmingAlgemeenPct: 0,
            aftrekbareBTW: 0,
            regel: '',
            handmatig: false,
            notities: '',
            vraagIds: []
        };

        DS.addInvesteringen([investering]);
        DS.logActiviteit('Handmatige invoer: ' + omschrijving + ' (' + U.formatCurrency(bedrag) + ')');

        // Run assessment on the new item
        AS.beoordeelAlles();

        // Reset form
        document.getElementById('manualDatum').value = '';
        document.getElementById('manualFactuurNr').value = '';
        document.getElementById('manualLeverancier').value = '';
        document.getElementById('manualOmschrijving').value = '';
        document.getElementById('manualBedrag').value = '';
        document.getElementById('manualBTW').value = '';
        document.getElementById('manualBTWPerc').value = '21';

        updateBadges();
        U.showToast('Investering toegevoegd en beoordeeld.', 'success');
    }

    /* ====================================================================
     *  Dashboard
     * ==================================================================== */
    function refreshDashboard() {
        var samenvatting = AS.berekenSamenvatting();
        var investeringen = DS.getInvesteringen();
        var vragen = DS.getVragen();
        var inst = DS.getInstellingen();

        // Stat cards
        document.getElementById('statTotaalRegels').textContent = U.formatNumber(samenvatting.totaalInvesteringen || investeringen.length);

        var clAftrekbaar = samenvatting.classificaties ? samenvatting.classificaties['aftrekbaar'] : null;
        var clNiet = samenvatting.classificaties ? samenvatting.classificaties['niet-aftrekbaar'] : null;
        var clPreProRata = samenvatting.classificaties ? samenvatting.classificaties['pre-pro-rata'] : null;

        document.getElementById('statAftrekbaar').textContent = U.formatNumber(clAftrekbaar ? clAftrekbaar.count : 0);
        document.getElementById('statNietAftrekbaar').textContent = U.formatNumber(clNiet ? clNiet.count : 0);
        document.getElementById('statPreProRata').textContent = U.formatNumber(clPreProRata ? clPreProRata.count : 0);
        document.getElementById('statTotaalBTW').textContent = U.formatCurrency(samenvatting.totaalBTW || 0);

        var openVragen = vragen.filter(function(q) { return !q.answered && !q.beantwoord; }).length;
        document.getElementById('statOpenVragen').textContent = U.formatNumber(openVragen);

        // BTW summary table by category
        var summaryEl = document.getElementById('dashboardSummary');
        if (investeringen.length === 0) {
            summaryEl.innerHTML = '<p class="text-muted">Importeer factuurregels om het overzicht te vullen.</p>';
        } else {
            var html = '<table class="report-table">';
            html += '<thead><tr><th>Classificatie</th><th class="num">Aantal</th><th class="num">BTW</th><th class="num">Aftrekbaar</th></tr></thead><tbody>';
            var classOrder = ['aftrekbaar', 'niet-aftrekbaar', 'pre-pro-rata', 'onbeoordeeld'];
            classOrder.forEach(function(cl) {
                var data = samenvatting.classificaties ? samenvatting.classificaties[cl] : null;
                if (!data || data.count === 0) return;
                html += '<tr>';
                html += '<td>' + U.classificationBadge(cl) + '</td>';
                html += '<td class="num">' + U.formatNumber(data.count) + '</td>';
                html += '<td class="num">' + U.formatCurrency(data.btw) + '</td>';
                html += '<td class="num">' + U.formatCurrency(data.aftrekbareBTW) + '</td>';
                html += '</tr>';
            });
            html += '<tr style="font-weight:600;border-top:2px solid var(--border);">';
            html += '<td>Totaal</td>';
            html += '<td class="num">' + U.formatNumber(investeringen.length) + '</td>';
            html += '<td class="num">' + U.formatCurrency(samenvatting.totaalBTW || 0) + '</td>';
            html += '<td class="num">' + U.formatCurrency(samenvatting.totaalAftrekbareBTW || 0) + '</td>';
            html += '</tr></tbody></table>';
            summaryEl.innerHTML = html;
        }

        // Classification chart - bar chart by project type
        var chartEl = document.getElementById('classificationChart');
        if (investeringen.length === 0) {
            chartEl.innerHTML = '<p class="text-muted">Geen gegevens beschikbaar.</p>';
        } else {
            var projectTypeSummary = {};
            Object.keys(PROJECT_TYPE_LABELS).forEach(function(pt) {
                projectTypeSummary[pt] = { count: 0, bedrag: 0, btw: 0 };
            });
            var geenType = { count: 0, bedrag: 0, btw: 0 };

            investeringen.forEach(function(inv) {
                var pt = inv.projectType;
                if (pt && projectTypeSummary[pt]) {
                    projectTypeSummary[pt].count++;
                    projectTypeSummary[pt].bedrag += Math.abs(inv.bedragExclBTW || 0);
                    projectTypeSummary[pt].btw += Math.abs(inv.btwBedrag || 0);
                } else {
                    geenType.count++;
                    geenType.bedrag += Math.abs(inv.bedragExclBTW || 0);
                    geenType.btw += Math.abs(inv.btwBedrag || 0);
                }
            });

            var maxBedrag = 1;
            Object.keys(projectTypeSummary).forEach(function(pt) {
                if (projectTypeSummary[pt].bedrag > maxBedrag) maxBedrag = projectTypeSummary[pt].bedrag;
            });
            if (geenType.bedrag > maxBedrag) maxBedrag = geenType.bedrag;

            var chartHtml = '<div class="bar-chart">';
            var barColors = { nieuwbouw: 'blue', verbouw: 'purple', verduurzaming: 'green' };

            Object.keys(PROJECT_TYPE_LABELS).forEach(function(pt) {
                var d = projectTypeSummary[pt];
                if (d.count === 0) return;
                var width = Math.max((d.bedrag / maxBedrag * 100), d.count > 0 ? 5 : 0);
                chartHtml += '<div class="bar-row">';
                chartHtml += '<div class="bar-label">' + PROJECT_TYPE_LABELS[pt] + '</div>';
                chartHtml += '<div class="bar-track"><div class="bar-fill bar-fill-' + (barColors[pt] || 'blue') + '" style="width:' + width + '%">' +
                    U.formatCurrency(d.bedrag) + '</div></div>';
                chartHtml += '<div class="bar-value">' + d.count + ' regels</div>';
                chartHtml += '</div>';
            });

            if (geenType.count > 0) {
                var width = Math.max((geenType.bedrag / maxBedrag * 100), 5);
                chartHtml += '<div class="bar-row">';
                chartHtml += '<div class="bar-label">Onbekend</div>';
                chartHtml += '<div class="bar-track"><div class="bar-fill bar-fill-orange" style="width:' + width + '%">' +
                    U.formatCurrency(geenType.bedrag) + '</div></div>';
                chartHtml += '<div class="bar-value">' + geenType.count + ' regels</div>';
                chartHtml += '</div>';
            }

            chartHtml += '</div>';
            chartEl.innerHTML = chartHtml;
        }

        // Recent activity
        var activityEl = document.getElementById('recentActivity');
        var log = DS.getActiviteitenLog();
        if (log.length === 0) {
            activityEl.innerHTML = '<p class="text-muted">Nog geen activiteit.</p>';
        } else {
            var actHtml = '<ul style="list-style:none;padding:0;font-size:0.82rem;">';
            log.slice(0, 8).forEach(function(entry) {
                var time = '';
                try { time = new Date(entry.tijdstip).toLocaleString('nl-NL'); } catch(e) { time = entry.tijdstip || ''; }
                actHtml += '<li style="padding:0.3rem 0;border-bottom:1px solid var(--border-light);">';
                actHtml += '<span style="color:var(--text-light);font-size:0.75rem;">' + U.escapeHtml(time) + '</span><br>';
                actHtml += U.escapeHtml(entry.bericht || '');
                actHtml += '</li>';
            });
            actHtml += '</ul>';
            activityEl.innerHTML = actHtml;
        }

        // Attention points
        var attentionEl = document.getElementById('attentionPoints');
        var points = [];

        if (openVragen > 0) {
            points.push('Er zijn <strong>' + openVragen + '</strong> onbeantwoorde vragen.');
        }

        var onbeoordeeld = samenvatting.classificaties ? samenvatting.classificaties['onbeoordeeld'] : null;
        if (onbeoordeeld && onbeoordeeld.count > 0) {
            points.push('<strong>' + onbeoordeeld.count + '</strong> investeringen zijn nog niet beoordeeld.');
        }

        // Check if ruimtes defined
        var ruimtes = DS.getRuimtes();
        if (ruimtes.length === 0 && investeringen.length > 0) {
            points.push('Er zijn nog geen ruimtes/bestemmingen gedefinieerd. Dit is nodig voor de pre-pro-rata berekening.');
        }

        // Check for investeringen without bestemming
        var zonderBestemming = investeringen.filter(function(inv) {
            return inv.classification === 'pre-pro-rata' &&
                   (inv.bestemmingZorgPct === 0 && inv.bestemmingKantoorPct === 0 &&
                    inv.bestemmingCommercieelPct === 0 && inv.bestemmingAlgemeenPct === 0);
        });
        if (zonderBestemming.length > 0) {
            points.push('<strong>' + zonderBestemming.length + '</strong> pre-pro-rata investeringen hebben nog geen bestemmingsverdeling.');
        }

        if (points.length === 0) {
            if (investeringen.length > 0) {
                attentionEl.innerHTML = '<p style="color:var(--accent);font-weight:500;">Alle investeringen zijn volledig beoordeeld.</p>';
            } else {
                attentionEl.innerHTML = '<p class="text-muted">Geen aandachtspunten.</p>';
            }
        } else {
            attentionEl.innerHTML = '<ul style="font-size:0.85rem;">' +
                points.map(function(p) { return '<li style="margin-bottom:0.3rem;">' + p + '</li>'; }).join('') +
                '</ul>';
        }
    }

    /* ====================================================================
     *  Investeringen Table
     * ==================================================================== */
    function bindInvesteringen() {
        // Filters
        document.getElementById('filterProjectType').addEventListener('change', function() {
            investeringenPage = 1; refreshInvesteringenTable();
        });
        document.getElementById('filterCategorie').addEventListener('change', function() {
            investeringenPage = 1; refreshInvesteringenTable();
        });
        document.getElementById('filterClassificatie').addEventListener('change', function() {
            investeringenPage = 1; refreshInvesteringenTable();
        });
        document.getElementById('filterSearch').addEventListener('input', function() {
            investeringenPage = 1; refreshInvesteringenTable();
        });

        // Sort
        document.querySelectorAll('#investeringenTable th.sortable').forEach(function(th) {
            th.addEventListener('click', function() {
                var field = this.dataset.sort;
                if (investeringenSortField === field) {
                    investeringenSortDir = investeringenSortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    investeringenSortField = field;
                    investeringenSortDir = 'asc';
                }
                refreshInvesteringenTable();
            });
        });

        // Re-assess button
        document.getElementById('btnRunAssessment').addEventListener('click', function() {
            var stats = AS.beoordeelAlles();
            refreshInvesteringenTable();
            updateBadges();
            refreshDashboard();
            U.showToast('Beoordeling opnieuw uitgevoerd.', 'success');
        });
    }

    function getFilteredInvesteringen() {
        var investeringen = DS.getInvesteringen();
        var filterPT = document.getElementById('filterProjectType').value;
        var filterCat = document.getElementById('filterCategorie').value;
        var filterCl = document.getElementById('filterClassificatie').value;
        var filterSearch = document.getElementById('filterSearch').value.toLowerCase();

        return investeringen.filter(function(inv) {
            if (filterPT && inv.projectType !== filterPT) return false;
            if (filterCat && inv.categorie !== filterCat) return false;
            if (filterCl) {
                var cl = inv.classification || 'onbeoordeeld';
                if (cl !== filterCl) return false;
            }
            if (filterSearch) {
                var searchable = [
                    inv.omschrijving, inv.leverancier, inv.factuurNummer,
                    inv.categorie, inv.projectType, inv.subcategorie
                ].join(' ').toLowerCase();
                if (searchable.indexOf(filterSearch) === -1) return false;
            }
            return true;
        });
    }

    function formatBestemmingCompact(inv) {
        var z = Math.round(inv.bestemmingZorgPct || 0);
        var k = Math.round(inv.bestemmingKantoorPct || 0);
        var c = Math.round(inv.bestemmingCommercieelPct || 0);
        if (z === 0 && k === 0 && c === 0) return '<span class="text-muted">-</span>';
        var parts = [];
        if (z > 0) parts.push('Z:' + z);
        if (k > 0) parts.push('K:' + k);
        if (c > 0) parts.push('C:' + c);
        return '<span class="bestemming-compact">' + parts.join(' ') + '</span>';
    }

    function refreshInvesteringenTable() {
        var filtered = getFilteredInvesteringen();

        // Sort
        if (investeringenSortField) {
            filtered.sort(function(a, b) {
                var va = a[investeringenSortField];
                var vb = b[investeringenSortField];
                if (va == null) va = '';
                if (vb == null) vb = '';
                if (typeof va === 'number' && typeof vb === 'number') {
                    return investeringenSortDir === 'asc' ? va - vb : vb - va;
                }
                va = String(va).toLowerCase();
                vb = String(vb).toLowerCase();
                if (va < vb) return investeringenSortDir === 'asc' ? -1 : 1;
                if (va > vb) return investeringenSortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Update sort indicators
        document.querySelectorAll('#investeringenTable th.sortable').forEach(function(th) {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sort === investeringenSortField) {
                th.classList.add('sort-' + investeringenSortDir);
            }
        });

        // Paginate
        var totalPages = Math.ceil(filtered.length / investeringenPerPage) || 1;
        if (investeringenPage > totalPages) investeringenPage = totalPages;
        var start = (investeringenPage - 1) * investeringenPerPage;
        var pageItems = filtered.slice(start, start + investeringenPerPage);

        // Render
        var tbody = document.getElementById('investeringenBody');
        if (pageItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Geen investeringen gevonden.</td></tr>';
        } else {
            tbody.innerHTML = pageItems.map(function(inv) {
                return '<tr data-id="' + inv.id + '">' +
                    '<td>' + U.escapeHtml(U.formatDate(inv.factuurDatum)) + '</td>' +
                    '<td>' + U.escapeHtml(inv.leverancier || '-') + '</td>' +
                    '<td title="' + U.escapeHtml(inv.omschrijving || '') + '">' + U.escapeHtml((inv.omschrijving || '').substring(0, 45)) + '</td>' +
                    '<td>' + U.escapeHtml(PROJECT_TYPE_LABELS[inv.projectType] || inv.projectType || '-') + '</td>' +
                    '<td>' + U.escapeHtml(CATEGORIE_LABELS[inv.categorie] || inv.categorie || '-') + '</td>' +
                    '<td class="num">' + U.formatCurrency(inv.bedragExclBTW) + '</td>' +
                    '<td class="num">' + U.formatCurrency(inv.btwBedrag) + '</td>' +
                    '<td>' + formatBestemmingCompact(inv) + '</td>' +
                    '<td>' + U.classificationBadge(inv.classification) + '</td>' +
                    '<td><button class="btn btn-sm btn-outline btn-edit-investering" data-id="' + inv.id + '">Bekijk</button></td>' +
                    '</tr>';
            }).join('');
        }

        // Bind row clicks
        tbody.querySelectorAll('tr[data-id]').forEach(function(row) {
            row.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON') return;
                openInvesteringDetail(this.dataset.id);
            });
        });
        tbody.querySelectorAll('.btn-edit-investering').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openInvesteringDetail(this.dataset.id);
            });
        });

        // Pagination
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        var pagEl = document.getElementById('investeringenPagination');
        if (totalPages <= 1) {
            pagEl.innerHTML = '';
            return;
        }
        var html = '';
        if (investeringenPage > 1) {
            html += '<button data-page="' + (investeringenPage - 1) + '">&laquo;</button>';
        }
        for (var i = 1; i <= totalPages; i++) {
            if (totalPages > 10 && Math.abs(i - investeringenPage) > 2 && i > 2 && i < totalPages - 1) {
                if (i === investeringenPage - 3 || i === investeringenPage + 3) {
                    html += '<button disabled>...</button>';
                }
                continue;
            }
            html += '<button data-page="' + i + '"' + (i === investeringenPage ? ' class="active"' : '') + '>' + i + '</button>';
        }
        if (investeringenPage < totalPages) {
            html += '<button data-page="' + (investeringenPage + 1) + '">&raquo;</button>';
        }
        pagEl.innerHTML = html;
        pagEl.querySelectorAll('button[data-page]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                investeringenPage = parseInt(this.dataset.page, 10);
                refreshInvesteringenTable();
            });
        });
    }

    /* ====================================================================
     *  Investering Detail Modal
     * ==================================================================== */
    function openInvesteringDetail(id) {
        var inv = DS.getInvestering(id);
        if (!inv) return;

        var inst = DS.getInstellingen();
        var proRata = inst.proRataPercentage || 5;

        var html = '';

        // --- Factuurgegevens ---
        html += '<h4 style="margin-bottom:0.5rem;">Factuurgegevens</h4>';
        html += '<dl class="detail-list">';
        html += '<dt>Factuurdatum</dt><dd>' + U.escapeHtml(U.formatDate(inv.factuurDatum)) + '</dd>';
        html += '<dt>Factuurnummer</dt><dd>' + U.escapeHtml(inv.factuurNummer || '-') + '</dd>';
        html += '<dt>Leverancier</dt><dd>' + U.escapeHtml(inv.leverancier || '-') + '</dd>';
        html += '<dt>Omschrijving</dt><dd>' + U.escapeHtml(inv.omschrijving || '-') + '</dd>';
        html += '<dt>Projecttype</dt><dd>' + U.escapeHtml(PROJECT_TYPE_LABELS[inv.projectType] || inv.projectType || '-') + '</dd>';
        html += '<dt>Categorie</dt><dd>' + U.escapeHtml(CATEGORIE_LABELS[inv.categorie] || inv.categorie || '-') + '</dd>';
        html += '</dl>';

        html += '<dl class="detail-list">';
        html += '<dt>Bedrag excl. BTW</dt><dd><strong>' + U.formatCurrency(inv.bedragExclBTW) + '</strong></dd>';
        html += '<dt>BTW bedrag</dt><dd><strong>' + U.formatCurrency(inv.btwBedrag) + '</strong></dd>';
        html += '<dt>BTW percentage</dt><dd>' + (inv.btwPercentage || 21) + '%</dd>';
        html += '</dl>';

        html += '<hr style="margin:1rem 0;border-color:var(--border-light);">';

        // --- Fiscale beoordeling ---
        html += '<h4 style="margin-bottom:0.5rem;">Fiscale beoordeling</h4>';

        // Classification
        html += '<div class="form-group">';
        html += '<label for="detailClassificatie">Classificatie</label>';
        html += '<select id="detailClassificatie" class="form-select">';
        ['aftrekbaar', 'niet-aftrekbaar', 'pre-pro-rata', 'onbeoordeeld'].forEach(function(cl) {
            html += '<option value="' + cl + '"' + ((inv.classification || 'onbeoordeeld') === cl ? ' selected' : '') + '>' + U.classificationLabel(cl) + '</option>';
        });
        html += '</select></div>';

        // Herzieningtype
        html += '<div class="form-group">';
        html += '<label for="detailHerzieningType">Herzieningstype</label>';
        html += '<select id="detailHerzieningType" class="form-select">';
        html += '<option value="onroerend"' + (inv.herzieningType === 'onroerend' ? ' selected' : '') + '>Onroerend goed (10 jaar)</option>';
        html += '<option value="roerend"' + (inv.herzieningType === 'roerend' ? ' selected' : '') + '>Roerend goed (5 jaar)</option>';
        html += '</select></div>';

        // Bestemming percentages
        html += '<div class="form-group">';
        html += '<label>Bestemmingspercentages</label>';
        html += '<div class="form-row">';
        html += '<div class="form-group"><label for="detailBestZorg">Zorg %</label>';
        html += '<input type="number" id="detailBestZorg" class="form-input" value="' + (inv.bestemmingZorgPct || 0) + '" min="0" max="100" step="0.1"></div>';
        html += '<div class="form-group"><label for="detailBestKantoor">Kantoor %</label>';
        html += '<input type="number" id="detailBestKantoor" class="form-input" value="' + (inv.bestemmingKantoorPct || 0) + '" min="0" max="100" step="0.1"></div>';
        html += '<div class="form-group"><label for="detailBestCommercieel">Commercieel %</label>';
        html += '<input type="number" id="detailBestCommercieel" class="form-input" value="' + (inv.bestemmingCommercieelPct || 0) + '" min="0" max="100" step="0.1"></div>';
        html += '</div>';
        html += '<button class="btn btn-sm btn-outline" id="btnAutoFillBestemming" style="margin-top:0.25rem;">Overnemen van ruimtes</button>';
        html += '</div>';

        // Toegepaste regel
        html += '<div class="form-group"><label>Toegepaste regel</label>';
        html += '<input type="text" class="form-input" value="' + U.escapeHtml(inv.regel || 'Geen') + '" disabled></div>';

        // Pro rata (read only)
        html += '<div class="form-group"><label>Pro rata percentage (instelling)</label>';
        html += '<input type="number" class="form-input" value="' + proRata + '" disabled>';
        html += '<span class="help-text">Wordt ingesteld via Instellingen.</span></div>';

        // Notes
        html += '<div class="form-group"><label for="detailNotities">Notities</label>';
        html += '<textarea id="detailNotities" class="form-input" rows="2">' + U.escapeHtml(inv.notities || '') + '</textarea></div>';

        // Manual override
        html += '<div class="form-group"><label>';
        html += '<input type="checkbox" id="detailHandmatig"' + (inv.handmatig ? ' checked' : '') + '>';
        html += ' Handmatige override (wordt niet overschreven bij herbeoordeling)</label></div>';

        document.getElementById('modalInvesteringBody').innerHTML = html;

        // Auto-fill bestemming from ruimtes
        document.getElementById('btnAutoFillBestemming').addEventListener('click', function() {
            var pcts = DS.berekenBestemmingspercentages();
            if (pcts.totaalM2 === 0) {
                U.showToast('Definieer eerst ruimtes om bestemmingspercentages over te nemen.', 'warning');
                return;
            }
            document.getElementById('detailBestZorg').value = pcts.zorgPct.toFixed(1);
            document.getElementById('detailBestKantoor').value = pcts.kantoorPct.toFixed(1);
            document.getElementById('detailBestCommercieel').value = pcts.commercieelPct.toFixed(1);
            U.showToast('Bestemmingspercentages overgenomen van ruimtedefinities.', 'info');
        });

        // Save handler
        document.getElementById('btnSaveInvestering').onclick = function() {
            var bestZorg = parseFloat(document.getElementById('detailBestZorg').value) || 0;
            var bestKantoor = parseFloat(document.getElementById('detailBestKantoor').value) || 0;
            var bestCommercieel = parseFloat(document.getElementById('detailBestCommercieel').value) || 0;
            var bestAlgemeen = Math.max(0, 100 - bestZorg - bestKantoor - bestCommercieel);

            var updates = {
                classification: document.getElementById('detailClassificatie').value,
                herzieningType: document.getElementById('detailHerzieningType').value,
                herzieningPeriode: document.getElementById('detailHerzieningType').value === 'onroerend' ? 10 : 5,
                bestemmingZorgPct: bestZorg,
                bestemmingKantoorPct: bestKantoor,
                bestemmingCommercieelPct: bestCommercieel,
                bestemmingAlgemeenPct: bestAlgemeen,
                notities: document.getElementById('detailNotities').value,
                handmatig: document.getElementById('detailHandmatig').checked,
                status: 'reviewed',
                confidence: 'high'
            };

            // Recalculate aftrekbare BTW based on classification and bestemming
            var btw = Math.abs(inv.btwBedrag || 0);
            switch (updates.classification) {
                case 'aftrekbaar':
                    updates.aftrekbareBTW = btw;
                    break;
                case 'niet-aftrekbaar':
                    updates.aftrekbareBTW = 0;
                    break;
                case 'pre-pro-rata':
                    // Pre-pro-rata: commercieel deel is volledig aftrekbaar,
                    // kantoor + algemeen deel via pro rata, zorg niet aftrekbaar
                    var commercieelDeel = btw * (bestCommercieel / 100);
                    var kantoorAlgDeel = btw * ((bestKantoor + bestAlgemeen) / 100) * (proRata / 100);
                    updates.aftrekbareBTW = commercieelDeel + kantoorAlgDeel;
                    break;
                default:
                    updates.aftrekbareBTW = 0;
            }

            DS.updateInvestering(id, updates);
            DS.logActiviteit('Investering handmatig aangepast: ' + (inv.omschrijving || '').substring(0, 40) + ' -> ' + U.classificationLabel(updates.classification));
            hideModal('modalInvesteringDetail');
            refreshInvesteringenTable();
            updateBadges();
            U.showToast('Investering opgeslagen.', 'success');
        };

        showModal('modalInvesteringDetail');
    }

    /* ====================================================================
     *  Vragen (Questions)
     * ==================================================================== */
    function bindVragen() {
        document.getElementById('filterVragenStatus').addEventListener('change', refreshVragen);
    }

    function refreshVragen() {
        var vragen = DS.getVragen();
        var filterStatus = document.getElementById('filterVragenStatus').value;

        if (filterStatus === 'open') {
            vragen = vragen.filter(function(q) { return !q.answered && !q.beantwoord; });
        } else if (filterStatus === 'beantwoord') {
            vragen = vragen.filter(function(q) { return q.answered || q.beantwoord; });
        }

        var container = document.getElementById('questionsContainer');

        if (vragen.length === 0) {
            if (DS.getInvesteringen().length === 0) {
                container.innerHTML = '<p class="text-muted">Importeer investeringsfacturen en voer een beoordeling uit om vragen te genereren.</p>';
            } else {
                container.innerHTML = '<p class="text-muted">Geen vragen gevonden.</p>';
            }
            return;
        }

        container.innerHTML = vragen.map(function(q) {
            var isAnswered = q.answered || q.beantwoord;
            var html = '<div class="question-card' + (isAnswered ? ' answered' : '') + '" data-id="' + q.id + '">';

            // Header
            html += '<div class="question-header">';
            html += '<div class="question-text">' + U.escapeHtml(q.questionText || q.vraagTekst || '') + '</div>';
            if (isAnswered) {
                html += '<span class="cl-badge cl-aftrekbaar">Beantwoord</span>';
            }
            html += '</div>';

            // Context
            var mutCount = (q.mutationIds || q.investeringIds || []).length;
            html += '<div class="question-context">';
            html += U.escapeHtml(q.impactDescription || q.impactOmschrijving || q.toelichting || '');
            if (mutCount > 0) html += ' | ' + mutCount + ' investering(en)';
            html += '</div>';

            // Answer options based on type
            var qType = q.type || q.vraagType || 'keuze';
            var qOptions = q.options || q.opties || [];
            if (!qOptions.length && q.questionOptions) {
                qOptions = q.questionOptions.split('\n').filter(function(o) { return o.trim(); });
            }

            if (qType === 'keuze' && qOptions.length > 0) {
                html += '<div class="question-options">';
                qOptions.forEach(function(opt) {
                    var isSelected = isAnswered && (q.answer === opt || q.antwoord === opt);
                    html += '<label class="question-option' + (isSelected ? ' selected' : '') + '">';
                    html += '<input type="radio" name="q_' + q.id + '" value="' + U.escapeHtml(opt) + '"' +
                        (isSelected ? ' checked' : '') + (isAnswered ? ' disabled' : '') + '>';
                    html += ' ' + U.escapeHtml(opt);
                    html += '</label>';
                });
                html += '</div>';
            } else if (qType === 'percentage') {
                html += '<div class="question-percentage" style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0;">';
                html += '<label>Percentage: </label>';
                html += '<input type="number" class="form-input" style="width:100px" id="qpct_' + q.id + '" ' +
                    'value="' + (q.answer || q.antwoord || '50') + '" min="0" max="100"' + (isAnswered ? ' disabled' : '') + '>';
                html += '<span>%</span></div>';
            } else if (qType === 'ja-nee') {
                html += '<div class="question-options">';
                ['Ja', 'Nee'].forEach(function(opt) {
                    var isSelected = isAnswered && (q.answer === opt || q.antwoord === opt);
                    html += '<label class="question-option' + (isSelected ? ' selected' : '') + '">';
                    html += '<input type="radio" name="q_' + q.id + '" value="' + opt + '"' +
                        (isSelected ? ' checked' : '') + (isAnswered ? ' disabled' : '') + '>';
                    html += ' ' + opt + '</label>';
                });
                html += '</div>';
            } else if (qType === 'tekst') {
                html += '<div class="form-group" style="margin:0.5rem 0;">';
                html += '<textarea class="form-input" id="qtxt_' + q.id + '" rows="2"' +
                    (isAnswered ? ' disabled' : '') + '>' + U.escapeHtml(q.answer || q.antwoord || '') + '</textarea>';
                html += '</div>';
            }

            // Linked investeringen summary
            var linkedIds = q.mutationIds || q.investeringIds || [];
            if (linkedIds.length > 0) {
                html += '<div class="question-mutations-list" style="font-size:0.8rem;color:var(--text-light);margin:0.5rem 0;">Gerelateerde investeringen: ';
                var invList = linkedIds.slice(0, 3).map(function(invId) {
                    var linked = DS.getInvestering(invId);
                    return linked ? (U.escapeHtml((linked.omschrijving || '').substring(0, 30)) + ' - ' + U.formatCurrency(linked.bedragExclBTW)) : invId;
                });
                html += invList.join(', ');
                if (linkedIds.length > 3) html += ' en ' + (linkedIds.length - 3) + ' meer';
                html += '</div>';
            }

            // Action / Answer display
            if (!isAnswered) {
                html += '<div class="question-actions" style="margin-top:0.5rem;">';
                html += '<button class="btn btn-primary btn-answer-question" data-id="' + q.id + '">Beantwoorden</button>';
                html += '</div>';
            } else {
                html += '<div class="question-impact" style="font-size:0.85rem;margin-top:0.5rem;">';
                html += 'Antwoord: <em>' + U.escapeHtml(q.answer || q.antwoord || '') + '</em>';
                if (q.answerClassification || q.antwoordClassificatie) {
                    html += ' &rarr; ' + U.classificationBadge(q.answerClassification || q.antwoordClassificatie);
                }
                html += '</div>';
            }

            html += '</div>';
            return html;
        }).join('');

        // Bind answer buttons
        container.querySelectorAll('.btn-answer-question').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var qId = this.dataset.id;
                var q = DS.getVraag(qId);
                if (!q) return;

                var qType = q.type || q.vraagType || 'keuze';
                var answer = '';

                if (qType === 'keuze' || qType === 'ja-nee') {
                    var selected = container.querySelector('input[name="q_' + qId + '"]:checked');
                    if (!selected) {
                        U.showToast('Selecteer een antwoord.', 'warning');
                        return;
                    }
                    answer = selected.value;
                } else if (qType === 'percentage') {
                    var pctInput = document.getElementById('qpct_' + qId);
                    answer = pctInput ? pctInput.value : '0';
                } else if (qType === 'tekst') {
                    var txtInput = document.getElementById('qtxt_' + qId);
                    answer = txtInput ? txtInput.value : '';
                }

                if (!answer) {
                    U.showToast('Voer een antwoord in.', 'warning');
                    return;
                }

                AS.beantwoordVraag(qId, answer);
                refreshVragen();
                updateBadges();
                U.showToast('Vraag beantwoord.', 'success');
            });
        });
    }

    /* ====================================================================
     *  Rapportage
     * ==================================================================== */
    function bindRapportage() {
        document.getElementById('btnGenerateReport').addEventListener('click', function() {
            var html = RP.genereerFiscaalRapport();
            document.getElementById('reportContent').innerHTML = html;
            document.getElementById('reportOutput').style.display = 'block';
            DS.logActiviteit('Fiscaal investeringsrapport gegenereerd.');
            U.showToast('Rapport gegenereerd.', 'success');
        });

        document.getElementById('btnExportCSV').addEventListener('click', function() {
            var csv = RP.exporteerInvesteringenCSV();
            var inst = DS.getInstellingen();
            var fileName = 'btw-investeringen-' + (inst.projectNaam || 'export').replace(/\s+/g, '-') + '.csv';
            U.downloadCSV(csv, fileName);
            U.showToast('Investeringen geexporteerd als CSV.', 'success');
        });

        document.getElementById('btnExportSummary').addEventListener('click', function() {
            var csv = RP.exporteerSamenvattingCSV();
            var inst = DS.getInstellingen();
            var fileName = 'btw-samenvatting-' + (inst.projectNaam || 'export').replace(/\s+/g, '-') + '.csv';
            U.downloadCSV(csv, fileName);
            U.showToast('Samenvatting geexporteerd als CSV.', 'success');
        });

        document.getElementById('btnPrintReport').addEventListener('click', function() {
            window.print();
        });
    }

    /* ====================================================================
     *  Instellingen
     * ==================================================================== */
    function bindInstellingen() {
        // Save settings
        document.getElementById('btnSaveSettings').addEventListener('click', function() {
            var settings = {
                projectNaam: document.getElementById('settingProjectNaam').value.trim(),
                organisatie: document.getElementById('settingOrganisatie').value.trim(),
                proRataPercentage: parseFloat(document.getElementById('settingProRata').value) || 5,
                bouwjaar: parseInt(document.getElementById('settingBouwjaar').value, 10) || 2024,
                periode: document.getElementById('settingPeriode').value.trim()
            };
            DS.saveInstellingen(settings);
            updateProjectName();
            DS.logActiviteit('Instellingen bijgewerkt.');
            U.showToast('Instellingen opgeslagen.', 'success');
        });

        // Rules
        document.getElementById('btnAddRule').addEventListener('click', function() {
            openRuleEditor(null);
        });

        document.getElementById('btnResetRules').addEventListener('click', function() {
            if (confirm('Weet u zeker dat u de standaardregels wilt herstellen? Aangepaste regels gaan verloren.')) {
                RE.resetNaarStandaard();
                refreshRulesTable();
                DS.logActiviteit('Classificatieregels teruggezet naar standaard.');
                U.showToast('Standaardregels hersteld.', 'success');
            }
        });

        // Data management
        document.getElementById('btnExportProject').addEventListener('click', function() {
            var data = DS.exporteerProject();
            data.regels = RE.getRegels();
            var inst = DS.getInstellingen();
            var fileName = 'btw-project-' + (inst.projectNaam || 'export').replace(/\s+/g, '-') + '.json';
            U.downloadJSON(data, fileName);
            DS.logActiviteit('Project geexporteerd als JSON.');
            U.showToast('Project geexporteerd.', 'success');
        });

        document.getElementById('btnImportProject').addEventListener('click', function() {
            document.getElementById('fileImportProject').click();
        });

        document.getElementById('fileImportProject').addEventListener('change', function() {
            if (this.files.length === 0) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var data = JSON.parse(e.target.result);
                    if (data.regels) {
                        RE.setRegels(data.regels);
                        delete data.regels;
                    }
                    DS.importeerProject(data);
                    updateProjectName();
                    refreshDashboard();
                    refreshRulesTable();
                    refreshRuimtesTable();
                    refreshInstellingen();
                    updateBadges();
                    DS.logActiviteit('Project geimporteerd vanuit JSON.');
                    U.showToast('Project geimporteerd.', 'success');
                } catch(err) {
                    U.showToast('Fout bij importeren: ' + err.message, 'error');
                }
            };
            reader.readAsText(this.files[0]);
            this.value = '';
        });

        document.getElementById('btnClearData').addEventListener('click', function() {
            if (confirm('Weet u zeker dat u ALLE gegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
                DS.wisAlles();
                RE.resetNaarStandaard();
                updateProjectName();
                refreshDashboard();
                refreshRulesTable();
                refreshRuimtesTable();
                refreshInstellingen();
                updateBadges();
                U.showToast('Alle gegevens gewist.', 'success');
            }
        });
    }

    function refreshInstellingen() {
        var inst = DS.getInstellingen();
        document.getElementById('settingProjectNaam').value = inst.projectNaam || '';
        document.getElementById('settingOrganisatie').value = inst.organisatie || '';
        document.getElementById('settingProRata').value = inst.proRataPercentage || 5;
        document.getElementById('settingBouwjaar').value = inst.bouwjaar || 2024;
        document.getElementById('settingPeriode').value = inst.periode || '';
    }

    /* ====================================================================
     *  Rules Table & Editor
     * ==================================================================== */
    function refreshRulesTable() {
        var regels = RE.getRegels().slice().sort(function(a, b) {
            return (a.priority || 50) - (b.priority || 50);
        });

        var tbody = document.getElementById('rulesBody');
        if (regels.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Geen regels gedefinieerd.</td></tr>';
            return;
        }

        tbody.innerHTML = regels.map(function(r) {
            var condStr = (r.conditions || []).map(function(c) {
                return RE.voorwaardeBeschrijving(c);
            }).join(' EN ');

            return '<tr>' +
                '<td>' + (r.priority || 50) + '</td>' +
                '<td>' + U.escapeHtml(r.name || r.naam || '') + '</td>' +
                '<td style="font-size:0.75rem;">' + U.escapeHtml(condStr) + '</td>' +
                '<td>' + U.classificationBadge(r.classification) + '</td>' +
                '<td>' + (r.active !== false ? 'Ja' : 'Nee') + '</td>' +
                '<td>' +
                    '<button class="btn btn-sm btn-outline btn-edit-rule" data-id="' + r.id + '">Bewerk</button> ' +
                    '<button class="btn btn-sm btn-danger btn-delete-rule" data-id="' + r.id + '">X</button>' +
                '</td></tr>';
        }).join('');

        tbody.querySelectorAll('.btn-edit-rule').forEach(function(btn) {
            btn.addEventListener('click', function() { openRuleEditor(this.dataset.id); });
        });
        tbody.querySelectorAll('.btn-delete-rule').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (confirm('Regel verwijderen?')) {
                    RE.verwijderRegel(this.dataset.id);
                    refreshRulesTable();
                    U.showToast('Regel verwijderd.', 'success');
                }
            });
        });
    }

    function openRuleEditor(ruleId) {
        editingRuleId = ruleId;
        var regel = ruleId ? RE.getRegel(ruleId) : null;

        document.getElementById('modalRegelTitle').textContent = regel ? 'Regel bewerken' : 'Nieuwe regel';
        document.getElementById('ruleNaam').value = regel ? (regel.name || regel.naam || '') : '';
        document.getElementById('rulePrioriteit').value = regel ? (regel.priority || 50) : 50;
        document.getElementById('ruleClassificatie').value = regel ? (regel.classification || 'pre-pro-rata') : 'pre-pro-rata';
        document.getElementById('ruleHerzieningType').value = regel ? (regel.herzieningType || 'onroerend') : 'onroerend';
        document.getElementById('ruleOmschrijving').value = regel ? (regel.description || '') : '';
        document.getElementById('ruleActief').checked = regel ? (regel.active !== false) : true;
        document.getElementById('ruleVraagStellen').checked = regel ? (regel.askQuestion === true) : false;
        document.getElementById('ruleVraagTekst').value = regel ? (regel.questionText || '') : '';
        document.getElementById('ruleVraagType').value = regel ? (regel.questionType || 'keuze') : 'keuze';
        document.getElementById('ruleVraagOptiesTekst').value = regel ? (regel.questionOptions || '') : '';

        toggleQuestionFields();
        toggleQuestionOptions();

        // Render conditions
        var defaultConditions = [{ field: 'categorie', operator: 'equals', value: '' }];
        renderConditions(regel && regel.conditions && regel.conditions.length > 0 ? regel.conditions : defaultConditions);

        showModal('modalRegel');
    }

    function toggleQuestionFields() {
        var show = document.getElementById('ruleVraagStellen').checked;
        document.getElementById('ruleVraagGroup').style.display = show ? 'block' : 'none';
    }

    function toggleQuestionOptions() {
        var type = document.getElementById('ruleVraagType').value;
        document.getElementById('ruleVraagOpties').style.display = type === 'keuze' ? 'block' : 'none';
    }

    function renderConditions(conditions) {
        var container = document.getElementById('ruleConditions');
        container.innerHTML = '';

        conditions.forEach(function(cond, idx) {
            var row = document.createElement('div');
            row.className = 'condition-row';
            row.style.display = 'flex';
            row.style.gap = '0.5rem';
            row.style.marginBottom = '0.5rem';
            row.style.alignItems = 'center';

            // Field select
            var fieldSelect = document.createElement('select');
            fieldSelect.className = 'form-select';
            fieldSelect.dataset.idx = idx;
            fieldSelect.dataset.part = 'field';
            CONDITION_FIELDS.forEach(function(f) {
                var opt = document.createElement('option');
                opt.value = f.key;
                opt.textContent = f.label;
                if (cond.field === f.key) opt.selected = true;
                fieldSelect.appendChild(opt);
            });

            // Operator select
            var opSelect = document.createElement('select');
            opSelect.className = 'form-select';
            opSelect.dataset.idx = idx;
            opSelect.dataset.part = 'operator';
            CONDITION_OPERATORS.forEach(function(o) {
                var opt = document.createElement('option');
                opt.value = o.key;
                opt.textContent = o.label;
                if (cond.operator === o.key) opt.selected = true;
                opSelect.appendChild(opt);
            });

            // Value input
            var valInput = document.createElement('input');
            valInput.type = 'text';
            valInput.className = 'form-input';
            valInput.dataset.idx = idx;
            valInput.dataset.part = 'value';
            valInput.value = cond.value || '';
            valInput.placeholder = 'Waarde';
            valInput.style.flex = '1';

            // Remove button
            var removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';
            removeBtn.type = 'button';
            removeBtn.innerHTML = '&times;';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.border = 'none';
            removeBtn.style.background = 'none';
            removeBtn.style.fontSize = '1.2rem';
            removeBtn.style.color = 'var(--danger, #dc3545)';
            removeBtn.addEventListener('click', function() {
                row.remove();
            });

            row.appendChild(fieldSelect);
            row.appendChild(opSelect);
            row.appendChild(valInput);
            row.appendChild(removeBtn);
            container.appendChild(row);
        });
    }

    function getConditionsFromEditor() {
        var rows = document.querySelectorAll('#ruleConditions .condition-row');
        var conditions = [];
        rows.forEach(function(row) {
            var field = row.querySelector('select[data-part="field"]');
            var operator = row.querySelector('select[data-part="operator"]');
            var value = row.querySelector('input[data-part="value"]');
            if (field && operator) {
                conditions.push({
                    field: field.value,
                    operator: operator.value,
                    value: value ? value.value : ''
                });
            }
        });
        return conditions;
    }

    function saveRule() {
        var name = document.getElementById('ruleNaam').value.trim();
        if (!name) {
            U.showToast('Voer een regelnaam in.', 'warning');
            return;
        }

        var conditions = getConditionsFromEditor();
        if (conditions.length === 0) {
            U.showToast('Voeg minimaal een voorwaarde toe.', 'warning');
            return;
        }

        var ruleData = {
            name: name,
            priority: parseInt(document.getElementById('rulePrioriteit').value, 10) || 50,
            conditions: conditions,
            classification: document.getElementById('ruleClassificatie').value,
            herzieningType: document.getElementById('ruleHerzieningType').value,
            description: document.getElementById('ruleOmschrijving').value.trim(),
            active: document.getElementById('ruleActief').checked,
            askQuestion: document.getElementById('ruleVraagStellen').checked,
            questionText: document.getElementById('ruleVraagTekst').value.trim(),
            questionType: document.getElementById('ruleVraagType').value,
            questionOptions: document.getElementById('ruleVraagOptiesTekst').value.trim()
        };

        if (editingRuleId) {
            RE.updateRegel(editingRuleId, ruleData);
            DS.logActiviteit('Regel bijgewerkt: ' + name);
            U.showToast('Regel bijgewerkt.', 'success');
        } else {
            RE.voegRegelToe(ruleData);
            DS.logActiviteit('Nieuwe regel toegevoegd: ' + name);
            U.showToast('Regel toegevoegd.', 'success');
        }

        hideModal('modalRegel');
        refreshRulesTable();
    }

    /* ====================================================================
     *  Modals
     * ==================================================================== */
    function bindModals() {
        // Close buttons
        document.querySelectorAll('[data-close-modal]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                hideModal(this.dataset.closeModal);
            });
        });

        // Click overlay to close
        document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                }
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
                    if (overlay.style.display === 'flex') {
                        overlay.style.display = 'none';
                    }
                });
            }
        });

        // Rule save button
        document.getElementById('btnSaveRule').addEventListener('click', saveRule);

        // Add condition button
        document.getElementById('btnAddCondition').addEventListener('click', function() {
            var conditions = getConditionsFromEditor();
            conditions.push({ field: 'categorie', operator: 'equals', value: '' });
            renderConditions(conditions);
        });

        // Question toggle
        document.getElementById('ruleVraagStellen').addEventListener('change', toggleQuestionFields);

        // Question type toggle options
        document.getElementById('ruleVraagType').addEventListener('change', toggleQuestionOptions);
    }

    function showModal(id) {
        document.getElementById(id).style.display = 'flex';
    }

    function hideModal(id) {
        document.getElementById(id).style.display = 'none';
    }

    /* ====================================================================
     *  Badges
     * ==================================================================== */
    function updateBadges() {
        var investeringen = DS.getInvesteringen();
        var vragen = DS.getVragen();
        var openVragen = vragen.filter(function(q) { return !q.answered && !q.beantwoord; });

        document.getElementById('badgeInvesteringen').textContent = investeringen.length;
        document.getElementById('badgeVragen').textContent = openVragen.length;
    }

    /* ====================================================================
     *  Bootstrap
     * ==================================================================== */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init: init,
        switchTab: switchTab,
        refreshDashboard: refreshDashboard,
        refreshInvesteringenTable: refreshInvesteringenTable,
        refreshVragen: refreshVragen,
        refreshRuimtesTable: refreshRuimtesTable
    };
})();
