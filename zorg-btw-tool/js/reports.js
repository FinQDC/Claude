/* === Reports Module === */
App.Reports = (function() {
    'use strict';

    var U = App.Utils;
    var DS = App.DataStore;

    function generateFiscalReport() {
        var summary = App.Assessment.calculateSummary();
        var settings = DS.getSettings();
        var mutations = DS.getMutations();
        var questions = DS.getQuestions();

        var html = '';

        // Report metadata
        html += '<div class="report-section">';
        html += '<h4>Projectinformatie</h4>';
        html += '<table class="report-table">';
        html += '<tr><td><strong>Organisatie</strong></td><td>' + U.escapeHtml(settings.organisatie || '-') + '</td></tr>';
        html += '<tr><td><strong>Project</strong></td><td>' + U.escapeHtml(settings.projectNaam || '-') + '</td></tr>';
        html += '<tr><td><strong>Periode</strong></td><td>' + U.escapeHtml(settings.periode || '-') + '</td></tr>';
        html += '<tr><td><strong>Pro rata percentage</strong></td><td>' + U.formatPercentage(settings.proRataPercentage) + '</td></tr>';
        html += '<tr><td><strong>Rapportagedatum</strong></td><td>' + new Date().toLocaleDateString('nl-NL') + '</td></tr>';
        html += '<tr><td><strong>Aantal mutaties</strong></td><td>' + U.formatNumber(summary.totaalMutaties) + '</td></tr>';
        html += '</table>';
        html += '</div>';

        // Summary by classification
        html += '<div class="report-section">';
        html += '<h4>Samenvatting per classificatie</h4>';
        html += '<table class="report-table">';
        html += '<thead><tr>';
        html += '<th>Classificatie</th><th class="num">Aantal</th><th class="num">Bedrag excl. BTW</th>';
        html += '<th class="num">BTW bedrag</th><th class="num">Aftrekbare BTW</th><th class="num">Niet-aftrekbare BTW</th>';
        html += '</tr></thead><tbody>';

        var classOrder = ['aftrekbaar', 'niet-aftrekbaar', 'pro-rata', 'pre-pro-rata', 'onbeoordeeld'];
        classOrder.forEach(function(cl) {
            var data = summary.classificaties[cl];
            if (!data || data.count === 0) return;
            var nietAftrekbaar = data.btw - data.aftrekbareBTW;
            html += '<tr>';
            html += '<td>' + U.classificationBadge(cl) + '</td>';
            html += '<td class="num">' + U.formatNumber(data.count) + '</td>';
            html += '<td class="num">' + U.formatCurrency(data.bedrag) + '</td>';
            html += '<td class="num">' + U.formatCurrency(data.btw) + '</td>';
            html += '<td class="num">' + U.formatCurrency(data.aftrekbareBTW) + '</td>';
            html += '<td class="num">' + U.formatCurrency(nietAftrekbaar) + '</td>';
            html += '</tr>';
        });

        html += '</tbody><tfoot><tr>';
        html += '<td><strong>Totaal</strong></td>';
        html += '<td class="num"><strong>' + U.formatNumber(summary.totaalMutaties) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(summary.totaalBedrag) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(summary.totaalBTW) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(summary.totaalAftrekbareBTW) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(summary.totaalNietAftrekbareBTW) + '</strong></td>';
        html += '</tr></tfoot></table>';
        html += '</div>';

        // Pro rata calculation detail
        html += '<div class="report-section">';
        html += '<h4>Pro rata berekening</h4>';
        html += '<table class="report-table">';
        html += '<tr><td>Gehanteerd pro rata percentage</td><td class="num"><strong>' + U.formatPercentage(summary.proRataPercentage) + '</strong></td></tr>';

        var proRataData = summary.classificaties['pro-rata'];
        if (proRataData && proRataData.count > 0) {
            html += '<tr><td>Totaal BTW op pro rata kosten</td><td class="num">' + U.formatCurrency(proRataData.btw) + '</td></tr>';
            html += '<tr><td>Aftrekbare BTW (pro rata)</td><td class="num">' + U.formatCurrency(proRataData.aftrekbareBTW) + '</td></tr>';
        }

        var preProRataData = summary.classificaties['pre-pro-rata'];
        if (preProRataData && preProRataData.count > 0) {
            html += '<tr><td>Totaal BTW op pre-pro-rata kosten</td><td class="num">' + U.formatCurrency(preProRataData.btw) + '</td></tr>';
            html += '<tr><td>Aftrekbare BTW (pre-pro-rata)</td><td class="num">' + U.formatCurrency(preProRataData.aftrekbareBTW) + '</td></tr>';
        }

        html += '</table>';
        html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:0.5rem;">';
        html += 'Pro rata berekening: BTW x pro rata % = aftrekbare BTW.<br>';
        html += 'Pre-pro-rata berekening: BTW x pre-pro-rata % x pro rata % = aftrekbare BTW.';
        html += '</p>';
        html += '</div>';

        // Top accounts by VAT amount
        html += '<div class="report-section">';
        html += '<h4>Top 10 grootboekrekeningen naar BTW-bedrag</h4>';
        var accountSummary = {};
        mutations.forEach(function(m) {
            var key = m.ledgerAccount;
            if (!accountSummary[key]) {
                accountSummary[key] = {
                    account: m.ledgerAccount,
                    name: m.ledgerName || m.ledgerAccount,
                    count: 0,
                    bedrag: 0,
                    btw: 0,
                    classification: m.classification
                };
            }
            accountSummary[key].count++;
            accountSummary[key].bedrag += Math.abs(m.amount || 0);
            accountSummary[key].btw += Math.abs(m.vatAmount || 0);
        });

        var topAccounts = Object.values(accountSummary)
            .sort(function(a, b) { return b.btw - a.btw; })
            .slice(0, 10);

        html += '<table class="report-table">';
        html += '<thead><tr><th>Rekening</th><th>Naam</th><th class="num">Aantal</th>';
        html += '<th class="num">Bedrag</th><th class="num">BTW</th><th>Classificatie</th></tr></thead><tbody>';
        topAccounts.forEach(function(acc) {
            html += '<tr>';
            html += '<td>' + U.escapeHtml(acc.account) + '</td>';
            html += '<td>' + U.escapeHtml(acc.name) + '</td>';
            html += '<td class="num">' + acc.count + '</td>';
            html += '<td class="num">' + U.formatCurrency(acc.bedrag) + '</td>';
            html += '<td class="num">' + U.formatCurrency(acc.btw) + '</td>';
            html += '<td>' + U.classificationBadge(acc.classification) + '</td>';
            html += '</tr>';
        });
        html += '</tbody></table>';
        html += '</div>';

        // Open questions warning
        var openQuestions = questions.filter(function(q) { return !q.answered; });
        if (openQuestions.length > 0) {
            html += '<div class="report-section">';
            html += '<h4 style="color:var(--warning);">Openstaande vragen (' + openQuestions.length + ')</h4>';
            html += '<p style="color:var(--danger);font-weight:500;">Let op: er zijn nog ' + openQuestions.length +
                ' onbeantwoorde vragen. Beantwoord deze voor een complete beoordeling.</p>';
            html += '<ul style="font-size:0.85rem;">';
            openQuestions.forEach(function(q) {
                html += '<li>' + U.escapeHtml(q.questionText) + ' (' + q.mutationIds.length + ' mutaties)</li>';
            });
            html += '</ul>';
            html += '</div>';
        }

        // Unclassified mutations warning
        var unclassified = summary.classificaties['onbeoordeeld'];
        if (unclassified && unclassified.count > 0) {
            html += '<div class="report-section">';
            html += '<h4 style="color:var(--danger);">Onbeoordeelde mutaties (' + unclassified.count + ')</h4>';
            html += '<p style="color:var(--danger);">Er zijn ' + unclassified.count +
                ' mutaties zonder classificatie met een BTW-bedrag van ' + U.formatCurrency(unclassified.btw) + '.</p>';
            html += '</div>';
        }

        // Disclaimer
        html += '<div class="report-section" style="border-top:2px solid var(--border);padding-top:1rem;margin-top:1rem;">';
        html += '<h4>Disclaimer</h4>';
        html += '<p style="font-size:0.8rem;color:var(--text-light);">';
        html += 'Dit rapport is gegenereerd door de BTW Beoordelingstool en dient als hulpmiddel bij de fiscale ';
        html += 'beoordeling van BTW-aftrekrecht. De classificaties zijn gebaseerd op regelgebaseerde logica en ';
        html += 'dienen door een fiscalist te worden gevalideerd. Dit rapport vervangt geen professioneel fiscaal ';
        html += 'advies. De gebruiker is zelf verantwoordelijk voor de juistheid van de BTW-aangifte.';
        html += '</p>';
        html += '</div>';

        return html;
    }

    function exportMutationsCSV() {
        var mutations = DS.getMutations();
        var settings = DS.getSettings();
        var proRata = settings.proRataPercentage || 5;

        var header = [
            'Boekdatum', 'Grootboekrekening', 'Naam rekening', 'Omschrijving',
            'Bedrag', 'BTW bedrag', 'BTW code', 'Kostenplaats',
            'Crediteur', 'Naam crediteur',
            'Classificatie', 'Status', 'Vertrouwen', 'Regel',
            'Aftrekpercentage', 'Pre-pro-rata %', 'Pro rata %',
            'Aftrekbare BTW', 'Notities'
        ];

        var rows = mutations.map(function(m) {
            var btw = Math.abs(m.vatAmount || 0);
            var aftrekbareBTW = 0;
            switch(m.classification) {
                case 'aftrekbaar': aftrekbareBTW = btw; break;
                case 'niet-aftrekbaar': aftrekbareBTW = 0; break;
                case 'pro-rata': aftrekbareBTW = btw * (proRata / 100); break;
                case 'pre-pro-rata':
                    var ppp = m.preProRataPercentage || 30;
                    aftrekbareBTW = btw * (ppp / 100) * (proRata / 100);
                    break;
            }

            return [
                m.date,
                m.ledgerAccount,
                m.ledgerName,
                m.description,
                String(m.amount).replace('.', ','),
                String(m.vatAmount).replace('.', ','),
                m.vatCode,
                m.costCenter,
                m.supplier,
                m.supplierName,
                U.classificationLabel(m.classification),
                U.statusLabel(m.status),
                m.confidence || '',
                m.rule || '',
                m.deductionPercentage != null ? String(m.deductionPercentage) : '',
                m.preProRataPercentage != null ? String(m.preProRataPercentage) : '',
                String(proRata),
                String(aftrekbareBTW.toFixed(2)).replace('.', ','),
                m.notes || ''
            ];
        });

        return U.arrayToCSV([header].concat(rows));
    }

    function exportSummaryCSV() {
        var summary = App.Assessment.calculateSummary();
        var settings = DS.getSettings();

        var rows = [
            ['BTW Beoordeling Samenvatting'],
            ['Organisatie', settings.organisatie || ''],
            ['Project', settings.projectNaam || ''],
            ['Periode', settings.periode || ''],
            ['Pro rata percentage', String(summary.proRataPercentage) + '%'],
            ['Datum', new Date().toLocaleDateString('nl-NL')],
            [],
            ['Classificatie', 'Aantal', 'Bedrag', 'BTW', 'Aftrekbare BTW', 'Niet-aftrekbare BTW']
        ];

        var classOrder = ['aftrekbaar', 'niet-aftrekbaar', 'pro-rata', 'pre-pro-rata', 'onbeoordeeld'];
        classOrder.forEach(function(cl) {
            var data = summary.classificaties[cl];
            if (!data || data.count === 0) return;
            rows.push([
                U.classificationLabel(cl),
                String(data.count),
                String(data.bedrag.toFixed(2)).replace('.', ','),
                String(data.btw.toFixed(2)).replace('.', ','),
                String(data.aftrekbareBTW.toFixed(2)).replace('.', ','),
                String((data.btw - data.aftrekbareBTW).toFixed(2)).replace('.', ',')
            ]);
        });

        rows.push([
            'TOTAAL',
            String(summary.totaalMutaties),
            String(summary.totaalBedrag.toFixed(2)).replace('.', ','),
            String(summary.totaalBTW.toFixed(2)).replace('.', ','),
            String(summary.totaalAftrekbareBTW.toFixed(2)).replace('.', ','),
            String(summary.totaalNietAftrekbareBTW.toFixed(2)).replace('.', ',')
        ]);

        return U.arrayToCSV(rows);
    }

    return {
        generateFiscalReport: generateFiscalReport,
        exportMutationsCSV: exportMutationsCSV,
        exportSummaryCSV: exportSummaryCSV
    };
})();
