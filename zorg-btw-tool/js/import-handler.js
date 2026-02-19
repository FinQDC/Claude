/* === Import Handler - CSV import and column mapping === */
App.ImportHandler = (function() {
    'use strict';

    var U = App.Utils;

    // Expected fields for mutations
    var mutationFields = [
        { key: 'date', label: 'Boekdatum', required: true },
        { key: 'ledgerAccount', label: 'Grootboekrekening', required: true },
        { key: 'ledgerName', label: 'Naam rekening', required: false },
        { key: 'description', label: 'Omschrijving', required: false },
        { key: 'amount', label: 'Bedrag', required: true },
        { key: 'vatAmount', label: 'BTW bedrag', required: false },
        { key: 'vatCode', label: 'BTW code', required: false },
        { key: 'costCenter', label: 'Kostenplaats', required: false },
        { key: 'supplier', label: 'Crediteur', required: false },
        { key: 'supplierName', label: 'Naam crediteur', required: false },
        { key: 'debitCredit', label: 'Debet/Credit', required: false },
        { key: 'journalCode', label: 'Dagboek', required: false }
    ];

    // Expected fields for crediteuren
    var crediteurFields = [
        { key: 'code', label: 'Crediteurcode', required: true },
        { key: 'name', label: 'Naam', required: true },
        { key: 'type', label: 'Type', required: false },
        { key: 'classification', label: 'BTW-classificatie', required: false },
        { key: 'notes', label: 'Opmerkingen', required: false }
    ];

    // Auto-detect column mapping based on header names
    function autoMapColumns(headers, fields) {
        var mapping = {};
        var aliases = {
            'date': ['boekdatum', 'datum', 'date', 'boekingsdatum', 'faktuurdatum', 'factuurdatum'],
            'ledgerAccount': ['grootboekrekening', 'grootboek', 'rekening', 'rekeningnr', 'gbrek', 'account', 'gl_account', 'grootboeknr'],
            'ledgerName': ['naam rekening', 'rekeningnaam', 'omschrijving rekening', 'gb naam', 'account_name'],
            'description': ['omschrijving', 'description', 'boekstuk', 'tekst', 'memo'],
            'amount': ['bedrag', 'amount', 'totaal', 'bedrag incl', 'bedrag excl', 'netto'],
            'vatAmount': ['btw bedrag', 'btw', 'vat', 'btw_bedrag', 'ob bedrag', 'belasting'],
            'vatCode': ['btw code', 'btw_code', 'btwcode', 'vat_code', 'ob code', 'belastingcode'],
            'costCenter': ['kostenplaats', 'kp', 'cost_center', 'costcenter', 'afdeling'],
            'supplier': ['crediteur', 'crediteurcode', 'crediteur_code', 'leverancier', 'supplier', 'crediteurnr'],
            'supplierName': ['naam crediteur', 'crediteur naam', 'leveranciernaam', 'supplier_name'],
            'debitCredit': ['debet/credit', 'dc', 'd/c', 'debet_credit', 'soort'],
            'journalCode': ['dagboek', 'dagboekcode', 'journal', 'boekstuk'],
            'code': ['crediteurcode', 'crediteur', 'code', 'leveranciercode', 'nummer', 'crediteurnr'],
            'name': ['naam', 'name', 'leveranciernaam', 'crediteur naam', 'omschrijving'],
            'type': ['type', 'soort', 'categorie', 'category'],
            'classification': ['btw-classificatie', 'classificatie', 'btw classificatie', 'btw_classificatie', 'aftrek'],
            'notes': ['opmerkingen', 'notities', 'notes', 'toelichting', 'opmerking']
        };

        var normalizedHeaders = headers.map(function(h) {
            return h.toLowerCase().trim().replace(/[_\-]/g, ' ');
        });

        fields.forEach(function(field) {
            var fieldAliases = aliases[field.key] || [field.key];
            mapping[field.key] = -1; // Not mapped

            for (var i = 0; i < normalizedHeaders.length; i++) {
                for (var j = 0; j < fieldAliases.length; j++) {
                    if (normalizedHeaders[i] === fieldAliases[j] ||
                        normalizedHeaders[i].indexOf(fieldAliases[j]) > -1) {
                        mapping[field.key] = i;
                        return;
                    }
                }
            }
        });

        return mapping;
    }

    function renderMapping(containerId, headers, fields, mapping) {
        var container = document.getElementById(containerId);
        container.innerHTML = '';

        fields.forEach(function(field) {
            var item = document.createElement('div');
            item.className = 'mapping-item';

            var label = document.createElement('label');
            label.textContent = field.label + (field.required ? ' *' : '');
            item.appendChild(label);

            var select = document.createElement('select');
            select.className = 'form-select';
            select.dataset.field = field.key;

            var optNone = document.createElement('option');
            optNone.value = '-1';
            optNone.textContent = '-- Niet toewijzen --';
            select.appendChild(optNone);

            headers.forEach(function(h, idx) {
                var opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = h;
                if (mapping[field.key] === idx) {
                    opt.selected = true;
                }
                select.appendChild(opt);
            });

            item.appendChild(select);
            container.appendChild(item);
        });
    }

    function getMapping(containerId) {
        var container = document.getElementById(containerId);
        var selects = container.querySelectorAll('select');
        var mapping = {};
        selects.forEach(function(sel) {
            mapping[sel.dataset.field] = parseInt(sel.value, 10);
        });
        return mapping;
    }

    function parseMutations(rows, mapping) {
        var mutations = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var m = {
                id: U.generateId(),
                date: mapping.date >= 0 ? U.parseDate(row[mapping.date] || '') : '',
                ledgerAccount: mapping.ledgerAccount >= 0 ? String(row[mapping.ledgerAccount] || '').trim() : '',
                ledgerName: mapping.ledgerName >= 0 ? String(row[mapping.ledgerName] || '').trim() : '',
                description: mapping.description >= 0 ? String(row[mapping.description] || '').trim() : '',
                amount: mapping.amount >= 0 ? U.parseAmount(row[mapping.amount]) : 0,
                vatAmount: mapping.vatAmount >= 0 ? U.parseAmount(row[mapping.vatAmount]) : 0,
                vatCode: mapping.vatCode >= 0 ? String(row[mapping.vatCode] || '').trim() : '',
                costCenter: mapping.costCenter >= 0 ? String(row[mapping.costCenter] || '').trim() : '',
                supplier: mapping.supplier >= 0 ? String(row[mapping.supplier] || '').trim() : '',
                supplierName: mapping.supplierName >= 0 ? String(row[mapping.supplierName] || '').trim() : '',
                debitCredit: mapping.debitCredit >= 0 ? String(row[mapping.debitCredit] || '').trim() : '',
                journalCode: mapping.journalCode >= 0 ? String(row[mapping.journalCode] || '').trim() : '',
                // Assessment fields
                classification: '',
                confidence: '',
                deductionPercentage: null,
                preProRataPercentage: null,
                rule: '',
                manualOverride: false,
                notes: '',
                questionIds: [],
                status: ''
            };

            // Only add if ledgerAccount or amount is present
            if (m.ledgerAccount || m.amount !== 0) {
                mutations.push(m);
            }
        }
        return mutations;
    }

    function parseCrediteuren(rows, mapping) {
        var crediteuren = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var c = {
                code: mapping.code >= 0 ? String(row[mapping.code] || '').trim() : '',
                name: mapping.name >= 0 ? String(row[mapping.name] || '').trim() : '',
                type: mapping.type >= 0 ? String(row[mapping.type] || '').trim() : '',
                classification: mapping.classification >= 0 ? normalizeClassification(row[mapping.classification]) : '',
                notes: mapping.notes >= 0 ? String(row[mapping.notes] || '').trim() : ''
            };
            if (c.code) {
                crediteuren.push(c);
            }
        }
        return crediteuren;
    }

    function normalizeClassification(val) {
        if (!val) return '';
        val = String(val).toLowerCase().trim();
        var map = {
            'aftrekbaar': 'aftrekbaar',
            'volledig aftrekbaar': 'aftrekbaar',
            'full': 'aftrekbaar',
            'niet-aftrekbaar': 'niet-aftrekbaar',
            'niet aftrekbaar': 'niet-aftrekbaar',
            'vrijgesteld': 'niet-aftrekbaar',
            'exempt': 'niet-aftrekbaar',
            'none': 'niet-aftrekbaar',
            'pro rata': 'pro-rata',
            'pro-rata': 'pro-rata',
            'prorata': 'pro-rata',
            'mixed': 'pro-rata',
            'pre-pro-rata': 'pre-pro-rata',
            'pre pro rata': 'pre-pro-rata',
            'preprorata': 'pre-pro-rata',
            'deels': 'pre-pro-rata'
        };
        return map[val] || '';
    }

    function renderPreviewTable(tableId, headers, rows, maxRows) {
        maxRows = maxRows || 5;
        var table = document.getElementById(tableId);
        var thead = table.querySelector('thead');
        var tbody = table.querySelector('tbody');

        thead.innerHTML = '<tr>' + headers.map(function(h) {
            return '<th>' + U.escapeHtml(h) + '</th>';
        }).join('') + '</tr>';

        tbody.innerHTML = rows.slice(0, maxRows).map(function(row) {
            return '<tr>' + row.map(function(cell) {
                return '<td>' + U.escapeHtml(String(cell || '')) + '</td>';
            }).join('') + '</tr>';
        }).join('');

        if (rows.length > maxRows) {
            tbody.innerHTML += '<tr><td colspan="' + headers.length + '" class="text-muted text-center">... en ' +
                (rows.length - maxRows) + ' meer regels</td></tr>';
        }
    }

    function generateExampleMutations() {
        var header = ['Boekdatum', 'Grootboekrekening', 'Naam rekening', 'Omschrijving', 'Bedrag', 'BTW bedrag', 'BTW code', 'Kostenplaats', 'Crediteur', 'Naam crediteur'];
        var rows = [
            ['15-01-2024', '4100', 'Huurkosten', 'Huur kantoor/zorgpand Q1 2024', '75000,00', '15750,00', '21', 'KP001', 'C001', 'Vastgoed BV'],
            ['15-01-2024', '4110', 'Energiekosten', 'Gas en elektra januari', '8500,00', '1785,00', '21', 'KP001', 'C002', 'Eneco Zakelijk'],
            ['20-01-2024', '4200', 'Kantoorbenodigdheden', 'Kantoorartikelen Q1', '1250,00', '262,50', '21', 'KP003', 'C003', 'Staples BV'],
            ['22-01-2024', '4400', 'Medische middelen', 'Verbandmaterialen januari', '4800,00', '1008,00', '21', 'KP010', 'C010', 'Mediq'],
            ['25-01-2024', '4410', 'Geneesmiddelen', 'Medicijnen voorraad jan', '12500,00', '2625,00', '21', 'KP010', 'C011', 'Brocacef'],
            ['28-01-2024', '4300', 'Accountantskosten', 'Controle jaarrekening 2023', '15000,00', '3150,00', '21', 'KP003', 'C020', 'BDO Audit'],
            ['01-02-2024', '4500', 'Keukenkosten', 'Levensmiddelen februari', '6200,00', '558,00', '9', 'KP005', 'C030', 'Sligro Food Group'],
            ['05-02-2024', '4700', 'ICT hardware', 'Laptops administratie', '8900,00', '1869,00', '21', 'KP003', 'C040', 'Dell BV'],
            ['10-02-2024', '4030', 'Overige personeelskosten', 'Bedrijfskleding verpleging', '3200,00', '672,00', '21', 'KP002', 'C050', 'Textiel Service BV'],
            ['15-02-2024', '4310', 'Advieskosten', 'Juridisch advies fusie', '22000,00', '4620,00', '21', 'KP003', 'C060', 'Loyens & Loeff'],
            ['18-02-2024', '4120', 'Schoonmaakkosten', 'Schoonmaak februari', '9500,00', '1995,00', '21', 'KP001', 'C070', 'CSU Cleaning'],
            ['20-02-2024', '4600', 'Onderhoud installaties', 'Onderhoud CV/airco', '5400,00', '1134,00', '21', 'KP001', 'C080', 'Wolter & Dros'],
            ['25-02-2024', '4800', 'Rentekosten', 'Rente hypotheek Q1', '18000,00', '0,00', '0', 'KP003', 'C090', 'ABN AMRO'],
            ['01-03-2024', '4210', 'Telefoonkosten', 'Telefonie en internet maart', '3800,00', '798,00', '21', 'KP003', 'C041', 'KPN Zakelijk'],
            ['05-03-2024', '4420', 'Laboratoriumkosten', 'Labonderzoeken Q1', '7500,00', '1575,00', '21', 'KP010', 'C100', 'PAMM Laboratorium'],
            ['10-03-2024', '4050', 'Opleidingskosten', 'Bijscholing verpleegkundig personeel', '4500,00', '945,00', '21', 'KP002', 'C110', 'V&VN'],
            ['15-03-2024', '4130', 'Onderhoud gebouw', 'Schilderwerk buitenzijde', '28000,00', '5880,00', '21', 'KP001', 'C120', 'Van der Werf Schilders'],
            ['20-03-2024', '8000', 'Omzet zorg WLZ', 'Productie WLZ maart', '-185000,00', '0,00', '0', '', '', 'Zorgkantoor'],
            ['20-03-2024', '8100', 'Omzet catering extern', 'Omzet restaurant medewerkers', '-12500,00', '-2625,00', '21', 'KP005', '', 'Diverse'],
            ['25-03-2024', '4330', 'Bestuurskosten', 'Representatiekosten RvB', '2800,00', '588,00', '21', 'KP003', 'C130', 'Hotel Okura']
        ];

        return U.arrayToCSV([header].concat(rows));
    }

    function generateExampleCrediteuren() {
        var header = ['Crediteurcode', 'Naam', 'Type', 'BTW-classificatie', 'Opmerkingen'];
        var rows = [
            ['C001', 'Vastgoed BV', 'Huisvesting', 'pre-pro-rata', 'Verhuurder kantoor/zorgpand - 30% kantoor, 70% zorg'],
            ['C002', 'Eneco Zakelijk', 'Energie', 'pre-pro-rata', 'Energieleverancier gehele pand'],
            ['C003', 'Staples BV', 'Kantoor', 'pro rata', 'Kantoorartikelen'],
            ['C010', 'Mediq', 'Medisch', 'niet-aftrekbaar', 'Leverancier medische middelen'],
            ['C011', 'Brocacef', 'Medisch', 'niet-aftrekbaar', 'Geneesmiddelen leverancier'],
            ['C020', 'BDO Audit', 'Advies', 'pro rata', 'Accountant'],
            ['C030', 'Sligro Food Group', 'Voeding', '', 'Vraag: patient of medewerker voeding?'],
            ['C040', 'Dell BV', 'ICT', 'pro rata', 'Hardware leverancier'],
            ['C050', 'Textiel Service BV', 'Personeel', '', 'Vraag: zorgpersoneel of kantoor?'],
            ['C060', 'Loyens & Loeff', 'Advies', '', 'Afhankelijk van adviesonderwerp'],
            ['C070', 'CSU Cleaning', 'Facilitair', 'pre-pro-rata', 'Schoonmaak gehele pand'],
            ['C080', 'Wolter & Dros', 'Techniek', 'pre-pro-rata', 'Onderhoud installaties'],
            ['C090', 'ABN AMRO', 'Financieel', 'niet-aftrekbaar', 'Bancaire kosten vrijgesteld'],
            ['C100', 'PAMM Laboratorium', 'Medisch', 'niet-aftrekbaar', 'Laboratoriumonderzoeken'],
            ['C110', 'V&VN', 'Opleiding', 'niet-aftrekbaar', 'Opleiding zorgpersoneel'],
            ['C120', 'Van der Werf Schilders', 'Onderhoud', 'pre-pro-rata', 'Onderhoud pand'],
            ['C130', 'Hotel Okura', 'Representatie', 'pro rata', 'Bestuurskosten']
        ];

        return U.arrayToCSV([header].concat(rows));
    }

    return {
        mutationFields: mutationFields,
        crediteurFields: crediteurFields,
        autoMapColumns: autoMapColumns,
        renderMapping: renderMapping,
        getMapping: getMapping,
        parseMutations: parseMutations,
        parseCrediteuren: parseCrediteuren,
        renderPreviewTable: renderPreviewTable,
        generateExampleMutations: generateExampleMutations,
        generateExampleCrediteuren: generateExampleCrediteuren
    };
})();
