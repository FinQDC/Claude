/* === Import Handler - CSV import voor investeringsfacturen === */
App.ImportHandler = (function() {
    'use strict';

    var U = App.Utils;

    // Verwachte velden voor factuurregels
    var factuurVelden = [
        { key: 'factuurDatum', label: 'Factuurdatum', required: true },
        { key: 'factuurNummer', label: 'Factuurnummer', required: false },
        { key: 'leverancier', label: 'Leverancier', required: false },
        { key: 'omschrijving', label: 'Omschrijving', required: true },
        { key: 'projectType', label: 'Projecttype', required: false },
        { key: 'categorie', label: 'Categorie', required: false },
        { key: 'subcategorie', label: 'Subcategorie', required: false },
        { key: 'bedragExclBTW', label: 'Bedrag excl. BTW', required: true },
        { key: 'btwBedrag', label: 'BTW bedrag', required: false },
        { key: 'btwPercentage', label: 'BTW percentage', required: false },
        { key: 'ruimte', label: 'Ruimte/gebouwdeel', required: false }
    ];

    // Automatische kolomherkenning
    function autoMapColumns(headers, velden) {
        var mapping = {};
        var aliassen = {
            'factuurDatum': ['factuurdatum', 'datum', 'date', 'boekdatum', 'faktuurdatum'],
            'factuurNummer': ['factuurnummer', 'factuur', 'factuurnr', 'nummer', 'invoice'],
            'leverancier': ['leverancier', 'aannemer', 'crediteur', 'supplier', 'naam leverancier', 'opdrachtnemer'],
            'omschrijving': ['omschrijving', 'description', 'werkzaamheden', 'tekst', 'toelichting', 'post'],
            'projectType': ['projecttype', 'project type', 'type project', 'type', 'soort project'],
            'categorie': ['categorie', 'category', 'kostensoort', 'kostengroep', 'hoofdgroep'],
            'subcategorie': ['subcategorie', 'sub categorie', 'deelpost', 'subgroep'],
            'bedragExclBTW': ['bedrag excl', 'bedrag', 'excl btw', 'netto', 'amount', 'bedrag excl. btw', 'kosten'],
            'btwBedrag': ['btw bedrag', 'btw', 'vat', 'omzetbelasting', 'btw_bedrag'],
            'btwPercentage': ['btw percentage', 'btw%', 'btw perc', 'tarief', 'btw tarief'],
            'ruimte': ['ruimte', 'gebouwdeel', 'locatie', 'verdieping', 'vleugel']
        };

        var genormaliseerd = headers.map(function(h) {
            return h.toLowerCase().trim().replace(/[_\-]/g, ' ');
        });

        velden.forEach(function(veld) {
            var veldAliassen = aliassen[veld.key] || [veld.key];
            mapping[veld.key] = -1;

            for (var i = 0; i < genormaliseerd.length; i++) {
                for (var j = 0; j < veldAliassen.length; j++) {
                    if (genormaliseerd[i] === veldAliassen[j] ||
                        genormaliseerd[i].indexOf(veldAliassen[j]) > -1) {
                        mapping[veld.key] = i;
                        return;
                    }
                }
            }
        });

        return mapping;
    }

    function renderMapping(containerId, headers, velden, mapping) {
        var container = document.getElementById(containerId);
        container.innerHTML = '';

        velden.forEach(function(veld) {
            var item = document.createElement('div');
            item.className = 'mapping-item';

            var label = document.createElement('label');
            label.textContent = veld.label + (veld.required ? ' *' : '');
            item.appendChild(label);

            var select = document.createElement('select');
            select.className = 'form-select';
            select.dataset.field = veld.key;

            var optGeenKeuze = document.createElement('option');
            optGeenKeuze.value = '-1';
            optGeenKeuze.textContent = '-- Niet toewijzen --';
            select.appendChild(optGeenKeuze);

            headers.forEach(function(h, idx) {
                var opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = h;
                if (mapping[veld.key] === idx) opt.selected = true;
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

    function normaliseProjectType(val) {
        if (!val) return '';
        val = String(val).toLowerCase().trim();
        if (val.indexOf('nieuwbouw') > -1 || val.indexOf('new') > -1) return 'nieuwbouw';
        if (val.indexOf('verbouw') > -1 || val.indexOf('renovatie') > -1 || val.indexOf('renov') > -1) return 'verbouw';
        if (val.indexOf('duurzaam') > -1 || val.indexOf('verduurzam') > -1 || val.indexOf('energie') > -1 || val.indexOf('sustain') > -1) return 'verduurzaming';
        return '';
    }

    function normaliseCategorie(val) {
        if (!val) return '';
        val = String(val).toLowerCase().trim();
        if (val.indexOf('bouwkund') > -1 || val.indexOf('constructie') > -1 || val.indexOf('ruwbouw') > -1) return 'bouwkundig';
        if (val.indexOf('installat') > -1 || val.indexOf('e/w') > -1 || val.indexOf('elektra') > -1 || val.indexOf('sanitair') > -1) return 'installaties';
        if (val.indexOf('afbouw') > -1 || val.indexOf('interieur') > -1 || val.indexOf('vloer') > -1 || val.indexOf('plafond') > -1) return 'afbouw';
        if (val.indexOf('terrein') > -1 || val.indexOf('buiten') > -1 || val.indexOf('parkeer') > -1 || val.indexOf('tuin') > -1) return 'terrein';
        if (val.indexOf('duurzaam') > -1 || val.indexOf('zonnepa') > -1 || val.indexOf('isolatie') > -1 || val.indexOf('warmtepomp') > -1 || val.indexOf('led') > -1 || val.indexOf('laadp') > -1) return 'duurzaamheid';
        if (val.indexOf('inricht') > -1 || val.indexOf('inventar') > -1 || val.indexOf('meubil') > -1 || val.indexOf('apparatuur') > -1) return 'inrichting';
        if (val.indexOf('advies') > -1 || val.indexOf('architec') > -1 || val.indexOf('begeleid') > -1 || val.indexOf('directie') > -1) return 'advies';
        return '';
    }

    function parseFactuurregels(rows, mapping) {
        var regels = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var r = {
                id: U.generateId(),
                factuurDatum: mapping.factuurDatum >= 0 ? U.parseDate(row[mapping.factuurDatum] || '') : '',
                factuurNummer: mapping.factuurNummer >= 0 ? String(row[mapping.factuurNummer] || '').trim() : '',
                leverancier: mapping.leverancier >= 0 ? String(row[mapping.leverancier] || '').trim() : '',
                omschrijving: mapping.omschrijving >= 0 ? String(row[mapping.omschrijving] || '').trim() : '',
                projectType: mapping.projectType >= 0 ? normaliseProjectType(row[mapping.projectType]) : '',
                categorie: mapping.categorie >= 0 ? normaliseCategorie(row[mapping.categorie]) : '',
                subcategorie: mapping.subcategorie >= 0 ? String(row[mapping.subcategorie] || '').trim() : '',
                bedragExclBTW: mapping.bedragExclBTW >= 0 ? U.parseAmount(row[mapping.bedragExclBTW]) : 0,
                btwBedrag: mapping.btwBedrag >= 0 ? U.parseAmount(row[mapping.btwBedrag]) : 0,
                btwPercentage: mapping.btwPercentage >= 0 ? U.parseAmount(row[mapping.btwPercentage]) : 21,
                ruimte: mapping.ruimte >= 0 ? String(row[mapping.ruimte] || '').trim() : '',
                // Beoordelingsvelden
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

            // Automatisch BTW berekenen als niet opgegeven
            if (r.btwBedrag === 0 && r.bedragExclBTW !== 0 && r.btwPercentage > 0) {
                r.btwBedrag = r.bedragExclBTW * (r.btwPercentage / 100);
            }

            if (r.omschrijving || r.bedragExclBTW !== 0) {
                regels.push(r);
            }
        }
        return regels;
    }

    function renderPreviewTable(tableId, headers, rows, maxRijen) {
        maxRijen = maxRijen || 5;
        var table = document.getElementById(tableId);
        var thead = table.querySelector('thead');
        var tbody = table.querySelector('tbody');

        thead.innerHTML = '<tr>' + headers.map(function(h) {
            return '<th>' + U.escapeHtml(h) + '</th>';
        }).join('') + '</tr>';

        tbody.innerHTML = rows.slice(0, maxRijen).map(function(row) {
            return '<tr>' + row.map(function(cel) {
                return '<td>' + U.escapeHtml(String(cel || '')) + '</td>';
            }).join('') + '</tr>';
        }).join('');

        if (rows.length > maxRijen) {
            tbody.innerHTML += '<tr><td colspan="' + headers.length + '" class="text-muted text-center">... en ' +
                (rows.length - maxRijen) + ' meer regels</td></tr>';
        }
    }

    function genereerVoorbeeldFacturen() {
        var header = ['Factuurdatum', 'Factuurnummer', 'Leverancier', 'Omschrijving', 'Projecttype', 'Categorie', 'Bedrag excl. BTW', 'BTW bedrag', 'BTW %'];
        var regels = [
            ['15-01-2024', 'FN-2024-001', 'Bouwbedrijf Van Dam BV', 'Heiwerkzaamheden nieuwbouw', 'Nieuwbouw', 'Bouwkundig', '285000,00', '59850,00', '21'],
            ['22-01-2024', 'FN-2024-002', 'Bouwbedrijf Van Dam BV', 'Betonwerk fundering', 'Nieuwbouw', 'Bouwkundig', '195000,00', '40950,00', '21'],
            ['05-02-2024', 'FN-2024-003', 'Architectenbureau MVSA', 'Architectkosten ontwerp fase', 'Nieuwbouw', 'Advies', '125000,00', '26250,00', '21'],
            ['12-02-2024', 'FN-2024-004', 'Installatiebedrijf Wolter & Dros', 'HVAC installatie zorgvleugel', 'Nieuwbouw', 'Installaties', '320000,00', '67200,00', '21'],
            ['20-02-2024', 'FN-2024-005', 'Installatiebedrijf Wolter & Dros', 'Elektra-installatie compleet', 'Nieuwbouw', 'Installaties', '175000,00', '36750,00', '21'],
            ['01-03-2024', 'FN-2024-006', 'Bouwbedrijf Van Dam BV', 'Metselwerk gevels', 'Nieuwbouw', 'Bouwkundig', '165000,00', '34650,00', '21'],
            ['15-03-2024', 'FN-2024-007', 'Duurzaam Installeren BV', 'Zonnepanelen dak (450 panelen)', 'Verduurzaming', 'Duurzaamheid', '180000,00', '37800,00', '21'],
            ['20-03-2024', 'FN-2024-008', 'Duurzaam Installeren BV', 'Warmtepompen (WKO installatie)', 'Verduurzaming', 'Duurzaamheid', '250000,00', '52500,00', '21'],
            ['01-04-2024', 'FN-2024-009', 'Isolatie Expert BV', 'Gevelisolatie (Rc 6.5)', 'Verduurzaming', 'Duurzaamheid', '95000,00', '19950,00', '21'],
            ['10-04-2024', 'FN-2024-010', 'Isolatie Expert BV', 'Dakisolatie (Rc 6.5)', 'Verduurzaming', 'Duurzaamheid', '78000,00', '16380,00', '21'],
            ['15-04-2024', 'FN-2024-011', 'LED Verlichting BV', 'LED verlichting gehele gebouw', 'Verduurzaming', 'Duurzaamheid', '62000,00', '13020,00', '21'],
            ['20-04-2024', 'FN-2024-012', 'Afbouw Plus BV', 'Systeemwanden verpleegafdelingen', 'Nieuwbouw', 'Afbouw', '145000,00', '30450,00', '21'],
            ['01-05-2024', 'FN-2024-013', 'Afbouw Plus BV', 'Plafonds en vloeren kantoorgedeelte', 'Nieuwbouw', 'Afbouw', '88000,00', '18480,00', '21'],
            ['10-05-2024', 'FN-2024-014', 'Keuken & Catering Techniek BV', 'Professionele keukeninstallatie', 'Nieuwbouw', 'Installaties', '125000,00', '26250,00', '21'],
            ['15-05-2024', 'FN-2024-015', 'GreenParking BV', 'Laadpalen parkeerterrein (10 stuks)', 'Verduurzaming', 'Duurzaamheid', '45000,00', '9450,00', '21'],
            ['20-05-2024', 'FN-2024-016', 'Terrein & Groen BV', 'Bestrating en groenvoorziening', 'Nieuwbouw', 'Terrein', '95000,00', '19950,00', '21'],
            ['01-06-2024', 'FN-2024-017', 'Medisch Meubilair BV', 'Zorgmeubilair verpleegafdelingen', 'Nieuwbouw', 'Inrichting', '210000,00', '44100,00', '21'],
            ['05-06-2024', 'FN-2024-018', 'Kantoorinrichting BV', 'Kantoormeubilair administratie', 'Nieuwbouw', 'Inrichting', '35000,00', '7350,00', '21'],
            ['10-06-2024', 'FN-2024-019', 'Bouwbedrijf Jansen', 'Verbouw bestaande receptie', 'Verbouw', 'Bouwkundig', '68000,00', '14280,00', '21'],
            ['15-06-2024', 'FN-2024-020', 'Adviesbureau Fiscaal BV', 'Fiscaal advies BTW-positie nieuwbouw', 'Nieuwbouw', 'Advies', '18000,00', '3780,00', '21']
        ];

        return U.arrayToCSV([header].concat(regels));
    }

    return {
        factuurVelden: factuurVelden,
        autoMapColumns: autoMapColumns,
        renderMapping: renderMapping,
        getMapping: getMapping,
        parseFactuurregels: parseFactuurregels,
        renderPreviewTable: renderPreviewTable,
        genereerVoorbeeldFacturen: genereerVoorbeeldFacturen
    };
})();
