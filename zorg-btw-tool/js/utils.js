/* === Utilities === */
var App = window.App || {};

App.Utils = (function() {
    'use strict';

    function generateId() {
        return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    }

    function formatCurrency(amount) {
        if (amount == null || isNaN(amount)) return '€ 0,00';
        return '€ ' + Number(amount).toLocaleString('nl-NL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatNumber(num) {
        if (num == null || isNaN(num)) return '0';
        return Number(num).toLocaleString('nl-NL');
    }

    function formatPercentage(pct) {
        if (pct == null || isNaN(pct)) return '0%';
        return Number(pct).toLocaleString('nl-NL', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }) + '%';
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            var d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('nl-NL');
        } catch(e) {
            return dateStr;
        }
    }

    function parseAmount(str) {
        if (typeof str === 'number') return str;
        if (!str) return 0;
        str = String(str).trim();
        // Handle Dutch number format: 1.234,56
        // Check if it uses comma as decimal separator
        if (str.indexOf(',') > -1 && str.indexOf('.') > -1) {
            // Both present: 1.234,56 -> 1234.56
            str = str.replace(/\./g, '').replace(',', '.');
        } else if (str.indexOf(',') > -1) {
            // Only comma: could be 1234,56 or 1,234.00 (unlikely in NL)
            str = str.replace(',', '.');
        }
        var num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    }

    function parseDate(str) {
        if (!str) return '';
        str = String(str).trim();
        // Try DD-MM-YYYY format
        var match = str.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
        if (match) {
            return match[3] + '-' + match[2].padStart(2, '0') + '-' + match[1].padStart(2, '0');
        }
        // Try YYYY-MM-DD
        match = str.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
        if (match) {
            return match[1] + '-' + match[2].padStart(2, '0') + '-' + match[3].padStart(2, '0');
        }
        return str;
    }

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showToast(message, type) {
        type = type || 'info';
        var container = document.getElementById('toastContainer');
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

    function classificationLabel(cl) {
        var labels = {
            'aftrekbaar': 'Volledig aftrekbaar',
            'niet-aftrekbaar': 'Niet-aftrekbaar',
            'pro-rata': 'Pro rata',
            'pre-pro-rata': 'Pre-pro-rata',
            'onbeoordeeld': 'Onbeoordeeld'
        };
        return labels[cl] || cl || 'Onbeoordeeld';
    }

    function classificationBadge(cl) {
        cl = cl || 'onbeoordeeld';
        return '<span class="cl-badge cl-' + escapeHtml(cl) + '">' + escapeHtml(classificationLabel(cl)) + '</span>';
    }

    function statusLabel(st) {
        var labels = {
            'auto-classified': 'Automatisch',
            'needs-review': 'Beoordeling nodig',
            'reviewed': 'Beoordeeld',
            'approved': 'Goedgekeurd'
        };
        return labels[st] || st || '';
    }

    function statusBadge(st) {
        st = st || 'auto-classified';
        return '<span class="status-badge status-' + escapeHtml(st) + '">' + escapeHtml(statusLabel(st)) + '</span>';
    }

    function downloadCSV(data, filename) {
        var BOM = '\uFEFF';
        var blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function downloadJSON(data, filename) {
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function csvToArray(text, delimiter) {
        delimiter = delimiter || detectDelimiter(text);
        var rows = [];
        var row = [];
        var field = '';
        var inQuotes = false;

        for (var i = 0; i < text.length; i++) {
            var c = text[i];
            var next = text[i + 1];

            if (inQuotes) {
                if (c === '"' && next === '"') {
                    field += '"';
                    i++;
                } else if (c === '"') {
                    inQuotes = false;
                } else {
                    field += c;
                }
            } else {
                if (c === '"') {
                    inQuotes = true;
                } else if (c === delimiter) {
                    row.push(field.trim());
                    field = '';
                } else if (c === '\n' || (c === '\r' && next === '\n')) {
                    row.push(field.trim());
                    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
                        rows.push(row);
                    }
                    row = [];
                    field = '';
                    if (c === '\r') i++;
                } else {
                    field += c;
                }
            }
        }
        // Last field/row
        row.push(field.trim());
        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
            rows.push(row);
        }
        return rows;
    }

    function detectDelimiter(text) {
        var firstLine = text.split(/\r?\n/)[0] || '';
        var semicolons = (firstLine.match(/;/g) || []).length;
        var commas = (firstLine.match(/,/g) || []).length;
        var tabs = (firstLine.match(/\t/g) || []).length;
        if (tabs >= semicolons && tabs >= commas && tabs > 0) return '\t';
        if (semicolons >= commas) return ';';
        return ',';
    }

    function arrayToCSV(rows, delimiter) {
        delimiter = delimiter || ';';
        return rows.map(function(row) {
            return row.map(function(cell) {
                cell = String(cell == null ? '' : cell);
                if (cell.indexOf(delimiter) > -1 || cell.indexOf('"') > -1 || cell.indexOf('\n') > -1) {
                    return '"' + cell.replace(/"/g, '""') + '"';
                }
                return cell;
            }).join(delimiter);
        }).join('\n');
    }

    return {
        generateId: generateId,
        formatCurrency: formatCurrency,
        formatNumber: formatNumber,
        formatPercentage: formatPercentage,
        formatDate: formatDate,
        parseAmount: parseAmount,
        parseDate: parseDate,
        escapeHtml: escapeHtml,
        showToast: showToast,
        classificationLabel: classificationLabel,
        classificationBadge: classificationBadge,
        statusLabel: statusLabel,
        statusBadge: statusBadge,
        downloadCSV: downloadCSV,
        downloadJSON: downloadJSON,
        csvToArray: csvToArray,
        arrayToCSV: arrayToCSV,
        detectDelimiter: detectDelimiter
    };
})();
