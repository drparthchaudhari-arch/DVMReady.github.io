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

    function calculate(event) {
        event.preventDefault();

        var weight = toNumber(document.getElementById('icp-weight').value);
        var dose = toNumber(document.getElementById('icp-dose').value);
        var bagVolume = toNumber(document.getElementById('icp-bag-volume').value);
        var insulinUnits = toNumber(document.getElementById('icp-insulin-units').value);
        var bg = toNumber(document.getElementById('icp-bg').value);

        if (!Number.isFinite(weight) || weight <= 0 ||
            !Number.isFinite(dose) || dose <= 0 ||
            !Number.isFinite(bagVolume) || bagVolume <= 0 ||
            !Number.isFinite(insulinUnits) || insulinUnits <= 0) {
            setText('icp-note', 'Enter valid positive values for weight, dose, bag volume, and insulin units.');
            return;
        }

        var concentration = insulinUnits / bagVolume;
        var requiredUnitsPerHour = weight * dose;
        var infusionRateMlHr = requiredUnitsPerHour / concentration;
        var dextroseLow = requiredUnitsPerHour * 1;
        var dextroseHigh = requiredUnitsPerHour * 2;

        setText('icp-conc', format(concentration, 4, ' U/mL'));
        setText('icp-uhr', format(requiredUnitsPerHour, 3, ' U/hr'));
        setText('icp-rate', format(infusionRateMlHr, 2, ' mL/hr'));
        setText('icp-dextrose', format(dextroseLow, 1, '') + ' - ' + format(dextroseHigh, 1, ' g/hr'));

        var notes = [];
        if (Number.isFinite(bg)) {
            if (bg < 150) {
                notes.push('BG is already low; hold or reduce insulin and increase dextrose support per clinician protocol.');
            } else if (bg < 250) {
                notes.push('BG is near transition range; continue insulin but add dextrose support and monitor closely.');
            } else {
                notes.push('BG remains elevated; continue scheduled reassessment while titrating CRI.');
            }
        }

        if (requiredUnitsPerHour > 2) {
            notes.push('High hourly insulin exposure: verify dilution math and pump programming with a second check.');
        }

        notes.push('Recheck BG/electrolytes every 2-4 hours and adjust CRI/dextrose together.');
        setText('icp-note', notes.join(' '));
    }

    function init() {
        var form = document.getElementById('icp-form');
        if (!form) {
            return;
        }
        form.addEventListener('submit', calculate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
