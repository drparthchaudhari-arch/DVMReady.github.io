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

        var weight = toNumber(document.getElementById('sbp-weight').value);
        var lactate = toNumber(document.getElementById('sbp-lactate').value);
        var map = toNumber(document.getElementById('sbp-map').value);

        if (!Number.isFinite(weight) || weight <= 0) {
            setText('sbp-note', 'Enter a valid patient weight.');
            return;
        }

        var bolusLow = weight * 10;
        var bolusHigh = weight * 20;
        var reassessWindow = 15;

        setText('sbp-fluid', format(bolusLow, 0, '') + ' - ' + format(bolusHigh, 0, ' mL crystalloid'));
        setText('sbp-reassess', reassessWindow + ' min reassessment cycle');

        var perfusionFlags = [];
        if (Number.isFinite(lactate) && lactate >= 4) {
            perfusionFlags.push('Lactate suggests severe perfusion deficit.');
        }
        if (Number.isFinite(map) && map < 60) {
            perfusionFlags.push('MAP is low; vasopressor planning may be needed if fluid response is limited.');
        }
        if (!perfusionFlags.length) {
            perfusionFlags.push('Use perfusion trend (mentation, pulse quality, lactate, urine output) to drive next step.');
        }

        setText('sbp-antimicrobials', 'Collect samples quickly, then begin broad-spectrum antimicrobial coverage within the first hour.');
        setText('sbp-source', 'Define likely source early (abdomen, urinary, respiratory, wound, line-related) and plan source control.');
        setText('sbp-note', perfusionFlags.join(' '));
    }

    function init() {
        var form = document.getElementById('sbp-form');
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
