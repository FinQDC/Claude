/* === Reports Module - Rapportage investeringen zorginstellingen === */
/* Genereert fiscale rapportages, CSV-exports en samenvattingen voor
   BTW op nieuwbouw, verbouw en duurzaamheidsinvesteringen. */
App.Reports = (function() {
    'use strict';

    var U = App.Utils;
    var DS = App.DataStore;

    // Categorielabels (NL)
    var CATEGORIE_LABELS = {
        'bouwkundig':     'Bouwkundig',
        'installaties':   'Installaties (E/W/S)',
        'afbouw':         'Afbouw / interieur',
        'terrein':        'Terrein / buitenruimte',
        'duurzaamheid':   'Duurzaamheid / energie',
        'inrichting':     'Inrichting / inventaris',
        'advies':         'Advies / begeleiding',
        'overig':         'Overig'
    };

    // Projecttype-labels (NL)
    var PROJECTTYPE_LABELS = {
        'nieuwbouw':      'Nieuwbouw',
        'verbouw':        'Verbouw / renovatie',
        'verduurzaming':  'Verduurzaming',
        'overig':         'Overig'
    };

    // Bestemmingslabels (NL)
    var BESTEMMING_LABELS = {
        'zorg':        'Zorgverlening (vrijgesteld)',
        'kantoor':     'Kantoor / administratie',
        'commercieel': 'Commercieel belast',
        'algemeen':    'Algemeen / gedeeld'
    };

    // =========================================================================
    // Fiscaal investeringsrapport (HTML)
    // =========================================================================

    /**
     * Genereert een compleet fiscaal investeringsrapport als HTML.
     * Bevat:
     * 1. Projectinformatie
     * 2. Bestemmingsanalyse (ruimtes / m2)
     * 3. Samenvatting per classificatie
     * 4. Samenvatting per categorie
     * 5. Samenvatting per projecttype
     * 6. Pre-pro-rata berekening
     * 7. Herzieningsoverzicht (art. 13 Uitv.besch. OB)
     * 8. Openstaande vragen
     * 9. Disclaimer
     */
    function genereerFiscaalRapport() {
        var samenvatting = App.Assessment.berekenSamenvatting();
        var instellingen = DS.getInstellingen();
        var investeringen = DS.getInvesteringen();
        var vragen = DS.getVragen();
        var ruimtes = DS.getRuimtes();

        var html = '';

        // ======================
        // 1. Projectinformatie
        // ======================
        html += '<div class="report-section">';
        html += '<h4>1. Projectinformatie</h4>';
        html += '<table class="report-table">';
        html += '<tr><td style="width:220px;"><strong>Zorginstelling</strong></td>';
        html += '<td>' + U.escapeHtml(instellingen.organisatie || '-') + '</td></tr>';
        html += '<tr><td><strong>Projectnaam</strong></td>';
        html += '<td>' + U.escapeHtml(instellingen.projectNaam || '-') + '</td></tr>';
        html += '<tr><td><strong>Beoordelingsperiode</strong></td>';
        html += '<td>' + U.escapeHtml(instellingen.periode || '-') + '</td></tr>';
        html += '<tr><td><strong>Jaar ingebruikname</strong></td>';
        html += '<td>' + (samenvatting.bouwjaar || '-') + '</td></tr>';
        html += '<tr><td><strong>Pro rata percentage</strong></td>';
        html += '<td>' + U.formatPercentage(samenvatting.proRataPercentage) + '</td></tr>';
        html += '<tr><td><strong>Rapportagedatum</strong></td>';
        html += '<td>' + new Date().toLocaleDateString('nl-NL') + '</td></tr>';
        html += '<tr><td><strong>Aantal investeringsregels</strong></td>';
        html += '<td>' + U.formatNumber(samenvatting.totaalRegels) + '</td></tr>';
        html += '<tr><td><strong>Totaal bedrag excl. BTW</strong></td>';
        html += '<td>' + U.formatCurrency(samenvatting.totaalBedragExcl) + '</td></tr>';
        html += '<tr><td><strong>Totaal BTW</strong></td>';
        html += '<td>' + U.formatCurrency(samenvatting.totaalBTW) + '</td></tr>';
        html += '</table>';
        html += '</div>';

        // ======================
        // 2. Bestemmingsanalyse
        // ======================
        html += '<div class="report-section">';
        html += '<h4>2. Bestemmingsanalyse (ruimtes / m&sup2;)</h4>';

        if (ruimtes.length === 0) {
            html += '<p style="color:var(--warning);font-weight:500;">Let op: er zijn geen ruimtes gedefinieerd. ';
            html += 'De pre-pro-rata berekening kan niet correct worden uitgevoerd zonder bestemmingsverhouding. ';
            html += 'Definieer de ruimtes en hun bestemming onder het tabblad "Ruimtes".</p>';
        } else {
            var best = samenvatting.bestemming;

            // Ruimtetabel
            html += '<table class="report-table">';
            html += '<thead><tr>';
            html += '<th>Ruimte / gebouwdeel</th>';
            html += '<th class="num">Oppervlakte (m&sup2;)</th>';
            html += '<th>Bestemming</th>';
            html += '<th>Toelichting</th>';
            html += '</tr></thead><tbody>';

            ruimtes.forEach(function(r) {
                html += '<tr>';
                html += '<td>' + U.escapeHtml(r.naam || r.ruimte || '-') + '</td>';
                html += '<td class="num">' + U.formatNumber(parseFloat(r.oppervlakte) || 0) + ' m&sup2;</td>';
                html += '<td>' + U.escapeHtml(BESTEMMING_LABELS[r.bestemming] || r.bestemming || '-') + '</td>';
                html += '<td>' + U.escapeHtml(r.toelichting || '-') + '</td>';
                html += '</tr>';
            });

            html += '</tbody></table>';

            // Bestemmingsverhouding samenvatting
            html += '<table class="report-table" style="margin-top:0.75rem;">';
            html += '<thead><tr>';
            html += '<th>Bestemming</th><th class="num">m&sup2;</th><th class="num">Percentage</th>';
            html += '<th>BTW-gevolg</th>';
            html += '</tr></thead><tbody>';

            var perBestemming = best.perBestemming || {};
            var bestemmingRijen = [
                { key: 'zorg',        label: 'Zorgverlening (vrijgesteld)', pct: best.zorgPct,        gevolg: 'Niet-aftrekbaar' },
                { key: 'kantoor',     label: 'Kantoor / administratie',     pct: best.kantoorPct,     gevolg: 'Pro rata aftrekbaar' },
                { key: 'commercieel', label: 'Commercieel belast',          pct: best.commercieelPct, gevolg: 'Volledig aftrekbaar' },
                { key: 'algemeen',    label: 'Algemeen / gedeeld',          pct: best.algemeenPct,    gevolg: 'Pro rata aftrekbaar' }
            ];

            bestemmingRijen.forEach(function(rij) {
                var m2 = perBestemming[rij.key] || 0;
                html += '<tr>';
                html += '<td>' + rij.label + '</td>';
                html += '<td class="num">' + U.formatNumber(m2) + ' m&sup2;</td>';
                html += '<td class="num">' + U.formatPercentage(rij.pct || 0) + '</td>';
                html += '<td>' + rij.gevolg + '</td>';
                html += '</tr>';
            });

            html += '<tr style="font-weight:600;border-top:2px solid var(--border);">';
            html += '<td>Totaal</td>';
            html += '<td class="num">' + U.formatNumber(best.totaalM2 || 0) + ' m&sup2;</td>';
            html += '<td class="num">100,0%</td>';
            html += '<td></td>';
            html += '</tr>';
            html += '</tbody></table>';

            // Pre-pro-rata toelichting
            html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:0.5rem;">';
            html += 'De bestemmingsverhouding wordt bepaald op basis van de vloeroppervlakte (m&sup2;) van de ruimtes. ';
            html += 'Het commercieel belaste deel is volledig aftrekbaar. Het kantoor- en algemeen deel is aftrekbaar ';
            html += 'via het pro rata percentage (' + U.formatPercentage(samenvatting.proRataPercentage) + '). ';
            html += 'Het zorgdeel is niet aftrekbaar (vrijgestelde prestaties).';
            html += '</p>';
        }

        html += '</div>';

        // ======================
        // 3. Samenvatting per classificatie
        // ======================
        html += '<div class="report-section">';
        html += '<h4>3. Samenvatting per BTW-classificatie</h4>';
        html += '<table class="report-table">';
        html += '<thead><tr>';
        html += '<th>Classificatie</th>';
        html += '<th class="num">Aantal</th>';
        html += '<th class="num">Bedrag excl. BTW</th>';
        html += '<th class="num">BTW bedrag</th>';
        html += '<th class="num">Aftrekbare BTW</th>';
        html += '<th class="num">Niet-aftrekbare BTW</th>';
        html += '</tr></thead><tbody>';

        var classificatieVolgorde = ['aftrekbaar', 'niet-aftrekbaar', 'pre-pro-rata', 'onbeoordeeld'];
        classificatieVolgorde.forEach(function(cl) {
            var d = samenvatting.classificaties[cl];
            if (!d || d.count === 0) return;
            var nietAftrekbaar = d.btw - d.aftrekbareBTW;
            html += '<tr>';
            html += '<td>' + U.classificationBadge(cl) + '</td>';
            html += '<td class="num">' + U.formatNumber(d.count) + '</td>';
            html += '<td class="num">' + U.formatCurrency(d.bedragExcl) + '</td>';
            html += '<td class="num">' + U.formatCurrency(d.btw) + '</td>';
            html += '<td class="num">' + U.formatCurrency(d.aftrekbareBTW) + '</td>';
            html += '<td class="num">' + U.formatCurrency(nietAftrekbaar) + '</td>';
            html += '</tr>';
        });

        html += '</tbody><tfoot><tr>';
        html += '<td><strong>Totaal</strong></td>';
        html += '<td class="num"><strong>' + U.formatNumber(samenvatting.totaalRegels) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(samenvatting.totaalBedragExcl) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(samenvatting.totaalBTW) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(samenvatting.totaalAftrekbareBTW) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(samenvatting.totaalNietAftrekbareBTW) + '</strong></td>';
        html += '</tr></tfoot></table>';
        html += '</div>';

        // ======================
        // 4. Samenvatting per categorie
        // ======================
        html += '<div class="report-section">';
        html += '<h4>4. Samenvatting per investeringscategorie</h4>';
        html += genereerGroepTabel(
            samenvatting.categorieen,
            CATEGORIE_LABELS,
            ['bouwkundig', 'installaties', 'afbouw', 'terrein', 'duurzaamheid', 'inrichting', 'advies', 'overig']
        );
        html += '</div>';

        // ======================
        // 5. Samenvatting per projecttype
        // ======================
        html += '<div class="report-section">';
        html += '<h4>5. Samenvatting per projecttype</h4>';
        html += genereerGroepTabel(
            samenvatting.projectTypen,
            PROJECTTYPE_LABELS,
            ['nieuwbouw', 'verbouw', 'verduurzaming', 'overig']
        );
        html += '</div>';

        // ======================
        // 6. Pre-pro-rata berekeningsdetail
        // ======================
        html += '<div class="report-section">';
        html += '<h4>6. Pre-pro-rata berekening</h4>';

        var pprData = samenvatting.classificaties['pre-pro-rata'];
        if (pprData && pprData.count > 0) {
            var best = samenvatting.bestemming;
            html += '<table class="report-table">';
            html += '<tr><td style="width:320px;">Totaal BTW op pre-pro-rata investeringen</td>';
            html += '<td class="num"><strong>' + U.formatCurrency(pprData.btw) + '</strong></td></tr>';

            html += '<tr><td>Commercieel deel (' + U.formatPercentage(best.commercieelPct || 0) + ' van m&sup2;)</td>';
            var commercieelBTW = pprData.btw * ((best.commercieelPct || 0) / 100);
            html += '<td class="num">' + U.formatCurrency(commercieelBTW) + ' (volledig aftrekbaar)</td></tr>';

            var kantoorAlgPct = (best.kantoorPct || 0) + (best.algemeenPct || 0);
            var kantoorAlgBTW = pprData.btw * (kantoorAlgPct / 100);
            var kantoorAlgAftrekbaar = kantoorAlgBTW * (samenvatting.proRataPercentage / 100);
            html += '<tr><td>Kantoor + algemeen deel (' + U.formatPercentage(kantoorAlgPct) + ' van m&sup2;)</td>';
            html += '<td class="num">' + U.formatCurrency(kantoorAlgBTW) + '</td></tr>';

            html += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Waarvan aftrekbaar (x pro rata ' +
                U.formatPercentage(samenvatting.proRataPercentage) + ')</td>';
            html += '<td class="num">' + U.formatCurrency(kantoorAlgAftrekbaar) + '</td></tr>';

            var zorgBTW = pprData.btw * ((best.zorgPct || 0) / 100);
            html += '<tr><td>Zorgdeel (' + U.formatPercentage(best.zorgPct || 0) + ' van m&sup2;)</td>';
            html += '<td class="num">' + U.formatCurrency(zorgBTW) + ' (niet-aftrekbaar)</td></tr>';

            html += '<tr style="font-weight:600;border-top:2px solid var(--border);">';
            html += '<td>Totaal aftrekbare BTW (pre-pro-rata)</td>';
            html += '<td class="num">' + U.formatCurrency(pprData.aftrekbareBTW) + '</td></tr>';

            html += '</table>';

            html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:0.5rem;">';
            html += 'Berekening: commercieel deel (100% aftrekbaar) + kantoor/algemeen deel (&times; pro rata %) = aftrekbare BTW.<br>';
            html += 'Formule: BTW &times; (commercieel% / 100) + BTW &times; ((kantoor% + algemeen%) / 100) &times; (pro rata% / 100)';
            html += '</p>';
        } else {
            html += '<p class="text-muted">Geen investeringen met pre-pro-rata classificatie.</p>';
        }

        html += '</div>';

        // ======================
        // 7. Herzieningsoverzicht
        // ======================
        html += '<div class="report-section">';
        html += '<h4>7. Herzieningsoverzicht (art. 13 Uitvoeringsbeschikking OB)</h4>';
        html += '<p style="font-size:0.82rem;margin-bottom:0.75rem;">';
        html += 'Op grond van artikel 13 van de Uitvoeringsbeschikking omzetbelasting 1968 geldt een herzieningsregeling ';
        html += 'voor investeringsgoederen. Als het gebruik van het investeringsgoed wijzigt ten opzichte van het ';
        html += 'boekjaar van ingebruikname, dient de BTW-aftrek jaarlijks te worden herzien.';
        html += '</p>';

        // Onroerend goed (10 jaar)
        html += genereerHerzieningstabel(
            'Onroerend goed (herzieningstermijn 10 jaar)',
            samenvatting.herziening.onroerend,
            samenvatting.herzieningsjaren.onroerend
        );

        // Roerend goed (5 jaar)
        html += genereerHerzieningstabel(
            'Roerend goed (herzieningstermijn 5 jaar)',
            samenvatting.herziening.roerend,
            samenvatting.herzieningsjaren.roerend
        );

        html += '</div>';

        // ======================
        // 8. Openstaande vragen
        // ======================
        var openVragen = vragen.filter(function(v) { return !v.beantwoord; });
        if (openVragen.length > 0) {
            html += '<div class="report-section">';
            html += '<h4 style="color:var(--warning);">8. Openstaande vragen (' + openVragen.length + ')</h4>';
            html += '<p style="color:var(--danger);font-weight:500;">';
            html += 'Let op: er zijn nog ' + openVragen.length + ' onbeantwoorde verduidelijkingsvragen. ';
            html += 'Beantwoord deze vragen voor een volledige beoordeling van alle investeringsregels. ';
            html += 'De classificatie van gerelateerde investeringen kan wijzigen na beantwoording.';
            html += '</p>';
            html += '<table class="report-table">';
            html += '<thead><tr>';
            html += '<th>Vraag</th>';
            html += '<th class="num">Gerelateerde regels</th>';
            html += '<th>Huidige classificatie</th>';
            html += '</tr></thead><tbody>';

            openVragen.forEach(function(v) {
                var aantalRegels = (v.investeringIds || v.mutationIds || []).length;
                html += '<tr>';
                html += '<td>' + U.escapeHtml(v.vraagTekst || v.questionText || '-') + '</td>';
                html += '<td class="num">' + aantalRegels + '</td>';
                html += '<td>' + U.classificationBadge(v.classificatie || v.classification || 'onbeoordeeld') + '</td>';
                html += '</tr>';
            });

            html += '</tbody></table>';
            html += '</div>';
        }

        // Onbeoordeelde investeringen waarschuwing
        var onbeoordeeld = samenvatting.classificaties['onbeoordeeld'];
        if (onbeoordeeld && onbeoordeeld.count > 0) {
            html += '<div class="report-section">';
            html += '<h4 style="color:var(--danger);">Onbeoordeelde investeringen (' + onbeoordeeld.count + ')</h4>';
            html += '<p style="color:var(--danger);">';
            html += 'Er zijn ' + onbeoordeeld.count + ' investeringsregels zonder classificatie ';
            html += 'met een totaal BTW-bedrag van ' + U.formatCurrency(onbeoordeeld.btw) + '. ';
            html += 'Controleer de classificatieregels en beantwoord openstaande vragen.';
            html += '</p>';
            html += '</div>';
        }

        // ======================
        // 9. Disclaimer
        // ======================
        html += '<div class="report-section" style="border-top:2px solid var(--border);padding-top:1rem;margin-top:1.5rem;">';
        html += '<h4>Disclaimer</h4>';
        html += '<p style="font-size:0.8rem;color:var(--text-light);">';
        html += 'Dit rapport is gegenereerd door de BTW Investeringstool Zorg en dient als hulpmiddel bij de fiscale ';
        html += 'beoordeling van het recht op aftrek van voorbelasting op investeringen in nieuwbouw, verbouw en ';
        html += 'duurzaamheidsmaatregelen door zorginstellingen. De classificaties zijn gebaseerd op regelgebaseerde ';
        html += 'logica en de opgegeven bestemmingsverhouding van het gebouw. ';
        html += '</p>';
        html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:0.5rem;">';
        html += 'De berekeningen dienen te worden gevalideerd door een fiscaal adviseur met kennis van BTW in de ';
        html += 'zorgsector. De herzieningsberekeningen zijn indicatief en gebaseerd op een constante bestemmings';
        html += 'verhouding. Bij wijziging van het gebruik dienen de werkelijke herzieningsbedragen te worden berekend. ';
        html += 'Dit rapport vervangt geen professioneel fiscaal advies. De gebruiker is zelf verantwoordelijk voor ';
        html += 'de juistheid van de BTW-aangifte en de herzieningstermijnen.';
        html += '</p>';
        html += '</div>';

        return html;
    }

    // =========================================================================
    // Hulpfunctie: groeptabel genereren (categorie / projecttype)
    // =========================================================================

    /**
     * Genereert een HTML-tabel voor een gegroepeerde samenvatting.
     *
     * @param {object} groepData - Object met groepsleutels en { count, bedragExcl, btw, aftrekbareBTW }
     * @param {object} labels - Object met groepsleutel -> display label
     * @param {string[]} volgorde - Gewenste volgorde van sleutels
     * @returns {string} HTML tabel
     */
    function genereerGroepTabel(groepData, labels, volgorde) {
        var html = '<table class="report-table">';
        html += '<thead><tr>';
        html += '<th>Categorie</th>';
        html += '<th class="num">Aantal</th>';
        html += '<th class="num">Bedrag excl. BTW</th>';
        html += '<th class="num">BTW bedrag</th>';
        html += '<th class="num">Aftrekbare BTW</th>';
        html += '<th class="num">Aftrek %</th>';
        html += '</tr></thead><tbody>';

        var totaalCount = 0;
        var totaalBedrag = 0;
        var totaalBTW = 0;
        var totaalAftrekbaar = 0;

        // Verwerk in de aangegeven volgorde, inclusief niet-voorziene sleutels
        var verwerkt = {};
        var sleutels = volgorde.slice();
        Object.keys(groepData).forEach(function(k) {
            if (sleutels.indexOf(k) === -1) sleutels.push(k);
        });

        sleutels.forEach(function(key) {
            if (verwerkt[key]) return;
            verwerkt[key] = true;

            var d = groepData[key];
            if (!d || d.count === 0) return;

            var label = labels[key] || key;
            var aftrekPct = d.btw > 0 ? (d.aftrekbareBTW / d.btw * 100) : 0;

            html += '<tr>';
            html += '<td>' + U.escapeHtml(label) + '</td>';
            html += '<td class="num">' + U.formatNumber(d.count) + '</td>';
            html += '<td class="num">' + U.formatCurrency(d.bedragExcl) + '</td>';
            html += '<td class="num">' + U.formatCurrency(d.btw) + '</td>';
            html += '<td class="num">' + U.formatCurrency(d.aftrekbareBTW) + '</td>';
            html += '<td class="num">' + U.formatPercentage(aftrekPct) + '</td>';
            html += '</tr>';

            totaalCount += d.count;
            totaalBedrag += d.bedragExcl;
            totaalBTW += d.btw;
            totaalAftrekbaar += d.aftrekbareBTW;
        });

        var totaalAftrekPct = totaalBTW > 0 ? (totaalAftrekbaar / totaalBTW * 100) : 0;

        html += '</tbody><tfoot><tr>';
        html += '<td><strong>Totaal</strong></td>';
        html += '<td class="num"><strong>' + U.formatNumber(totaalCount) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(totaalBedrag) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(totaalBTW) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatCurrency(totaalAftrekbaar) + '</strong></td>';
        html += '<td class="num"><strong>' + U.formatPercentage(totaalAftrekPct) + '</strong></td>';
        html += '</tr></tfoot></table>';

        return html;
    }

    // =========================================================================
    // Hulpfunctie: herzieningstabel genereren
    // =========================================================================

    /**
     * Genereert een herzieningstabel voor onroerend of roerend goed.
     *
     * @param {string} titel - Sectietitel
     * @param {object} herzData - { bedragExcl, btw, aftrekbareBTW, regels }
     * @param {object[]} jaren - Array van jarenobjecten
     * @returns {string} HTML
     */
    function genereerHerzieningstabel(titel, herzData, jaren) {
        var html = '';

        html += '<h5 style="font-size:0.88rem;margin:1rem 0 0.5rem 0;color:var(--secondary);">' +
            U.escapeHtml(titel) + '</h5>';

        if (!herzData || herzData.regels === 0) {
            html += '<p class="text-muted">Geen investeringen in deze categorie.</p>';
            return html;
        }

        // Samenvatting herzieningscategorie
        html += '<table class="report-table" style="margin-bottom:0.5rem;">';
        html += '<tr><td style="width:250px;">Aantal investeringsregels</td>';
        html += '<td class="num">' + U.formatNumber(herzData.regels) + '</td></tr>';
        html += '<tr><td>Totaal bedrag excl. BTW</td>';
        html += '<td class="num">' + U.formatCurrency(herzData.bedragExcl) + '</td></tr>';
        html += '<tr><td>Totaal BTW</td>';
        html += '<td class="num">' + U.formatCurrency(herzData.btw) + '</td></tr>';
        html += '<tr><td>Initieel aftrekbare BTW</td>';
        html += '<td class="num">' + U.formatCurrency(herzData.aftrekbareBTW) + '</td></tr>';
        html += '<tr><td>Initieel niet-aftrekbare BTW</td>';
        html += '<td class="num">' + U.formatCurrency(herzData.btw - herzData.aftrekbareBTW) + '</td></tr>';
        html += '</table>';

        // Jaartabel
        if (jaren && jaren.length > 0) {
            html += '<table class="report-table">';
            html += '<thead><tr>';
            html += '<th>Jaar</th>';
            html += '<th class="num">Herzieningsjaar</th>';
            html += '<th class="num">BTW-fractie (1/' + jaren.length + ')</th>';
            html += '<th class="num">Aftrekbaar</th>';
            html += '<th class="num">Niet-aftrekbaar</th>';
            html += '<th>Opmerking</th>';
            html += '</tr></thead><tbody>';

            var totaalAftrekbaar = 0;
            var totaalNietAftrekbaar = 0;

            jaren.forEach(function(j) {
                totaalAftrekbaar += j.aftrekbareFractie;
                totaalNietAftrekbaar += j.nietAftrekbareFractie;

                html += '<tr' + (j.isStartjaar ? ' style="background:var(--primary-lighter);"' : '') + '>';
                html += '<td>' + j.jaar + '</td>';
                html += '<td class="num">' + j.herzieningsjaar + '</td>';
                html += '<td class="num">' + U.formatCurrency(j.btwFractie) + '</td>';
                html += '<td class="num">' + U.formatCurrency(j.aftrekbareFractie) + '</td>';
                html += '<td class="num">' + U.formatCurrency(j.nietAftrekbareFractie) + '</td>';
                html += '<td style="font-size:0.78rem;color:var(--text-light);">';
                if (j.isStartjaar) {
                    html += 'Jaar van ingebruikname (initieel)';
                } else {
                    html += 'Herzien indien gebruik wijzigt';
                }
                html += '</td>';
                html += '</tr>';
            });

            html += '</tbody><tfoot><tr>';
            html += '<td colspan="2"><strong>Totaal herzieningsperiode</strong></td>';
            html += '<td class="num"><strong>' + U.formatCurrency(herzData.btw) + '</strong></td>';
            html += '<td class="num"><strong>' + U.formatCurrency(totaalAftrekbaar) + '</strong></td>';
            html += '<td class="num"><strong>' + U.formatCurrency(totaalNietAftrekbaar) + '</strong></td>';
            html += '<td></td>';
            html += '</tr></tfoot></table>';

            html += '<p style="font-size:0.78rem;color:var(--text-light);margin-top:0.3rem;">';
            html += 'Bovenstaand overzicht is gebaseerd op een constante bestemmingsverhouding. ';
            html += 'Bij wijziging van het gebruik in een herzieningsjaar dient de aftrekbare BTW ';
            html += 'voor dat jaar te worden herberekend op basis van het werkelijke gebruik.';
            html += '</p>';
        }

        return html;
    }

    // =========================================================================
    // CSV Export - Detailoverzicht investeringen
    // =========================================================================

    /**
     * Exporteert alle investeringen met beoordelingsresultaten als CSV.
     */
    function exporteerInvesteringenCSV() {
        var investeringen = DS.getInvesteringen();
        var instellingen = DS.getInstellingen();
        var proRata = parseFloat(instellingen.proRataPercentage) || 5;
        var bestPct = DS.berekenBestemmingspercentages();

        var header = [
            'Factuurdatum',
            'Factuurnummer',
            'Leverancier',
            'Omschrijving',
            'Projecttype',
            'Categorie',
            'Subcategorie',
            'Bedrag excl. BTW',
            'BTW bedrag',
            'BTW percentage',
            'Classificatie',
            'Status',
            'Herzieningstype',
            'Herzieningstermijn (jaren)',
            'Bestemming zorg %',
            'Bestemming kantoor %',
            'Bestemming commercieel %',
            'Bestemming algemeen %',
            'Pro rata %',
            'Aftrekbare BTW',
            'Niet-aftrekbare BTW',
            'Toegepaste regel',
            'Handmatig overschreven',
            'Notities'
        ];

        var rows = investeringen.map(function(inv) {
            var btw = Math.abs(parseFloat(inv.btwBedrag) || 0);
            var aftrekbaar = Math.abs(parseFloat(inv.aftrekbareBTW) || 0);
            var nietAftrekbaar = btw - aftrekbaar;

            return [
                inv.factuurDatum || '',
                inv.factuurNummer || '',
                inv.leverancier || '',
                inv.omschrijving || '',
                PROJECTTYPE_LABELS[inv.projectType] || inv.projectType || '',
                CATEGORIE_LABELS[inv.categorie] || inv.categorie || '',
                inv.subcategorie || '',
                formatCSVBedrag(inv.bedragExclBTW),
                formatCSVBedrag(inv.btwBedrag),
                inv.btwPercentage != null ? String(inv.btwPercentage) : '',
                U.classificationLabel(inv.classification),
                U.statusLabel(inv.status),
                inv.herzieningType === 'roerend' ? 'Roerend' : 'Onroerend',
                inv.herzieningType === 'roerend' ? '5' : '10',
                formatCSVBedrag(inv.bestemmingZorgPct),
                formatCSVBedrag(inv.bestemmingKantoorPct),
                formatCSVBedrag(inv.bestemmingCommercieelPct),
                formatCSVBedrag(inv.bestemmingAlgemeenPct),
                String(proRata),
                formatCSVBedrag(aftrekbaar),
                formatCSVBedrag(nietAftrekbaar),
                inv.regel || '',
                inv.handmatig ? 'Ja' : 'Nee',
                inv.notities || ''
            ];
        });

        return U.arrayToCSV([header].concat(rows));
    }

    // =========================================================================
    // CSV Export - Samenvatting
    // =========================================================================

    /**
     * Exporteert een samenvatting van de beoordeling als CSV.
     */
    function exporteerSamenvattingCSV() {
        var samenvatting = App.Assessment.berekenSamenvatting();
        var instellingen = DS.getInstellingen();

        var rows = [
            ['BTW Investeringsrapport - Samenvatting'],
            [],
            ['Projectgegevens'],
            ['Zorginstelling', instellingen.organisatie || ''],
            ['Projectnaam', instellingen.projectNaam || ''],
            ['Beoordelingsperiode', instellingen.periode || ''],
            ['Jaar ingebruikname', String(samenvatting.bouwjaar)],
            ['Pro rata percentage', String(samenvatting.proRataPercentage) + '%'],
            ['Rapportagedatum', new Date().toLocaleDateString('nl-NL')],
            [],
            ['Bestemmingsverhouding'],
            ['Bestemming', 'Percentage'],
            ['Zorgverlening (vrijgesteld)', formatCSVBedrag(samenvatting.bestemming.zorgPct) + '%'],
            ['Kantoor / administratie', formatCSVBedrag(samenvatting.bestemming.kantoorPct) + '%'],
            ['Commercieel belast', formatCSVBedrag(samenvatting.bestemming.commercieelPct) + '%'],
            ['Algemeen / gedeeld', formatCSVBedrag(samenvatting.bestemming.algemeenPct) + '%'],
            ['Totaal m2', formatCSVBedrag(samenvatting.bestemming.totaalM2)],
            [],
            ['Samenvatting per classificatie'],
            ['Classificatie', 'Aantal', 'Bedrag excl. BTW', 'BTW bedrag', 'Aftrekbare BTW', 'Niet-aftrekbare BTW']
        ];

        var classificatieVolgorde = ['aftrekbaar', 'niet-aftrekbaar', 'pre-pro-rata', 'onbeoordeeld'];
        classificatieVolgorde.forEach(function(cl) {
            var d = samenvatting.classificaties[cl];
            if (!d || d.count === 0) return;
            rows.push([
                U.classificationLabel(cl),
                String(d.count),
                formatCSVBedrag(d.bedragExcl),
                formatCSVBedrag(d.btw),
                formatCSVBedrag(d.aftrekbareBTW),
                formatCSVBedrag(d.btw - d.aftrekbareBTW)
            ]);
        });

        rows.push([
            'TOTAAL',
            String(samenvatting.totaalRegels),
            formatCSVBedrag(samenvatting.totaalBedragExcl),
            formatCSVBedrag(samenvatting.totaalBTW),
            formatCSVBedrag(samenvatting.totaalAftrekbareBTW),
            formatCSVBedrag(samenvatting.totaalNietAftrekbareBTW)
        ]);

        // Per categorie
        rows.push([]);
        rows.push(['Samenvatting per investeringscategorie']);
        rows.push(['Categorie', 'Aantal', 'Bedrag excl. BTW', 'BTW bedrag', 'Aftrekbare BTW']);

        var catVolgorde = ['bouwkundig', 'installaties', 'afbouw', 'terrein', 'duurzaamheid', 'inrichting', 'advies'];
        var catVerwerkt = {};

        catVolgorde.forEach(function(cat) {
            catVerwerkt[cat] = true;
            var d = samenvatting.categorieen[cat];
            if (!d || d.count === 0) return;
            rows.push([
                CATEGORIE_LABELS[cat] || cat,
                String(d.count),
                formatCSVBedrag(d.bedragExcl),
                formatCSVBedrag(d.btw),
                formatCSVBedrag(d.aftrekbareBTW)
            ]);
        });

        // Overige categorieen
        Object.keys(samenvatting.categorieen).forEach(function(cat) {
            if (catVerwerkt[cat]) return;
            var d = samenvatting.categorieen[cat];
            if (!d || d.count === 0) return;
            rows.push([
                CATEGORIE_LABELS[cat] || cat,
                String(d.count),
                formatCSVBedrag(d.bedragExcl),
                formatCSVBedrag(d.btw),
                formatCSVBedrag(d.aftrekbareBTW)
            ]);
        });

        // Per projecttype
        rows.push([]);
        rows.push(['Samenvatting per projecttype']);
        rows.push(['Projecttype', 'Aantal', 'Bedrag excl. BTW', 'BTW bedrag', 'Aftrekbare BTW']);

        ['nieuwbouw', 'verbouw', 'verduurzaming', 'overig'].forEach(function(pt) {
            var d = samenvatting.projectTypen[pt];
            if (!d || d.count === 0) return;
            rows.push([
                PROJECTTYPE_LABELS[pt] || pt,
                String(d.count),
                formatCSVBedrag(d.bedragExcl),
                formatCSVBedrag(d.btw),
                formatCSVBedrag(d.aftrekbareBTW)
            ]);
        });

        // Herzieningsoverzicht
        rows.push([]);
        rows.push(['Herzieningsoverzicht']);
        rows.push(['Type', 'Aantal regels', 'Bedrag excl. BTW', 'BTW', 'Aftrekbare BTW', 'Termijn (jaren)']);

        rows.push([
            'Onroerend goed',
            String(samenvatting.herziening.onroerend.regels),
            formatCSVBedrag(samenvatting.herziening.onroerend.bedragExcl),
            formatCSVBedrag(samenvatting.herziening.onroerend.btw),
            formatCSVBedrag(samenvatting.herziening.onroerend.aftrekbareBTW),
            '10'
        ]);

        rows.push([
            'Roerend goed',
            String(samenvatting.herziening.roerend.regels),
            formatCSVBedrag(samenvatting.herziening.roerend.bedragExcl),
            formatCSVBedrag(samenvatting.herziening.roerend.btw),
            formatCSVBedrag(samenvatting.herziening.roerend.aftrekbareBTW),
            '5'
        ]);

        // Herzieningsjaren onroerend
        if (samenvatting.herzieningsjaren.onroerend.length > 0) {
            rows.push([]);
            rows.push(['Herzieningsjaren - Onroerend goed (10 jaar)']);
            rows.push(['Jaar', 'Herzieningsjaar', 'BTW-fractie', 'Aftrekbaar', 'Niet-aftrekbaar']);

            samenvatting.herzieningsjaren.onroerend.forEach(function(j) {
                rows.push([
                    String(j.jaar),
                    String(j.herzieningsjaar),
                    formatCSVBedrag(j.btwFractie),
                    formatCSVBedrag(j.aftrekbareFractie),
                    formatCSVBedrag(j.nietAftrekbareFractie)
                ]);
            });
        }

        // Herzieningsjaren roerend
        if (samenvatting.herzieningsjaren.roerend.length > 0) {
            rows.push([]);
            rows.push(['Herzieningsjaren - Roerend goed (5 jaar)']);
            rows.push(['Jaar', 'Herzieningsjaar', 'BTW-fractie', 'Aftrekbaar', 'Niet-aftrekbaar']);

            samenvatting.herzieningsjaren.roerend.forEach(function(j) {
                rows.push([
                    String(j.jaar),
                    String(j.herzieningsjaar),
                    formatCSVBedrag(j.btwFractie),
                    formatCSVBedrag(j.aftrekbareFractie),
                    formatCSVBedrag(j.nietAftrekbareFractie)
                ]);
            });
        }

        // Openstaande vragen
        var openVragen = samenvatting.openVragen;
        if (openVragen > 0) {
            rows.push([]);
            rows.push(['Let op: ' + openVragen + ' openstaande vragen - beoordeling is niet volledig.']);
        }

        return U.arrayToCSV(rows);
    }

    // =========================================================================
    // Hulpfuncties
    // =========================================================================

    /**
     * Formatteert een bedrag voor CSV (Nederlands formaat met komma als decimaalteken).
     */
    function formatCSVBedrag(bedrag) {
        if (bedrag == null || isNaN(bedrag)) return '0,00';
        return String(Number(bedrag).toFixed(2)).replace('.', ',');
    }

    // =========================================================================
    // Publieke API
    // =========================================================================
    return {
        genereerFiscaalRapport: genereerFiscaalRapport,
        exporteerInvesteringenCSV: exporteerInvesteringenCSV,
        exporteerSamenvattingCSV: exporteerSamenvattingCSV,

        // Backwards-compatible aliassen (gebruikt door app.js)
        generateFiscalReport: genereerFiscaalRapport,
        exportMutationsCSV: exporteerInvesteringenCSV,
        exportSummaryCSV: exporteerSamenvattingCSV
    };
})();
