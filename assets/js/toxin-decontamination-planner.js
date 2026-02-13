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

        var weight = toNumber(document.getElementById('tdp-weight').value);
        var hours = toNumber(document.getElementById('tdp-hours').value);
        var neuro = document.getElementById('tdp-neuro').checked;
        var corrosive = document.getElementById('tdp-corrosive').checked;
        var hydrocarbon = document.getElementById('tdp-hydrocarbon').checked;

        if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(hours) || hours < 0) {
            setText('tdp-note', 'Enter valid weight and time-since-ingestion values.');
            return;
        }

        var emesisEligible = hours <= 2 && !neuro && !corrosive && !hydrocarbon;
        var charcoalDose = weight * 1;
        var charcoalSlurry = charcoalDose * 5;

        setText('tdp-emesis', emesisEligible ? 'Potentially eligible for emesis (if clinician confirms).' : 'Emesis generally NOT recommended from this screen.');
        setText('tdp-charcoal', format(charcoalDose, 1, ' g activated charcoal'));
        setText('tdp-slurry', format(charcoalSlurry, 0, ' mL charcoal slurry (approx)'));

        var cautions = [];
        if (neuro) {
            cautions.push('Neurologic signs present: aspiration risk is high.');
        }
        if (corrosive) {
            cautions.push('Corrosive ingestion suspected: avoid emesis.');
        }
        if (hydrocarbon) {
            cautions.push('Hydrocarbon risk: avoid emesis due to aspiration potential.');
        }
        if (hours > 4) {
            cautions.push('Delayed presentation: prioritize monitoring and organ-supportive care pathway.');
        }

        setText('tdp-note', cautions.length ? cautions.join(' ') : 'Proceed with clinician-directed tox plan and serial monitoring.');
    }

    function init() {
        var form = document.getElementById('tdp-form');
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
