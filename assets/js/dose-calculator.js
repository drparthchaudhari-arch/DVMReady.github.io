(function () {
    'use strict';

    var DRUGS = [
        { id: 'furosemide', name: 'Furosemide', dog: { doseMgKg: 2, dosesPerDay: 3, maxDailyMgKg: 12 }, cat: { doseMgKg: 1, dosesPerDay: 2, maxDailyMgKg: 6 } },
        { id: 'carprofen', name: 'Carprofen', dog: { doseMgKg: 2.2, dosesPerDay: 2, maxDailyMgKg: 4.4 }, cat: null },
        { id: 'meloxicam', name: 'Meloxicam', dog: { doseMgKg: 0.1, dosesPerDay: 1, maxDailyMgKg: 0.1 }, cat: { doseMgKg: 0.05, dosesPerDay: 1, maxDailyMgKg: 0.05 } },
        { id: 'enrofloxacin', name: 'Enrofloxacin', dog: { doseMgKg: 10, dosesPerDay: 1, maxDailyMgKg: 20 }, cat: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 5 } },
        { id: 'amoxicillin', name: 'Amoxicillin', dog: { doseMgKg: 11, dosesPerDay: 2, maxDailyMgKg: 30 }, cat: { doseMgKg: 11, dosesPerDay: 2, maxDailyMgKg: 30 } },
        { id: 'amoxclav', name: 'Amoxicillin-Clavulanate', dog: { doseMgKg: 13.75, dosesPerDay: 2, maxDailyMgKg: 30 }, cat: { doseMgKg: 12.5, dosesPerDay: 2, maxDailyMgKg: 30 } },
        { id: 'cephalexin', name: 'Cephalexin', dog: { doseMgKg: 22, dosesPerDay: 2, maxDailyMgKg: 60 }, cat: { doseMgKg: 22, dosesPerDay: 2, maxDailyMgKg: 60 } },
        { id: 'clindamycin', name: 'Clindamycin', dog: { doseMgKg: 11, dosesPerDay: 2, maxDailyMgKg: 33 }, cat: { doseMgKg: 11, dosesPerDay: 2, maxDailyMgKg: 33 } },
        { id: 'doxycycline', name: 'Doxycycline', dog: { doseMgKg: 5, dosesPerDay: 2, maxDailyMgKg: 10 }, cat: { doseMgKg: 5, dosesPerDay: 2, maxDailyMgKg: 10 } },
        { id: 'metronidazole', name: 'Metronidazole', dog: { doseMgKg: 12.5, dosesPerDay: 2, maxDailyMgKg: 50 }, cat: { doseMgKg: 10, dosesPerDay: 2, maxDailyMgKg: 40 } },
        { id: 'maropitant', name: 'Maropitant', dog: { doseMgKg: 2, dosesPerDay: 1, maxDailyMgKg: 2 }, cat: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 2 } },
        { id: 'ondansetron', name: 'Ondansetron', dog: { doseMgKg: 0.5, dosesPerDay: 2, maxDailyMgKg: 2 }, cat: { doseMgKg: 0.5, dosesPerDay: 2, maxDailyMgKg: 2 } },
        { id: 'famotidine', name: 'Famotidine', dog: { doseMgKg: 0.5, dosesPerDay: 2, maxDailyMgKg: 1.5 }, cat: { doseMgKg: 0.5, dosesPerDay: 1, maxDailyMgKg: 1 } },
        { id: 'omeprazole', name: 'Omeprazole', dog: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 2 }, cat: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 2 } },
        { id: 'gabapentin', name: 'Gabapentin', dog: { doseMgKg: 10, dosesPerDay: 3, maxDailyMgKg: 60 }, cat: { doseMgKg: 10, dosesPerDay: 2, maxDailyMgKg: 30 } },
        { id: 'tramadol', name: 'Tramadol', dog: { doseMgKg: 4, dosesPerDay: 3, maxDailyMgKg: 20 }, cat: { doseMgKg: 2, dosesPerDay: 2, maxDailyMgKg: 8 } },
        { id: 'trazodone', name: 'Trazodone', dog: { doseMgKg: 5, dosesPerDay: 2, maxDailyMgKg: 15 }, cat: { doseMgKg: 2, dosesPerDay: 1, maxDailyMgKg: 5 } },
        { id: 'prednisone', name: 'Prednisone', dog: { doseMgKg: 0.5, dosesPerDay: 1, maxDailyMgKg: 2 }, cat: null },
        { id: 'prednisolone', name: 'Prednisolone', dog: { doseMgKg: 0.5, dosesPerDay: 1, maxDailyMgKg: 2 }, cat: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 4 } },
        { id: 'dexamethasone', name: 'Dexamethasone', dog: { doseMgKg: 0.1, dosesPerDay: 1, maxDailyMgKg: 0.5 }, cat: { doseMgKg: 0.1, dosesPerDay: 1, maxDailyMgKg: 0.4 } },
        { id: 'amlodipine', name: 'Amlodipine', dog: { doseMgKg: 0.15, dosesPerDay: 1, maxDailyMgKg: 0.5 }, cat: { doseMgKg: 0.15, dosesPerDay: 1, maxDailyMgKg: 0.5 } },
        { id: 'atenolol', name: 'Atenolol', dog: { doseMgKg: 0.5, dosesPerDay: 2, maxDailyMgKg: 2 }, cat: { doseMgKg: 1, dosesPerDay: 2, maxDailyMgKg: 2 } },
        { id: 'pimobendan', name: 'Pimobendan', dog: { doseMgKg: 0.25, dosesPerDay: 2, maxDailyMgKg: 0.6 }, cat: { doseMgKg: 0.25, dosesPerDay: 2, maxDailyMgKg: 0.6 } },
        { id: 'benazepril', name: 'Benazepril', dog: { doseMgKg: 0.5, dosesPerDay: 1, maxDailyMgKg: 1 }, cat: { doseMgKg: 0.5, dosesPerDay: 1, maxDailyMgKg: 1 } },
        { id: 'enalapril', name: 'Enalapril', dog: { doseMgKg: 0.5, dosesPerDay: 2, maxDailyMgKg: 1 }, cat: { doseMgKg: 0.25, dosesPerDay: 1, maxDailyMgKg: 0.5 } },
        { id: 'spironolactone', name: 'Spironolactone', dog: { doseMgKg: 2, dosesPerDay: 1, maxDailyMgKg: 4 }, cat: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 3 } },
        { id: 'phenobarbital', name: 'Phenobarbital', dog: { doseMgKg: 2.5, dosesPerDay: 2, maxDailyMgKg: 10 }, cat: { doseMgKg: 2, dosesPerDay: 2, maxDailyMgKg: 8 } },
        { id: 'levetiracetam', name: 'Levetiracetam', dog: { doseMgKg: 20, dosesPerDay: 3, maxDailyMgKg: 60 }, cat: { doseMgKg: 20, dosesPerDay: 3, maxDailyMgKg: 60 } },
        { id: 'clopidogrel', name: 'Clopidogrel', dog: { doseMgKg: 2, dosesPerDay: 1, maxDailyMgKg: 4 }, cat: { doseMgKg: 4, dosesPerDay: 1, maxDailyMgKg: 8 } },
        { id: 'aspirin', name: 'Aspirin', dog: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 10 }, cat: { doseMgKg: 5, dosesPerDay: 0.33, maxDailyMgKg: 6 } },
        { id: 'methimazole', name: 'Methimazole', dog: { doseMgKg: 2.5, dosesPerDay: 2, maxDailyMgKg: 10 }, cat: { doseMgKg: 2.5, dosesPerDay: 2, maxDailyMgKg: 10 } },
        { id: 'levothyroxine', name: 'Levothyroxine', dog: { doseMgKg: 0.02, dosesPerDay: 2, maxDailyMgKg: 0.08 }, cat: { doseMgKg: 0.1, dosesPerDay: 1, maxDailyMgKg: 0.2 } },
        { id: 'potassium-bromide', name: 'Potassium Bromide', dog: { doseMgKg: 30, dosesPerDay: 1, maxDailyMgKg: 60 }, cat: null },
        { id: 'azithromycin', name: 'Azithromycin', dog: { doseMgKg: 10, dosesPerDay: 1, maxDailyMgKg: 20 }, cat: { doseMgKg: 10, dosesPerDay: 1, maxDailyMgKg: 20 } },
        { id: 'ciprofloxacin', name: 'Ciprofloxacin', dog: { doseMgKg: 15, dosesPerDay: 1, maxDailyMgKg: 30 }, cat: { doseMgKg: 10, dosesPerDay: 1, maxDailyMgKg: 20 } },
        { id: 'orbifloxacin', name: 'Orbifloxacin', dog: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 10 }, cat: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 10 } },
        { id: 'cefpodoxime', name: 'Cefpodoxime', dog: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 10 }, cat: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 10 } },
        { id: 'cefovecin', name: 'Cefovecin', dog: { doseMgKg: 8, dosesPerDay: 0.07, maxDailyMgKg: 12 }, cat: { doseMgKg: 8, dosesPerDay: 0.07, maxDailyMgKg: 12 } },
        { id: 'trimethoprim-sulfa', name: 'Trimethoprim-Sulfa', dog: { doseMgKg: 15, dosesPerDay: 2, maxDailyMgKg: 30 }, cat: { doseMgKg: 15, dosesPerDay: 2, maxDailyMgKg: 30 } },
        { id: 'mirtazapine', name: 'Mirtazapine', dog: { doseMgKg: 1.5, dosesPerDay: 1, maxDailyMgKg: 3 }, cat: { doseMgKg: 1, dosesPerDay: 1, maxDailyMgKg: 2 } },
        { id: 'cyproheptadine', name: 'Cyproheptadine', dog: { doseMgKg: 0.2, dosesPerDay: 2, maxDailyMgKg: 1 }, cat: { doseMgKg: 1, dosesPerDay: 2, maxDailyMgKg: 2 } },
        { id: 'buprenorphine', name: 'Buprenorphine', dog: { doseMgKg: 0.02, dosesPerDay: 3, maxDailyMgKg: 0.08 }, cat: { doseMgKg: 0.02, dosesPerDay: 3, maxDailyMgKg: 0.08 } },
        { id: 'butorphanol', name: 'Butorphanol', dog: { doseMgKg: 0.3, dosesPerDay: 4, maxDailyMgKg: 1.2 }, cat: { doseMgKg: 0.2, dosesPerDay: 4, maxDailyMgKg: 0.8 } },
        { id: 'acepromazine', name: 'Acepromazine', dog: { doseMgKg: 0.03, dosesPerDay: 3, maxDailyMgKg: 0.1 }, cat: { doseMgKg: 0.02, dosesPerDay: 3, maxDailyMgKg: 0.08 } },
        { id: 'dexmedetomidine', name: 'Dexmedetomidine', dog: { doseMgKg: 0.005, dosesPerDay: 3, maxDailyMgKg: 0.015 }, cat: { doseMgKg: 0.005, dosesPerDay: 3, maxDailyMgKg: 0.015 } },
        { id: 'ketamine', name: 'Ketamine', dog: { doseMgKg: 5, dosesPerDay: 3, maxDailyMgKg: 15 }, cat: { doseMgKg: 5, dosesPerDay: 3, maxDailyMgKg: 15 } },
        { id: 'midazolam', name: 'Midazolam', dog: { doseMgKg: 0.2, dosesPerDay: 3, maxDailyMgKg: 0.6 }, cat: { doseMgKg: 0.2, dosesPerDay: 3, maxDailyMgKg: 0.6 } },
        { id: 'diazepam', name: 'Diazepam', dog: { doseMgKg: 0.5, dosesPerDay: 3, maxDailyMgKg: 2 }, cat: { doseMgKg: 0.5, dosesPerDay: 3, maxDailyMgKg: 2 } },
        { id: 'methocarbamol', name: 'Methocarbamol', dog: { doseMgKg: 20, dosesPerDay: 3, maxDailyMgKg: 180 }, cat: { doseMgKg: 20, dosesPerDay: 3, maxDailyMgKg: 180 } },
        { id: 'fluconazole', name: 'Fluconazole', dog: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 20 }, cat: { doseMgKg: 5, dosesPerDay: 1, maxDailyMgKg: 20 } }
    ];

    var state = {
        drugMap: {},
        lastCopyText: ''
    };

    function toNumber(value) {
        var parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    function formatNumber(value, digits) {
        if (!Number.isFinite(value)) {
            return '-';
        }
        return value.toFixed(digits);
    }

    function formatFrequency(perDay) {
        if (perDay >= 1) {
            var hours = Math.round(24 / perDay);
            return 'q' + hours + 'h';
        }
        var intervalDays = Math.round(1 / perDay);
        return 'every ' + intervalDays + ' days';
    }

    function getSupportedDrugs(species) {
        return DRUGS.filter(function (drug) {
            return !!drug[species];
        });
    }

    function findDrugById(id) {
        return state.drugMap[id] || null;
    }

    function populateDrugSelect(species) {
        var select = document.getElementById('dose-drug');
        if (!select) {
            return;
        }

        var supported = getSupportedDrugs(species);
        select.innerHTML = '';

        for (var i = 0; i < supported.length; i += 1) {
            var option = document.createElement('option');
            option.value = supported[i].id;
            option.textContent = supported[i].name;
            select.appendChild(option);
        }
    }

    function setWarning(message, type) {
        var warningNode = document.getElementById('dose-warning');
        if (!warningNode) {
            return;
        }

        if (!message) {
            warningNode.hidden = true;
            warningNode.textContent = '';
            warningNode.classList.remove('pc-calculator-warning--danger');
            warningNode.classList.remove('pc-calculator-warning--caution');
            return;
        }

        warningNode.hidden = false;
        warningNode.textContent = message;
        warningNode.classList.toggle('pc-calculator-warning--danger', type === 'danger');
        warningNode.classList.toggle('pc-calculator-warning--caution', type === 'caution');
    }

    function setResultText(id, text) {
        var node = document.getElementById(id);
        if (node) {
            node.textContent = text;
        }
    }

    function buildCopyText(payload) {
        return [
            'Dose Calculator Result',
            'Species: ' + payload.species,
            'Drug: ' + payload.drug,
            'Weight: ' + formatNumber(payload.weight, 2) + ' kg',
            'Dose: ' + formatNumber(payload.doseMgKg, 2) + ' mg/kg (' + payload.frequencyLabel + ')',
            'Concentration: ' + formatNumber(payload.concentration, 2) + ' mg/mL',
            'mg per dose: ' + formatNumber(payload.mgPerDose, 2),
            'mL per dose: ' + formatNumber(payload.mlPerDose, 2),
            'Total daily mg: ' + formatNumber(payload.totalDailyMg, 2)
        ].join('\n');
    }

    function fallbackCopy(text) {
        var helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', 'readonly');
        helper.style.position = 'absolute';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
    }

    function copyResult() {
        if (!state.lastCopyText) {
            setWarning('Run a calculation first before copying.', 'caution');
            return;
        }

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(state.lastCopyText).then(function () {
                setWarning('Copied result to clipboard.', 'caution');
            }).catch(function () {
                fallbackCopy(state.lastCopyText);
                setWarning('Copied result to clipboard.', 'caution');
            });
            return;
        }

        fallbackCopy(state.lastCopyText);
        setWarning('Copied result to clipboard.', 'caution');
    }

    function calculate(event) {
        event.preventDefault();

        var speciesNode = document.getElementById('dose-species');
        var weightNode = document.getElementById('dose-weight');
        var drugNode = document.getElementById('dose-drug');
        var concentrationNode = document.getElementById('dose-concentration');
        var metaNode = document.getElementById('dose-meta');

        var species = speciesNode ? String(speciesNode.value || 'dog') : 'dog';
        var weight = toNumber(weightNode ? weightNode.value : '');
        var concentration = toNumber(concentrationNode ? concentrationNode.value : '');
        var drug = findDrugById(drugNode ? drugNode.value : '');

        if (!Number.isFinite(weight) || weight <= 0) {
            setWarning('Enter a valid weight in kg.', 'danger');
            return;
        }

        if (!Number.isFinite(concentration) || concentration <= 0) {
            setWarning('Enter a valid concentration in mg/mL.', 'danger');
            return;
        }

        if (!drug || !drug[species]) {
            setWarning('This drug is not configured for the selected species.', 'danger');
            return;
        }

        var regimen = drug[species];
        var mgPerDose = weight * regimen.doseMgKg;
        var mlPerDose = mgPerDose / concentration;
        var totalDailyMg = mgPerDose * regimen.dosesPerDay;
        var totalDailyMgKg = totalDailyMg / weight;

        setResultText('dose-mg', formatNumber(mgPerDose, 2) + ' mg');
        setResultText('dose-ml', formatNumber(mlPerDose, 2) + ' mL');
        setResultText('dose-daily', formatNumber(totalDailyMg, 2) + ' mg/day');

        if (metaNode) {
            metaNode.textContent =
                drug.name + ' default: ' + formatNumber(regimen.doseMgKg, 2) + ' mg/kg ' + formatFrequency(regimen.dosesPerDay) +
                '. Daily exposure: ' + formatNumber(totalDailyMgKg, 2) + ' mg/kg/day.';
        }

        if (regimen.maxDailyMgKg && totalDailyMgKg > regimen.maxDailyMgKg) {
            setWarning('Warning: estimated daily dose is above max (' + formatNumber(regimen.maxDailyMgKg, 2) + ' mg/kg/day).', 'danger');
        } else if (regimen.maxDailyMgKg && totalDailyMgKg >= regimen.maxDailyMgKg * 0.9) {
            setWarning('Caution: estimated daily dose is close to max (' + formatNumber(regimen.maxDailyMgKg, 2) + ' mg/kg/day).', 'caution');
        } else {
            setWarning('', '');
        }

        state.lastCopyText = buildCopyText({
            species: species,
            drug: drug.name,
            weight: weight,
            doseMgKg: regimen.doseMgKg,
            frequencyLabel: formatFrequency(regimen.dosesPerDay),
            concentration: concentration,
            mgPerDose: mgPerDose,
            mlPerDose: mlPerDose,
            totalDailyMg: totalDailyMg
        });
    }

    function handleSpeciesChange() {
        var speciesNode = document.getElementById('dose-species');
        if (!speciesNode) {
            return;
        }
        populateDrugSelect(String(speciesNode.value || 'dog'));
    }

    function indexDrugs() {
        for (var i = 0; i < DRUGS.length; i += 1) {
            state.drugMap[DRUGS[i].id] = DRUGS[i];
        }
    }

    function init() {
        var form = document.getElementById('dose-form');
        var speciesNode = document.getElementById('dose-species');
        var copyButton = document.getElementById('dose-copy');

        if (!form || !speciesNode) {
            return;
        }

        indexDrugs();
        populateDrugSelect(String(speciesNode.value || 'dog'));

        form.addEventListener('submit', calculate);
        speciesNode.addEventListener('change', handleSpeciesChange);

        if (copyButton) {
            copyButton.addEventListener('click', copyResult);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
