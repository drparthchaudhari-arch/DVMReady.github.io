(function () {
    'use strict';

    function toNumber(value) {
        var parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    function format(value, digits, suffix) {
        if (!Number.isFinite(value)) {
            return '-';
        }
        return value.toFixed(digits) + (suffix || '');
    }

    function setText(id, text) {
        var node = document.getElementById(id);
        if (node) {
            node.textContent = text;
        }
    }

    function render(event) {
        if (event) {
            event.preventDefault();
        }

        var weight = toNumber(document.getElementById('erp-weight').value);
        var currentK = toNumber(document.getElementById('erp-current-k').value);
        var targetK = toNumber(document.getElementById('erp-target-k').value);
        var fluidRate = toNumber(document.getElementById('erp-fluid-rate').value);

        if (!Number.isFinite(weight) || weight <= 0 ||
            !Number.isFinite(currentK) || !Number.isFinite(targetK) ||
            !Number.isFinite(fluidRate) || fluidRate <= 0) {
            setText('erp-note', 'Enter valid weight, potassium values, and fluid rate.');
            return;
        }

        var deficit = Math.max(0, targetK - currentK);
        var suggestedAdditive = Math.min(80, Math.max(20, deficit * 20));
        var hourlyLoad = (suggestedAdditive / 1000) * fluidRate;
        var maxSafe = 0.5 * weight;

        setText('erp-deficit', format(deficit, 2, ' mEq/L gap'));
        setText('erp-additive', format(suggestedAdditive, 0, ' mEq/L in fluids'));
        setText('erp-hourly', format(hourlyLoad, 2, ' mEq/hr delivered'));

        var note = 'Check serum potassium every 4-6 hours during active correction.';
        if (hourlyLoad > maxSafe) {
            note += ' Estimated rate exceeds 0.5 mEq/kg/hr threshold; reduce additive or fluid rate.';
        }
        setText('erp-note', note);
    }

    function init() {
        var form = document.getElementById('erp-form');
        if (!form) {
            return;
        }
        form.addEventListener('submit', render);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
