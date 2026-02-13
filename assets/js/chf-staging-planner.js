(function () {
    'use strict';

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

        var clinicalSigns = document.getElementById('chf-signs').checked;
        var edema = document.getElementById('chf-edema').checked;
        var remodeling = document.getElementById('chf-remodeling').checked;

        var stage;
        var next;
        var recheck;

        if (clinicalSigns && edema) {
            stage = 'Likely CHF stage C pattern';
            next = 'Begin decongestive treatment pathway and monitor perfusion/renal trends closely.';
            recheck = 'Recheck in 3-7 days after stabilization, then stage-based follow-up.';
        } else if (remodeling && !clinicalSigns) {
            stage = 'Likely preclinical stage B2 pattern';
            next = 'Confirm imaging and risk profile; begin stage-appropriate medical management plan.';
            recheck = 'Recheck in 1-3 months with home respiratory trend tracking.';
        } else {
            stage = 'Likely early or indeterminate stage pattern';
            next = 'Correlate exam findings with imaging and blood pressure before changing chronic regimen.';
            recheck = 'Set follow-up based on symptom burden and progression risk.';
        }

        setText('chf-stage', stage);
        setText('chf-next', next);
        setText('chf-recheck', recheck);
        setText('chf-note', 'Educational staging support only. Final stage assignment requires full cardiology workup and clinician judgment.');
    }

    function init() {
        var form = document.getElementById('chf-form');
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
