(function () {
    'use strict';

    var DRUGS = {
        enrofloxacin: {
            label: 'Enrofloxacin',
            normal: 'q24h',
            mild: 'q24h',
            moderate: 'q24-36h',
            severe: 'q48h / consider alternative',
            caution: 'Monitor neurologic status and hydration; reassess if appetite declines.'
        },
        amoxicillin: {
            label: 'Amoxicillin',
            normal: 'q12h',
            mild: 'q12h',
            moderate: 'q12-24h',
            severe: 'q24h',
            caution: 'Adjust with serial renal values and hydration status.'
        },
        famotidine: {
            label: 'Famotidine',
            normal: 'q12h',
            mild: 'q24h',
            moderate: 'q24h',
            severe: 'q24-48h',
            caution: 'Dose interval extension is preferred over dose stacking in severe azotemia.'
        },
        gabapentin: {
            label: 'Gabapentin',
            normal: 'q8-12h',
            mild: 'q12h',
            moderate: 'q12-24h',
            severe: 'q24h',
            caution: 'Sedation risk rises with renal compromise; start lower and titrate carefully.'
        },
        metronidazole: {
            label: 'Metronidazole',
            normal: 'q12h',
            mild: 'q12h',
            moderate: 'q12-24h',
            severe: 'q24h / lower dose',
            caution: 'Watch for neurotoxicity in prolonged use or advanced disease.'
        }
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function setText(id, text) {
        var node = byId(id);
        if (node) {
            node.textContent = text;
        }
    }

    function render(event) {
        if (event) {
            event.preventDefault();
        }

        var stageNode = byId('rda-stage');
        var drugNode = byId('rda-drug');
        var stage = stageNode ? String(stageNode.value || 'mild') : 'mild';
        var drugKey = drugNode ? String(drugNode.value || 'enrofloxacin') : 'enrofloxacin';
        var drug = DRUGS[drugKey];

        if (!drug || !drug[stage]) {
            setText('rda-note', 'Select a valid drug and renal stage.');
            return;
        }

        setText('rda-drug-name', drug.label);
        setText('rda-normal', drug.normal);
        setText('rda-adjusted', drug[stage]);
        setText('rda-caution', drug.caution);
        setText('rda-note', 'Educational interval-support output. Confirm final dosing with clinician-approved formulary and patient trends.');
    }

    function init() {
        var form = byId('rda-form');
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
