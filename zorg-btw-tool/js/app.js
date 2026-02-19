/* === Main Application Controller === */
App.Main = (function() {
    'use strict';

    var U = App.Utils;
    var DS = App.DataStore;
    var IH = App.ImportHandler;
    var RE = App.RuleEngine;
    var AS = App.Assessment;
    var RP = App.Reports;

    // State
    var currentMutatieHeaders = [];
    var currentMutatieRows = [];
    var currentCrediteurHeaders = [];
    var currentCrediteurRows = [];
    var mutationsPage = 1;
    var mutationsPerPage = 25;
    var mutationsSortField = '';
    var mutationsSortDir = 'asc';
    var editingRuleId = null;

    function init() {
        DS.load();
        RE.loadRules();

        bindNavigation();
        bindImport();
        bindMutations();
        bindQuestions();
        bindReports();
        bindSettings();
        bindModals();

        updateProjectName();
        refreshDashboard();
        refreshRulesTable();
        updateBadges();
    }

    // === Navigation ===
    function bindNavigation() {
        document.querySelectorAll('.nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tab = this.dataset.tab;
                switchTab(tab);
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

        // Refresh tab-specific content
        if (tab === 'dashboard') refreshDashboard();
        if (tab === 'mutaties') refreshMutationsTable();
        if (tab === 'vragen') refreshQuestions();
        if (tab === 'instellingen') refreshSettings();
    }

    // === Project ===
    function updateProjectName() {
        var settings = DS.getSettings();
        var nameEl = document.getElementById('projectName');
        nameEl.textContent = settings.projectNaam || 'Geen project geladen';
    }

    function bindProjectButtons() {
        document.getElementById('btnNewProject').addEventListener('click', function() {
            showModal('modalNieuwProject');
        });

        document.getElementById('btnCreateProject').addEventListener('click', function() {
            var naam = document.getElementById('newProjectNaam').value.trim();
            var org = document.getElementById('newProjectOrganisatie').value.trim();
            var proRata = parseFloat(document.getElementById('newProjectProRata').value) || 5;

            if (!naam) {
                U.showToast('Voer een projectnaam in.', 'warning');
                return;
            }

            DS.newProject({ projectNaam: naam, organisatie: org, proRataPercentage: proRata });
            DS.addActivity('Nieuw project aangemaakt: ' + naam);
            updateProjectName();
            hideModal('modalNieuwProject');
            refreshDashboard();
            U.showToast('Project "' + naam + '" aangemaakt.', 'success');
        });

        document.getElementById('btnSaveProject').addEventListener('click', function() {
            DS.save();
            U.showToast('Project opgeslagen.', 'success');
        });
    }

    // === Import ===
    function bindImport() {
        bindProjectButtons();

        // Mutations upload
        var uploadMutaties = document.getElementById('uploadMutaties');
        var fileMutaties = document.getElementById('fileMutaties');
        var btnSelectMutaties = document.getElementById('btnSelectMutaties');

        btnSelectMutaties.addEventListener('click', function(e) {
            e.stopPropagation();
            fileMutaties.click();
        });
        uploadMutaties.addEventListener('click', function() { fileMutaties.click(); });
        uploadMutaties.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        uploadMutaties.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        uploadMutaties.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                handleMutatieFile(e.dataTransfer.files[0]);
            }
        });
        fileMutaties.addEventListener('change', function() {
            if (this.files.length > 0) handleMutatieFile(this.files[0]);
        });

        document.getElementById('btnImportMutaties').addEventListener('click', importMutaties);
        document.getElementById('btnCancelMutaties').addEventListener('click', function() {
            document.getElementById('mutatiesPreview').style.display = 'none';
            currentMutatieHeaders = [];
            currentMutatieRows = [];
        });

        // Crediteuren upload
        var uploadCrediteuren = document.getElementById('uploadCrediteuren');
        var fileCrediteuren = document.getElementById('fileCrediteuren');
        var btnSelectCrediteuren = document.getElementById('btnSelectCrediteuren');

        btnSelectCrediteuren.addEventListener('click', function(e) {
            e.stopPropagation();
            fileCrediteuren.click();
        });
        uploadCrediteuren.addEventListener('click', function() { fileCrediteuren.click(); });
        uploadCrediteuren.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        uploadCrediteuren.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        uploadCrediteuren.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                handleCrediteurFile(e.dataTransfer.files[0]);
            }
        });
        fileCrediteuren.addEventListener('change', function() {
            if (this.files.length > 0) handleCrediteurFile(this.files[0]);
        });

        document.getElementById('btnImportCrediteuren').addEventListener('click', importCrediteuren);
        document.getElementById('btnCancelCrediteuren').addEventListener('click', function() {
            document.getElementById('crediteurenPreview').style.display = 'none';
            currentCrediteurHeaders = [];
            currentCrediteurRows = [];
        });

        // Example downloads
        document.getElementById('btnDownloadExampleMutaties').addEventListener('click', function() {
            U.downloadCSV(IH.generateExampleMutations(), 'voorbeeld-mutaties.csv');
            U.showToast('Voorbeeldbestand gedownload.', 'success');
        });
        document.getElementById('btnDownloadExampleCrediteuren').addEventListener('click', function() {
            U.downloadCSV(IH.generateExampleCrediteuren(), 'voorbeeld-crediteuren.csv');
            U.showToast('Voorbeeldbestand gedownload.', 'success');
        });
    }

    function handleMutatieFile(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var text = e.target.result;
            var parsed = U.csvToArray(text);
            if (parsed.length < 2) {
                U.showToast('Het bestand bevat onvoldoende gegevens.', 'error');
                return;
            }
            currentMutatieHeaders = parsed[0];
            currentMutatieRows = parsed.slice(1);

            var mapping = IH.autoMapColumns(currentMutatieHeaders, IH.mutationFields);
            IH.renderMapping('mutatieMapping', currentMutatieHeaders, IH.mutationFields, mapping);
            IH.renderPreviewTable('mutatiesPreviewTable', currentMutatieHeaders, currentMutatieRows);

            document.getElementById('mutatiesPreview').style.display = 'block';
            U.showToast(currentMutatieRows.length + ' regels gevonden in bestand.', 'success');
        };
        reader.readAsText(file, 'UTF-8');
    }

    function handleCrediteurFile(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var text = e.target.result;
            var parsed = U.csvToArray(text);
            if (parsed.length < 2) {
                U.showToast('Het bestand bevat onvoldoende gegevens.', 'error');
                return;
            }
            currentCrediteurHeaders = parsed[0];
            currentCrediteurRows = parsed.slice(1);

            var mapping = IH.autoMapColumns(currentCrediteurHeaders, IH.crediteurFields);
            IH.renderMapping('crediteurMapping', currentCrediteurHeaders, IH.crediteurFields, mapping);
            IH.renderPreviewTable('crediteurenPreviewTable', currentCrediteurHeaders, currentCrediteurRows);

            document.getElementById('crediteurenPreview').style.display = 'block';
            U.showToast(currentCrediteurRows.length + ' crediteuren gevonden.', 'success');
        };
        reader.readAsText(file, 'UTF-8');
    }

    function importMutaties() {
        if (currentMutatieRows.length === 0) return;

        var mapping = IH.getMapping('mutatieMapping');

        // Validate required fields
        if (mapping.ledgerAccount < 0) {
            U.showToast('Wijs minimaal de kolom "Grootboekrekening" toe.', 'warning');
            return;
        }

        var mutations = IH.parseMutations(currentMutatieRows, mapping);
        DS.addMutations(mutations);
        DS.addActivity(mutations.length + ' grootboekmutaties geimporteerd.');

        // Run assessment
        var stats = AS.assessAll();

        document.getElementById('mutatiesPreview').style.display = 'none';
        currentMutatieHeaders = [];
        currentMutatieRows = [];

        updateBadges();
        U.showToast(mutations.length + ' mutaties geimporteerd en beoordeeld. ' + stats.needsReview + ' vragen open.', 'success');

        // Switch to mutations tab
        switchTab('mutaties');
    }

    function importCrediteuren() {
        if (currentCrediteurRows.length === 0) return;

        var mapping = IH.getMapping('crediteurMapping');

        if (mapping.code < 0) {
            U.showToast('Wijs minimaal de kolom "Crediteurcode" toe.', 'warning');
            return;
        }

        var crediteuren = IH.parseCrediteuren(currentCrediteurRows, mapping);
        DS.addCrediteuren(crediteuren);
        DS.addActivity(crediteuren.length + ' crediteuren geimporteerd.');

        document.getElementById('crediteurenPreview').style.display = 'none';
        currentCrediteurHeaders = [];
        currentCrediteurRows = [];

        U.showToast(crediteuren.length + ' crediteuren geimporteerd.', 'success');
    }

    // === Dashboard ===
    function refreshDashboard() {
        var summary = AS.calculateSummary();

        document.getElementById('statTotaalMutaties').textContent = U.formatNumber(summary.totaalMutaties);
        document.getElementById('statAftrekbaar').textContent = U.formatNumber(summary.classificaties['aftrekbaar'].count);
        document.getElementById('statNietAftrekbaar').textContent = U.formatNumber(summary.classificaties['niet-aftrekbaar'].count);
        document.getElementById('statProRata').textContent = U.formatNumber(summary.classificaties['pro-rata'].count);
        document.getElementById('statPreProRata').textContent = U.formatNumber(summary.classificaties['pre-pro-rata'].count);
        document.getElementById('statOpenVragen').textContent = U.formatNumber(summary.openVragen);

        // Summary table
        var summaryEl = document.getElementById('dashboardSummary');
        if (summary.totaalMutaties === 0) {
            summaryEl.innerHTML = '<p class="text-muted">Importeer eerst gegevens om een overzicht te zien.</p>';
        } else {
            var html = '<table class="report-table">';
            html += '<thead><tr><th>Categorie</th><th class="num">BTW</th><th class="num">Aftrekbaar</th></tr></thead><tbody>';
            var classOrder = ['aftrekbaar', 'niet-aftrekbaar', 'pro-rata', 'pre-pro-rata'];
            classOrder.forEach(function(cl) {
                var data = summary.classificaties[cl];
                if (!data || data.count === 0) return;
                html += '<tr><td>' + U.classificationBadge(cl) + '</td>';
                html += '<td class="num">' + U.formatCurrency(data.btw) + '</td>';
                html += '<td class="num">' + U.formatCurrency(data.aftrekbareBTW) + '</td></tr>';
            });
            html += '<tr style="font-weight:600;border-top:2px solid var(--border);">';
            html += '<td>Totaal</td>';
            html += '<td class="num">' + U.formatCurrency(summary.totaalBTW) + '</td>';
            html += '<td class="num">' + U.formatCurrency(summary.totaalAftrekbareBTW) + '</td></tr>';
            html += '</tbody></table>';
            summaryEl.innerHTML = html;
        }

        // Chart
        var chartEl = document.getElementById('classificationChart');
        if (summary.totaalMutaties === 0) {
            chartEl.innerHTML = '<p class="text-muted">Geen gegevens beschikbaar.</p>';
        } else {
            var maxCount = Math.max(
                summary.classificaties['aftrekbaar'].count,
                summary.classificaties['niet-aftrekbaar'].count,
                summary.classificaties['pro-rata'].count,
                summary.classificaties['pre-pro-rata'].count,
                summary.classificaties['onbeoordeeld'].count,
                1
            );
            var chartHtml = '<div class="bar-chart">';
            var bars = [
                { label: 'Aftrekbaar', count: summary.classificaties['aftrekbaar'].count, color: 'green' },
                { label: 'Niet-aftrekbaar', count: summary.classificaties['niet-aftrekbaar'].count, color: 'red' },
                { label: 'Pro rata', count: summary.classificaties['pro-rata'].count, color: 'blue' },
                { label: 'Pre-pro-rata', count: summary.classificaties['pre-pro-rata'].count, color: 'purple' },
                { label: 'Onbeoordeeld', count: summary.classificaties['onbeoordeeld'].count, color: 'orange' }
            ];
            bars.forEach(function(bar) {
                var pct = (bar.count / summary.totaalMutaties * 100).toFixed(1);
                var width = Math.max((bar.count / maxCount * 100), bar.count > 0 ? 5 : 0);
                chartHtml += '<div class="bar-row">';
                chartHtml += '<div class="bar-label">' + bar.label + '</div>';
                chartHtml += '<div class="bar-track"><div class="bar-fill bar-fill-' + bar.color + '" style="width:' + width + '%">' +
                    (bar.count > 0 ? bar.count : '') + '</div></div>';
                chartHtml += '<div class="bar-value">' + pct + '%</div>';
                chartHtml += '</div>';
            });
            chartHtml += '</div>';
            chartEl.innerHTML = chartHtml;
        }

        // Recent activity
        var activityEl = document.getElementById('recentActivity');
        var log = DS.getActivityLog();
        if (log.length === 0) {
            activityEl.innerHTML = '<p class="text-muted">Nog geen activiteit.</p>';
        } else {
            var actHtml = '<ul style="list-style:none;font-size:0.82rem;">';
            log.slice(0, 8).forEach(function(entry) {
                var time = new Date(entry.timestamp).toLocaleString('nl-NL');
                actHtml += '<li style="padding:0.3rem 0;border-bottom:1px solid var(--border-light);">';
                actHtml += '<span style="color:var(--text-light);font-size:0.75rem;">' + time + '</span><br>';
                actHtml += U.escapeHtml(entry.message);
                actHtml += '</li>';
            });
            actHtml += '</ul>';
            activityEl.innerHTML = actHtml;
        }

        // Attention points
        var attentionEl = document.getElementById('attentionPoints');
        var points = [];
        if (summary.openVragen > 0) {
            points.push('Er zijn <strong>' + summary.openVragen + '</strong> onbeantwoorde vragen.');
        }
        if (summary.classificaties['onbeoordeeld'].count > 0) {
            points.push('<strong>' + summary.classificaties['onbeoordeeld'].count + '</strong> mutaties zijn nog niet beoordeeld.');
        }
        if (summary.classificaties['onbeoordeeld'].btw > 0) {
            points.push('Onbeoordeelde mutaties bevatten <strong>' + U.formatCurrency(summary.classificaties['onbeoordeeld'].btw) + '</strong> aan BTW.');
        }
        if (points.length === 0) {
            if (summary.totaalMutaties > 0) {
                attentionEl.innerHTML = '<p style="color:var(--accent);font-weight:500;">Alle mutaties zijn beoordeeld!</p>';
            } else {
                attentionEl.innerHTML = '<p class="text-muted">Geen aandachtspunten.</p>';
            }
        } else {
            attentionEl.innerHTML = '<ul style="font-size:0.85rem;">' +
                points.map(function(p) { return '<li style="margin-bottom:0.3rem;">' + p + '</li>'; }).join('') +
                '</ul>';
        }
    }

    // === Mutations Table ===
    function bindMutations() {
        // Filters
        document.getElementById('filterClassificatie').addEventListener('change', function() {
            mutationsPage = 1;
            refreshMutationsTable();
        });
        document.getElementById('filterStatus').addEventListener('change', function() {
            mutationsPage = 1;
            refreshMutationsTable();
        });
        document.getElementById('filterSearch').addEventListener('input', function() {
            mutationsPage = 1;
            refreshMutationsTable();
        });

        // Sort
        document.querySelectorAll('#mutationsTable th.sortable').forEach(function(th) {
            th.addEventListener('click', function() {
                var field = this.dataset.sort;
                if (mutationsSortField === field) {
                    mutationsSortDir = mutationsSortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    mutationsSortField = field;
                    mutationsSortDir = 'asc';
                }
                refreshMutationsTable();
            });
        });

        // Re-assess
        document.getElementById('btnRunAssessment').addEventListener('click', function() {
            var stats = AS.assessAll();
            refreshMutationsTable();
            updateBadges();
            refreshDashboard();
            U.showToast('Beoordeling uitgevoerd: ' + stats.classified + ' geclassificeerd, ' + stats.needsReview + ' open.', 'success');
        });
    }

    function getFilteredMutations() {
        var mutations = DS.getMutations();
        var filterCl = document.getElementById('filterClassificatie').value;
        var filterSt = document.getElementById('filterStatus').value;
        var filterSearch = document.getElementById('filterSearch').value.toLowerCase();

        return mutations.filter(function(m) {
            if (filterCl && (m.classification || 'onbeoordeeld') !== filterCl) return false;
            if (filterSt && m.status !== filterSt) return false;
            if (filterSearch) {
                var searchable = [m.description, m.ledgerName, m.supplierName, m.ledgerAccount, m.supplier].join(' ').toLowerCase();
                if (searchable.indexOf(filterSearch) === -1) return false;
            }
            return true;
        });
    }

    function refreshMutationsTable() {
        var filtered = getFilteredMutations();

        // Sort
        if (mutationsSortField) {
            filtered.sort(function(a, b) {
                var va = a[mutationsSortField] || '';
                var vb = b[mutationsSortField] || '';
                if (typeof va === 'number' && typeof vb === 'number') {
                    return mutationsSortDir === 'asc' ? va - vb : vb - va;
                }
                va = String(va).toLowerCase();
                vb = String(vb).toLowerCase();
                if (va < vb) return mutationsSortDir === 'asc' ? -1 : 1;
                if (va > vb) return mutationsSortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Update sort indicators
        document.querySelectorAll('#mutationsTable th.sortable').forEach(function(th) {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sort === mutationsSortField) {
                th.classList.add('sort-' + mutationsSortDir);
            }
        });

        // Paginate
        var totalPages = Math.ceil(filtered.length / mutationsPerPage) || 1;
        if (mutationsPage > totalPages) mutationsPage = totalPages;
        var start = (mutationsPage - 1) * mutationsPerPage;
        var pageItems = filtered.slice(start, start + mutationsPerPage);

        // Render
        var tbody = document.getElementById('mutationsBody');
        if (pageItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">Geen mutaties gevonden.</td></tr>';
        } else {
            tbody.innerHTML = pageItems.map(function(m) {
                return '<tr data-id="' + m.id + '">' +
                    '<td>' + U.escapeHtml(U.formatDate(m.date)) + '</td>' +
                    '<td>' + U.escapeHtml(m.ledgerAccount) + '</td>' +
                    '<td>' + U.escapeHtml(m.ledgerName || '-') + '</td>' +
                    '<td>' + U.escapeHtml((m.description || '').substring(0, 50)) + '</td>' +
                    '<td class="num">' + U.formatCurrency(m.amount) + '</td>' +
                    '<td class="num">' + U.formatCurrency(m.vatAmount) + '</td>' +
                    '<td>' + U.classificationBadge(m.classification) + '</td>' +
                    '<td>' + U.statusBadge(m.status) + '</td>' +
                    '<td><button class="btn btn-sm btn-outline btn-edit-mutation" data-id="' + m.id + '">Bekijk</button></td>' +
                    '</tr>';
            }).join('');
        }

        // Bind row clicks
        tbody.querySelectorAll('tr[data-id]').forEach(function(row) {
            row.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON') return;
                openMutatieDetail(this.dataset.id);
            });
        });
        tbody.querySelectorAll('.btn-edit-mutation').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openMutatieDetail(this.dataset.id);
            });
        });

        // Pagination
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        var pagEl = document.getElementById('mutationsPagination');
        if (totalPages <= 1) {
            pagEl.innerHTML = '';
            return;
        }
        var html = '';
        if (mutationsPage > 1) {
            html += '<button data-page="' + (mutationsPage - 1) + '">&laquo;</button>';
        }
        for (var i = 1; i <= totalPages; i++) {
            if (totalPages > 10 && Math.abs(i - mutationsPage) > 2 && i > 2 && i < totalPages - 1) {
                if (i === mutationsPage - 3 || i === mutationsPage + 3) html += '<button disabled>...</button>';
                continue;
            }
            html += '<button data-page="' + i + '"' + (i === mutationsPage ? ' class="active"' : '') + '>' + i + '</button>';
        }
        if (mutationsPage < totalPages) {
            html += '<button data-page="' + (mutationsPage + 1) + '">&raquo;</button>';
        }
        pagEl.innerHTML = html;
        pagEl.querySelectorAll('button[data-page]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                mutationsPage = parseInt(this.dataset.page, 10);
                refreshMutationsTable();
            });
        });
    }

    function openMutatieDetail(id) {
        var m = DS.getMutation(id);
        if (!m) return;

        var settings = DS.getSettings();
        var proRata = settings.proRataPercentage || 5;

        var html = '<dl class="detail-list">';
        html += '<dt>Boekdatum</dt><dd>' + U.escapeHtml(U.formatDate(m.date)) + '</dd>';
        html += '<dt>Grootboekrek.</dt><dd>' + U.escapeHtml(m.ledgerAccount) + ' - ' + U.escapeHtml(m.ledgerName || '') + '</dd>';
        html += '<dt>Omschrijving</dt><dd>' + U.escapeHtml(m.description || '-') + '</dd>';
        html += '<dt>Bedrag</dt><dd>' + U.formatCurrency(m.amount) + '</dd>';
        html += '<dt>BTW bedrag</dt><dd>' + U.formatCurrency(m.vatAmount) + '</dd>';
        html += '<dt>BTW code</dt><dd>' + U.escapeHtml(m.vatCode || '-') + '</dd>';
        html += '<dt>Kostenplaats</dt><dd>' + U.escapeHtml(m.costCenter || '-') + '</dd>';
        html += '<dt>Crediteur</dt><dd>' + U.escapeHtml(m.supplier || '-') + ' - ' + U.escapeHtml(m.supplierName || '') + '</dd>';
        html += '</dl>';

        html += '<hr style="margin:1rem 0;border-color:var(--border-light);">';
        html += '<h4 style="margin-bottom:0.5rem;">Fiscale beoordeling</h4>';

        html += '<div class="form-group">';
        html += '<label>Classificatie</label>';
        html += '<select id="detailClassificatie" class="form-select">';
        ['aftrekbaar', 'niet-aftrekbaar', 'pro-rata', 'pre-pro-rata', 'onbeoordeeld'].forEach(function(cl) {
            html += '<option value="' + cl + '"' + (m.classification === cl ? ' selected' : '') + '>' + U.classificationLabel(cl) + '</option>';
        });
        html += '</select></div>';

        html += '<div class="form-row">';
        html += '<div class="form-group"><label>Pre-pro-rata %</label>';
        html += '<input type="number" id="detailPreProRata" class="form-input" value="' + (m.preProRataPercentage || 0) + '" min="0" max="100"></div>';
        html += '<div class="form-group"><label>Pro rata % (instelling)</label>';
        html += '<input type="number" class="form-input" value="' + proRata + '" disabled></div>';
        html += '</div>';

        html += '<div class="form-group"><label>Toegepaste regel</label>';
        html += '<input type="text" class="form-input" value="' + U.escapeHtml(m.rule || 'Geen') + '" disabled></div>';

        html += '<div class="form-group"><label>Notities</label>';
        html += '<textarea id="detailNotes" class="form-input" rows="2">' + U.escapeHtml(m.notes || '') + '</textarea></div>';

        html += '<div class="form-group"><label>';
        html += '<input type="checkbox" id="detailManualOverride"' + (m.manualOverride ? ' checked' : '') + '>';
        html += ' Handmatige override (wordt niet overschreven bij herbeoordeling)</label></div>';

        document.getElementById('modalMutatieBody').innerHTML = html;

        // Save handler
        document.getElementById('btnSaveMutatie').onclick = function() {
            var updates = {
                classification: document.getElementById('detailClassificatie').value,
                preProRataPercentage: parseFloat(document.getElementById('detailPreProRata').value) || 0,
                notes: document.getElementById('detailNotes').value,
                manualOverride: document.getElementById('detailManualOverride').checked,
                status: 'reviewed',
                confidence: 'high'
            };
            DS.updateMutation(id, updates);
            DS.addActivity('Mutatie handmatig aangepast: ' + m.ledgerAccount + ' -> ' + U.classificationLabel(updates.classification));
            hideModal('modalMutatieDetail');
            refreshMutationsTable();
            updateBadges();
            U.showToast('Mutatie opgeslagen.', 'success');
        };

        showModal('modalMutatieDetail');
    }

    // === Questions ===
    function bindQuestions() {
        document.getElementById('filterVragenStatus').addEventListener('change', refreshQuestions);
    }

    function refreshQuestions() {
        var questions = DS.getQuestions();
        var filterStatus = document.getElementById('filterVragenStatus').value;

        if (filterStatus === 'open') {
            questions = questions.filter(function(q) { return !q.answered; });
        } else if (filterStatus === 'beantwoord') {
            questions = questions.filter(function(q) { return q.answered; });
        }

        var container = document.getElementById('questionsContainer');

        if (questions.length === 0) {
            container.innerHTML = '<p class="text-muted">Geen vragen gevonden.</p>';
            return;
        }

        container.innerHTML = questions.map(function(q) {
            var html = '<div class="question-card' + (q.answered ? ' answered' : '') + '" data-id="' + q.id + '">';

            html += '<div class="question-header">';
            html += '<div class="question-text">' + U.escapeHtml(q.questionText) + '</div>';
            if (q.answered) {
                html += '<span class="cl-badge cl-aftrekbaar">Beantwoord</span>';
            }
            html += '</div>';

            html += '<div class="question-context">' + U.escapeHtml(q.impactDescription || '') +
                ' | ' + q.mutationIds.length + ' mutatie(s)</div>';

            if (q.type === 'keuze' && q.options && q.options.length > 0) {
                html += '<div class="question-options">';
                q.options.forEach(function(opt, idx) {
                    var isSelected = q.answered && q.answer === opt;
                    html += '<label class="question-option' + (isSelected ? ' selected' : '') + '">';
                    html += '<input type="radio" name="q_' + q.id + '" value="' + U.escapeHtml(opt) + '"' +
                        (isSelected ? ' checked' : '') + (q.answered ? ' disabled' : '') + '>';
                    html += U.escapeHtml(opt);
                    html += '</label>';
                });
                html += '</div>';
            } else if (q.type === 'percentage') {
                html += '<div class="question-percentage">';
                html += '<label>Percentage: </label>';
                html += '<input type="number" class="form-input" style="width:100px" id="qpct_' + q.id + '" ' +
                    'value="' + (q.answer || '30') + '" min="0" max="100"' + (q.answered ? ' disabled' : '') + '>';
                html += '<span>%</span></div>';
            } else if (q.type === 'ja-nee') {
                html += '<div class="question-options">';
                ['Ja', 'Nee'].forEach(function(opt) {
                    var isSelected = q.answered && q.answer === opt;
                    html += '<label class="question-option' + (isSelected ? ' selected' : '') + '">';
                    html += '<input type="radio" name="q_' + q.id + '" value="' + opt + '"' +
                        (isSelected ? ' checked' : '') + (q.answered ? ' disabled' : '') + '>';
                    html += opt + '</label>';
                });
                html += '</div>';
            } else if (q.type === 'tekst') {
                html += '<div class="form-group">';
                html += '<textarea class="form-input" id="qtxt_' + q.id + '" rows="2"' +
                    (q.answered ? ' disabled' : '') + '>' + U.escapeHtml(q.answer || '') + '</textarea>';
                html += '</div>';
            }

            // Linked mutations summary
            if (q.mutationIds.length > 0) {
                html += '<div class="question-mutations-list">Gerelateerde mutaties: ';
                var mutList = q.mutationIds.slice(0, 3).map(function(mid) {
                    var mut = DS.getMutation(mid);
                    return mut ? (mut.ledgerAccount + ' - ' + U.formatCurrency(mut.amount)) : mid;
                });
                html += mutList.join(', ');
                if (q.mutationIds.length > 3) html += ' en ' + (q.mutationIds.length - 3) + ' meer';
                html += '</div>';
            }

            if (!q.answered) {
                html += '<div class="question-actions">';
                html += '<button class="btn btn-primary btn-answer-question" data-id="' + q.id + '">Beantwoorden</button>';
                html += '</div>';
            } else {
                html += '<div class="question-impact">Antwoord: ' + U.escapeHtml(q.answer) +
                    ' -> ' + U.classificationBadge(q.answerClassification || '') + '</div>';
            }

            html += '</div>';
            return html;
        }).join('');

        // Bind answer buttons
        container.querySelectorAll('.btn-answer-question').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var qId = this.dataset.id;
                var q = DS.getQuestion(qId);
                if (!q) return;

                var answer = '';
                if (q.type === 'keuze' || q.type === 'ja-nee') {
                    var selected = container.querySelector('input[name="q_' + qId + '"]:checked');
                    if (!selected) {
                        U.showToast('Selecteer een antwoord.', 'warning');
                        return;
                    }
                    answer = selected.value;
                } else if (q.type === 'percentage') {
                    var pctInput = document.getElementById('qpct_' + qId);
                    answer = pctInput ? pctInput.value : '0';
                } else if (q.type === 'tekst') {
                    var txtInput = document.getElementById('qtxt_' + qId);
                    answer = txtInput ? txtInput.value : '';
                }

                if (!answer) {
                    U.showToast('Voer een antwoord in.', 'warning');
                    return;
                }

                AS.answerQuestion(qId, answer);
                refreshQuestions();
                updateBadges();
                U.showToast('Vraag beantwoord.', 'success');
            });
        });
    }

    // === Reports ===
    function bindReports() {
        document.getElementById('btnGenerateReport').addEventListener('click', function() {
            var html = RP.generateFiscalReport();
            document.getElementById('reportContent').innerHTML = html;
            document.getElementById('reportOutput').style.display = 'block';
            DS.addActivity('Fiscaal rapport gegenereerd.');
            U.showToast('Rapport gegenereerd.', 'success');
        });

        document.getElementById('btnExportCSV').addEventListener('click', function() {
            var csv = RP.exportMutationsCSV();
            U.downloadCSV(csv, 'btw-beoordeling-mutaties.csv');
            U.showToast('CSV geexporteerd.', 'success');
        });

        document.getElementById('btnExportSummary').addEventListener('click', function() {
            var csv = RP.exportSummaryCSV();
            U.downloadCSV(csv, 'btw-beoordeling-samenvatting.csv');
            U.showToast('Samenvatting geexporteerd.', 'success');
        });

        document.getElementById('btnPrintReport').addEventListener('click', function() {
            window.print();
        });
    }

    // === Settings ===
    function bindSettings() {
        document.getElementById('btnSaveSettings').addEventListener('click', function() {
            var settings = {
                projectNaam: document.getElementById('settingProjectNaam').value.trim(),
                organisatie: document.getElementById('settingOrganisatie').value.trim(),
                proRataPercentage: parseFloat(document.getElementById('settingProRata').value) || 5,
                periode: document.getElementById('settingPeriode').value.trim()
            };
            DS.saveSettings(settings);
            updateProjectName();
            U.showToast('Instellingen opgeslagen.', 'success');
        });

        document.getElementById('btnResetRules').addEventListener('click', function() {
            if (confirm('Weet u zeker dat u de standaardregels wilt herstellen? Aangepaste regels gaan verloren.')) {
                RE.resetToDefaults();
                refreshRulesTable();
                U.showToast('Standaardregels hersteld.', 'success');
            }
        });

        document.getElementById('btnAddRule').addEventListener('click', function() {
            openRuleEditor(null);
        });

        // Data management
        document.getElementById('btnExportProject').addEventListener('click', function() {
            var data = DS.exportProject();
            data.rules = RE.getRules();
            U.downloadJSON(data, 'btw-project-' + (data.settings.projectNaam || 'export').replace(/\s+/g, '-') + '.json');
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
                    if (data.rules) {
                        RE.setRules(data.rules);
                        delete data.rules;
                    }
                    DS.importProject(data);
                    updateProjectName();
                    refreshDashboard();
                    refreshRulesTable();
                    refreshSettings();
                    updateBadges();
                    U.showToast('Project geimporteerd.', 'success');
                } catch(err) {
                    U.showToast('Fout bij importeren: ' + err.message, 'error');
                }
            };
            reader.readAsText(this.files[0]);
        });

        document.getElementById('btnClearData').addEventListener('click', function() {
            if (confirm('Weet u zeker dat u ALLE gegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
                DS.clearAll();
                RE.resetToDefaults();
                updateProjectName();
                refreshDashboard();
                refreshRulesTable();
                refreshSettings();
                updateBadges();
                U.showToast('Alle gegevens gewist.', 'success');
            }
        });
    }

    function refreshSettings() {
        var settings = DS.getSettings();
        document.getElementById('settingProjectNaam').value = settings.projectNaam || '';
        document.getElementById('settingOrganisatie').value = settings.organisatie || '';
        document.getElementById('settingProRata').value = settings.proRataPercentage || 5;
        document.getElementById('settingPeriode').value = settings.periode || '';
    }

    // === Rules Table ===
    function refreshRulesTable() {
        var rules = RE.getRules().slice().sort(function(a, b) {
            return (a.priority || 50) - (b.priority || 50);
        });

        var tbody = document.getElementById('rulesBody');
        if (rules.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Geen regels gedefinieerd.</td></tr>';
            return;
        }

        tbody.innerHTML = rules.map(function(r) {
            var condStr = r.conditions.map(function(c) {
                return RE.conditionDescription(c);
            }).join(' EN ');

            return '<tr>' +
                '<td>' + (r.priority || 50) + '</td>' +
                '<td>' + U.escapeHtml(r.name) + '</td>' +
                '<td style="font-size:0.75rem;">' + U.escapeHtml(condStr) + '</td>' +
                '<td>' + U.classificationBadge(r.classification) + '</td>' +
                '<td>' + (r.active ? 'Ja' : 'Nee') + '</td>' +
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
                    RE.deleteRule(this.dataset.id);
                    refreshRulesTable();
                    U.showToast('Regel verwijderd.', 'success');
                }
            });
        });
    }

    function openRuleEditor(ruleId) {
        editingRuleId = ruleId;
        var rule = ruleId ? RE.getRule(ruleId) : null;

        document.getElementById('modalRegelTitle').textContent = rule ? 'Regel bewerken' : 'Nieuwe regel';
        document.getElementById('ruleNaam').value = rule ? rule.name : '';
        document.getElementById('rulePrioriteit').value = rule ? (rule.priority || 50) : 50;
        document.getElementById('ruleClassificatie').value = rule ? rule.classification : 'pro-rata';
        document.getElementById('ruleAftrekPercentage').value = rule ? (rule.deductionPercentage || 100) : 100;
        document.getElementById('rulePreProRataPercentage').value = rule ? (rule.preProRataPercentage || 0) : 0;
        document.getElementById('ruleOmschrijving').value = rule ? (rule.description || '') : '';
        document.getElementById('ruleActief').checked = rule ? rule.active : true;
        document.getElementById('ruleVraagStellen').checked = rule ? rule.askQuestion : false;
        document.getElementById('ruleVraagTekst').value = rule ? (rule.questionText || '') : '';
        document.getElementById('ruleVraagType').value = rule ? (rule.questionType || 'keuze') : 'keuze';
        document.getElementById('ruleVraagOptiesTekst').value = rule ? (rule.questionOptions || '') : '';

        // Toggle question fields
        toggleQuestionFields();

        // Render conditions
        renderConditions(rule ? rule.conditions : [{ field: 'ledgerAccount', operator: 'range', value: '' }]);

        showModal('modalRegel');
    }

    function toggleQuestionFields() {
        var show = document.getElementById('ruleVraagStellen').checked;
        document.getElementById('ruleVraagGroup').style.display = show ? 'block' : 'none';
    }

    function renderConditions(conditions) {
        var container = document.getElementById('ruleConditions');
        container.innerHTML = '';

        conditions.forEach(function(cond, idx) {
            var row = document.createElement('div');
            row.className = 'condition-row';

            var fieldSelect = document.createElement('select');
            fieldSelect.dataset.idx = idx;
            fieldSelect.dataset.part = 'field';
            var fields = [
                ['ledgerAccount', 'Grootboekrekening'],
                ['ledgerName', 'Naam rekening'],
                ['description', 'Omschrijving'],
                ['amount', 'Bedrag'],
                ['vatAmount', 'BTW bedrag'],
                ['vatCode', 'BTW code'],
                ['costCenter', 'Kostenplaats'],
                ['supplier', 'Crediteur'],
                ['supplierName', 'Naam crediteur']
            ];
            fields.forEach(function(f) {
                var opt = document.createElement('option');
                opt.value = f[0];
                opt.textContent = f[1];
                if (cond.field === f[0]) opt.selected = true;
                fieldSelect.appendChild(opt);
            });

            var opSelect = document.createElement('select');
            opSelect.dataset.idx = idx;
            opSelect.dataset.part = 'operator';
            var ops = [
                ['range', 'Bereik (bijv. 4000-4099)'],
                ['equals', 'Gelijk aan'],
                ['contains', 'Bevat'],
                ['starts_with', 'Begint met'],
                ['in', 'In lijst (kommagescheiden)'],
                ['not_empty', 'Niet leeg'],
                ['empty', 'Leeg'],
                ['greater_than', 'Groter dan'],
                ['less_than', 'Kleiner dan']
            ];
            ops.forEach(function(o) {
                var opt = document.createElement('option');
                opt.value = o[0];
                opt.textContent = o[1];
                if (cond.operator === o[0]) opt.selected = true;
                opSelect.appendChild(opt);
            });

            var valInput = document.createElement('input');
            valInput.type = 'text';
            valInput.dataset.idx = idx;
            valInput.dataset.part = 'value';
            valInput.value = cond.value || '';
            valInput.placeholder = 'Waarde';
            valInput.style.flex = '1';

            var removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';
            removeBtn.innerHTML = '&times;';
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
            var field = row.querySelector('select[data-part="field"]').value;
            var operator = row.querySelector('select[data-part="operator"]').value;
            var value = row.querySelector('input[data-part="value"]').value;
            conditions.push({ field: field, operator: operator, value: value });
        });
        return conditions;
    }

    // === Modals ===
    function bindModals() {
        document.querySelectorAll('[data-close-modal]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                hideModal(this.dataset.closeModal);
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                }
            });
        });

        // Rule save
        document.getElementById('btnSaveRule').addEventListener('click', saveRule);

        // Condition add
        document.getElementById('btnAddCondition').addEventListener('click', function() {
            var conditions = getConditionsFromEditor();
            conditions.push({ field: 'ledgerAccount', operator: 'range', value: '' });
            renderConditions(conditions);
        });

        // Question toggle
        document.getElementById('ruleVraagStellen').addEventListener('change', toggleQuestionFields);

        // Question type toggle options
        document.getElementById('ruleVraagType').addEventListener('change', function() {
            document.getElementById('ruleVraagOpties').style.display =
                this.value === 'keuze' ? 'block' : 'none';
        });
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
            deductionPercentage: parseFloat(document.getElementById('ruleAftrekPercentage').value) || 100,
            preProRataPercentage: parseFloat(document.getElementById('rulePreProRataPercentage').value) || 0,
            description: document.getElementById('ruleOmschrijving').value.trim(),
            active: document.getElementById('ruleActief').checked,
            askQuestion: document.getElementById('ruleVraagStellen').checked,
            questionText: document.getElementById('ruleVraagTekst').value.trim(),
            questionType: document.getElementById('ruleVraagType').value,
            questionOptions: document.getElementById('ruleVraagOptiesTekst').value.trim()
        };

        if (editingRuleId) {
            RE.updateRule(editingRuleId, ruleData);
            U.showToast('Regel bijgewerkt.', 'success');
        } else {
            RE.addRule(ruleData);
            U.showToast('Regel toegevoegd.', 'success');
        }

        hideModal('modalRegel');
        refreshRulesTable();
    }

    function showModal(id) {
        document.getElementById(id).style.display = 'flex';
    }

    function hideModal(id) {
        document.getElementById(id).style.display = 'none';
    }

    // === Badges ===
    function updateBadges() {
        var mutations = DS.getMutations();
        var questions = DS.getQuestions();
        var openQuestions = questions.filter(function(q) { return !q.answered; });

        document.getElementById('badgeMutaties').textContent = mutations.length;
        document.getElementById('badgeVragen').textContent = openQuestions.length;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init: init,
        switchTab: switchTab,
        refreshDashboard: refreshDashboard,
        refreshMutationsTable: refreshMutationsTable,
        refreshQuestions: refreshQuestions
    };
})();
