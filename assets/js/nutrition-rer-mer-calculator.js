(function () {
    'use strict';

    var MER_FACTORS = {
        weight_loss: 1,
        maintenance_neutered: 1.6,
        maintenance_intact: 1.8,
        growth_puppy: 2.5,
        recovery: 1.3
    };

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

        var weight = toNumber(document.getElementById('nrm-weight').value);
        var plan = String(document.getElementById('nrm-plan').value || 'maintenance_neutered');
        var kcalPerCup = toNumber(document.getElementById('nrm-kcal-cup').value);

        if (!Number.isFinite(weight) || weight <= 0) {
            setText('nrm-note', 'Enter a valid body weight.');
            return;
        }

        var rer = 70 * Math.pow(weight, 0.75);
        var factor = MER_FACTORS[plan] || MER_FACTORS.maintenance_neutered;
        var mer = rer * factor;

        setText('nrm-rer', format(rer, 0, ' kcal/day'));
        setText('nrm-mer', format(mer, 0, ' kcal/day'));

        if (Number.isFinite(kcalPerCup) && kcalPerCup > 0) {
            var cups = mer / kcalPerCup;
            setText('nrm-cups', format(cups, 2, ' cups/day'));
        } else {
            setText('nrm-cups', '-');
        }

        setText('nrm-note', 'Use ideal body-weight targets and reassess body condition score every 2-4 weeks during plan adjustments.');
    }

    function init() {
        var form = document.getElementById('nrm-form');
        if (!form) {
            return;
        }
        form.addEventListener('submit', render);
        form.addEventListener('change', render);
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
