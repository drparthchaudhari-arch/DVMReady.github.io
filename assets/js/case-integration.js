(function () {
    'use strict';

    var CASE_CONFIG = {
        'dka-dog.html': {
            caseId: 'dka_canine_001',
            title: 'Canine Diabetic Ketoacidosis',
            patient: {
                species: 'canine',
                weightKg: 28,
                dehydrationPercent: 8
            },
            decisionPoints: [
                'Step 1: Confirm fluid deficit and first-hour fluid target.',
                'Step 2: Start insulin only after initial fluid stabilization.',
                'Step 3: Recheck BG and electrolytes every 2-4 hours.'
            ],
            tools: [
                {
                    id: 'fluid_calculator',
                    label: 'Fluid Calculator',
                    href: '/tools/fluid-calculator.html',
                    summary: 'Preloaded for this 28 kg patient with 8% dehydration.',
                    params: { weight: 28, dehydration: 8, maintenance: 60, auto: 1 }
                },
                {
                    id: 'insulin_cri',
                    label: 'Insulin CRI Planner',
                    href: '/tools/insulin-cri-planner.html',
                    summary: 'Prefilled insulin CRI baseline for DKA workflow.',
                    params: { weight: 28, dose: 0.08, bag: 250, units: 2.5, bg: 450, auto: 1 }
                },
                {
                    id: 'acid_base',
                    label: 'Acid-Base Electrolyte Tool',
                    href: '/tools/acid-base-electrolyte.html',
                    summary: 'Use this after initial stabilization to interpret derangements.',
                    params: {}
                },
                {
                    id: 'potassium_planner',
                    label: 'Electrolyte Replacement Planner',
                    href: '/tools/electrolyte-replacement-planner.html',
                    summary: 'Plan potassium/phosphorus support alongside insulin.',
                    params: {}
                }
            ],
            assessment: {
                passScorePercent: 80,
                items: [
                    {
                        id: 'fluid_deficit',
                        step: 1,
                        label: 'Fluid deficit',
                        prompt: 'Calculate dehydration deficit for a 28 kg dog at 8% dehydration.',
                        expected: 2.24,
                        tolerance: 0.1,
                        weight: 40,
                        unit: 'L',
                        triggerTool: 'fluid_calculator',
                        teachablePoint: 'Deficit (L) = body weight (kg) x dehydration fraction.'
                    },
                    {
                        id: 'insulin_rate',
                        step: 2,
                        label: 'Insulin infusion rate',
                        prompt: 'At 0.08 U/kg/hr for 28 kg, what is the required insulin rate?',
                        expected: 2.24,
                        tolerance: 0.1,
                        weight: 35,
                        unit: 'U/hr',
                        triggerTool: 'insulin_cri',
                        teachablePoint: 'Insulin starts after initial fluid stabilization in DKA.'
                    },
                    {
                        id: 'monitoring_frequency',
                        step: 3,
                        label: 'Monitoring interval',
                        prompt: 'Choose a typical early recheck interval for BG/electrolytes.',
                        expected: 3,
                        tolerance: 1,
                        weight: 25,
                        unit: 'hours',
                        triggerTool: 'potassium_planner',
                        teachablePoint: 'Frequent rechecks prevent iatrogenic shifts during stabilization.'
                    }
                ]
            }
        },
        'chf-dog.html': {
            caseId: 'chf_canine_001',
            title: 'Canine Congestive Heart Failure',
            patient: {
                species: 'canine',
                weightKg: 33
            },
            decisionPoints: [
                'Step 1: Confirm cardiogenic pattern versus primary respiratory disease.',
                'Step 2: Estimate immediate congestion severity and stage pattern.',
                'Step 3: Define recheck interval based on response and risk.'
            ],
            tools: [
                {
                    id: 'chf_stage',
                    label: 'CHF Staging Planner',
                    href: '/tools/chf-staging-planner.html',
                    summary: 'Preloaded with symptomatic CHF-compatible findings.',
                    params: { signs: 1, edema: 1, remodeling: 1, auto: 1 }
                },
                {
                    id: 'emergency_chart',
                    label: 'Emergency Drug Chart',
                    href: '/tools/emergency-drug-chart.html',
                    summary: 'Cardiopulmonary emergency references for clinic use.',
                    params: {}
                },
                {
                    id: 'sepsis_bundle',
                    label: 'Sepsis Bundle Planner',
                    href: '/tools/sepsis-bundle-planner.html',
                    summary: 'Rule-in/rule-out systemic instability in dyspneic patients.',
                    params: {}
                }
            ]
        },
        'feline-hyperthyroid.html': {
            caseId: 'hyperthyroid_feline_001',
            title: 'Feline Hyperthyroidism',
            patient: {
                species: 'feline',
                weightKg: 4.2
            },
            decisionPoints: [
                'Step 1: Confirm endocrine diagnosis and baseline risk profile.',
                'Step 2: Track body condition and nutritional recovery targets.',
                'Step 3: Monitor blood pressure and systemic consequences.'
            ],
            tools: [
                {
                    id: 'nutrition',
                    label: 'Nutrition RER/MER Calculator',
                    href: '/tools/nutrition-rer-mer-calculator.html',
                    summary: 'Estimate intake targets during endocrine stabilization.',
                    params: {}
                },
                {
                    id: 'normal_values',
                    label: 'Normal Lab Values',
                    href: '/reference/normal-values.html',
                    summary: 'Quick lab baseline context for interpretation.',
                    params: {}
                },
                {
                    id: 'topic_guide',
                    label: 'Hypertension Target Organ Damage Guide',
                    href: '/systemic-hypertension-target-organ-damage/',
                    summary: 'Case-linked study guide for cardiovascular complications.',
                    params: {}
                }
            ]
        },
        'bovine-mastitis.html': {
            caseId: 'mastitis_bovine_001',
            title: 'Bovine Clinical Mastitis',
            patient: {
                species: 'bovine'
            },
            decisionPoints: [
                'Step 1: Confirm quarter-level diagnosis and severity.',
                'Step 2: Collect sterile milk sample before final antimicrobial choice.',
                'Step 3: Align individual treatment with herd-level prevention.'
            ],
            tools: [
                {
                    id: 'unit_converter',
                    label: 'Unit Converter',
                    href: '/tools/unit-converter.html',
                    summary: 'Convert concentrations and dosing units rapidly.',
                    params: {}
                },
                {
                    id: 'discharge',
                    label: 'Discharge Generator',
                    href: '/tools/discharge-generator.html',
                    summary: 'Create owner communication and follow-up structure.',
                    params: {}
                },
                {
                    id: 'lab_protocols',
                    label: 'Lab Interpretation Caveats',
                    href: '/lab-interpretation-caveats/',
                    summary: 'Reference interpretation pitfalls while awaiting culture data.',
                    params: {}
                }
            ]
        }
    };

    function getPageKey() {
        var path = window.location.pathname || '';
        var parts = path.split('/');
        return parts.length ? parts[parts.length - 1] : '';
    }

    function getConfig() {
        return CASE_CONFIG[getPageKey()] || null;
    }

    function toNumber(value) {
        var parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    function renderStats(encounterId, node) {
        if (!node || !window.pcIntegration || typeof window.pcIntegration.getEncounter !== 'function') {
            return;
        }

        var encounter = window.pcIntegration.getEncounter(encounterId);
        if (!encounter) {
            node.textContent = 'Encounter not found.';
            return;
        }

        var calcCount = Array.isArray(encounter.calculations) ? encounter.calculations.length : 0;
        var eventCount = Array.isArray(encounter.events) ? encounter.events.length : 0;
        node.textContent = 'Encounter log: ' + calcCount + ' calculations and ' + eventCount + ' timeline events captured.';
    }

    function getToolById(config, toolId) {
        if (!config || !Array.isArray(config.tools) || !toolId) {
            return null;
        }

        var normalized = String(toolId);
        var i;
        for (i = 0; i < config.tools.length; i += 1) {
            if (config.tools[i] && config.tools[i].id === normalized) {
                return config.tools[i];
            }
        }

        return null;
    }

    function getToolHref(config, encounter, toolId) {
        var tool = getToolById(config, toolId);
        if (!tool) {
            return '';
        }

        if (window.pcIntegration && typeof window.pcIntegration.buildPrefillUrl === 'function') {
            return window.pcIntegration.buildPrefillUrl(tool.href, tool.params || {}, {
                caseId: config.caseId,
                encounterId: encounter.id
            });
        }

        return tool.href;
    }

    function calculateAssessmentScore(items, answers) {
        var rubricItems = Array.isArray(items) ? items : [];
        var answerMap = answers && typeof answers === 'object' ? answers : {};
        var weightedTotal = 0;
        var weightedEarned = 0;
        var completedSteps = 0;
        var i;

        for (i = 0; i < rubricItems.length; i += 1) {
            var item = rubricItems[i];
            var weight = Number.isFinite(Number(item.weight)) ? Number(item.weight) : 0;
            weightedTotal += weight;

            if (!answerMap[item.id]) {
                continue;
            }

            completedSteps += 1;
            if (answerMap[item.id].isCorrect) {
                weightedEarned += weight;
            }
        }

        var percent = weightedTotal > 0 ? Math.round((weightedEarned / weightedTotal) * 100) : 0;
        return {
            earned: weightedEarned,
            total: weightedTotal,
            percent: percent,
            completed: completedSteps,
            stepCount: rubricItems.length
        };
    }

    function createAssessmentCard(config, encounter, onScoreUpdate) {
        var assessment = config && config.assessment && typeof config.assessment === 'object' ? config.assessment : null;
        var items = assessment && Array.isArray(assessment.items) ? assessment.items : [];

        if (!items.length) {
            return null;
        }

        var passScore = Number.isFinite(Number(assessment.passScorePercent)) ? Number(assessment.passScorePercent) : 80;
        var answers = {};

        var card = document.createElement('article');
        card.className = 'pc-tool-module pc-case-assessment';
        card.innerHTML = '<h3>Teachable Moment Skill Check</h3>';

        var intro = document.createElement('p');
        intro.className = 'pc-case-intel__summary';
        intro.textContent = 'Validate each step in sequence. A step unlocks when the answer is within tolerance.';
        card.appendChild(intro);

        var status = document.createElement('p');
        status.className = 'pc-case-assessment__score';
        card.appendChild(status);

        var stepsWrap = document.createElement('div');
        stepsWrap.className = 'pc-case-assessment__steps';
        card.appendChild(stepsWrap);

        function updateStatus(lastAttempt) {
            var score = calculateAssessmentScore(items, answers);
            var passState = score.percent >= passScore ? 'Pass' : 'In progress';
            var suffix = '';

            if (score.completed === score.stepCount) {
                passState = score.percent >= passScore ? 'Pass' : 'Needs review';
            }

            if (lastAttempt && lastAttempt.id) {
                suffix = ' | Last step: ' + lastAttempt.id + ' (' + (lastAttempt.isCorrect ? 'correct' : 'retry') + ')';
            }

            status.textContent =
                'Score: ' + score.percent + '% (' + score.earned + '/' + score.total + ' weighted points) | ' +
                score.completed + '/' + score.stepCount + ' steps attempted | ' +
                passState + suffix;

            status.classList.remove('pc-case-assessment__score--pass');
            status.classList.remove('pc-case-assessment__score--review');
            if (score.percent >= passScore) {
                status.classList.add('pc-case-assessment__score--pass');
            } else if (score.completed === score.stepCount) {
                status.classList.add('pc-case-assessment__score--review');
            }

            if (typeof onScoreUpdate === 'function') {
                onScoreUpdate(score);
            }
        }

        function setLocked(row, isLocked) {
            var input = row.querySelector('input');
            var button = row.querySelector('button');
            row.classList.toggle('pc-case-step--locked', !!isLocked);

            if (input) {
                input.disabled = !!isLocked;
            }
            if (button) {
                button.disabled = !!isLocked;
            }
        }

        function unlockStep(index) {
            var rows = stepsWrap.querySelectorAll('[data-step-row]');
            if (!rows[index]) {
                return;
            }
            setLocked(rows[index], false);
        }

        var i;
        for (i = 0; i < items.length; i += 1) {
            (function (item, index) {
                var row = document.createElement('div');
                row.className = 'pc-case-step';
                row.setAttribute('data-step-row', item.id);

                var stepTitle = document.createElement('p');
                stepTitle.className = 'pc-case-step__title';
                stepTitle.textContent = 'Step ' + (item.step || (index + 1)) + ': ' + item.label + ' (' + item.weight + ' pts)';
                row.appendChild(stepTitle);

                var prompt = document.createElement('p');
                prompt.className = 'pc-case-step__prompt';
                prompt.textContent = item.prompt;
                row.appendChild(prompt);

                var teachable = document.createElement('p');
                teachable.className = 'pc-case-step__teachable';
                teachable.textContent = item.teachablePoint || '';
                row.appendChild(teachable);

                var controls = document.createElement('div');
                controls.className = 'pc-case-step__controls';

                var input = document.createElement('input');
                input.className = 'pc-input';
                input.type = 'number';
                input.step = 'any';
                input.placeholder = 'Expected near ' + item.expected + (item.unit ? ' ' + item.unit : '');
                controls.appendChild(input);

                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'pc-btn pc-btn--secondary';
                button.textContent = 'Validate Step';
                controls.appendChild(button);

                if (item.triggerTool) {
                    var launch = document.createElement('a');
                    launch.className = 'pc-link-chip pc-link-chip--muted';
                    launch.textContent = 'Open linked tool';
                    launch.href = getToolHref(config, encounter, item.triggerTool) || '#';
                    controls.appendChild(launch);
                }

                row.appendChild(controls);

                var feedback = document.createElement('p');
                feedback.className = 'pc-case-step__feedback';
                row.appendChild(feedback);

                if (index > 0) {
                    setLocked(row, true);
                }

                button.addEventListener('click', function () {
                    var value = toNumber(input.value);
                    if (!Number.isFinite(value)) {
                        feedback.textContent = 'Enter a numeric value before validating.';
                        feedback.classList.remove('pc-case-step__feedback--ok');
                        feedback.classList.add('pc-case-step__feedback--warn');
                        return;
                    }

                    var tolerance = Number.isFinite(Number(item.tolerance)) ? Number(item.tolerance) : 0;
                    var diff = Math.abs(value - item.expected);
                    var isCorrect = diff <= tolerance;

                    answers[item.id] = {
                        value: value,
                        expected: item.expected,
                        tolerance: tolerance,
                        isCorrect: isCorrect,
                        attemptedAt: new Date().toISOString()
                    };

                    row.classList.remove('pc-case-step--correct');
                    row.classList.remove('pc-case-step--retry');
                    feedback.classList.remove('pc-case-step__feedback--ok');
                    feedback.classList.remove('pc-case-step__feedback--warn');

                    if (isCorrect) {
                        row.classList.add('pc-case-step--correct');
                        feedback.classList.add('pc-case-step__feedback--ok');
                        feedback.textContent = 'Correct within tolerance. Diff: ' + diff.toFixed(2) + (item.unit ? ' ' + item.unit : '') + '.';
                        unlockStep(index + 1);
                    } else {
                        row.classList.add('pc-case-step--retry');
                        feedback.classList.add('pc-case-step__feedback--warn');
                        feedback.textContent = 'Outside tolerance. Expected ~' + item.expected + (item.unit ? ' ' + item.unit : '') +
                            ' (±' + tolerance + ').';
                    }

                    updateStatus({
                        id: item.id,
                        isCorrect: isCorrect
                    });

                    if (window.pcIntegration && typeof window.pcIntegration.logCaseAction === 'function') {
                        var score = calculateAssessmentScore(items, answers);
                        window.pcIntegration.logCaseAction({
                            encounterId: encounter.id,
                            caseId: config.caseId,
                            caseTitle: config.title,
                            action: 'skill_check_validate',
                            source: 'case_skill_check',
                            details: {
                                stepId: item.id,
                                stepLabel: item.label,
                                entered: value,
                                expected: item.expected,
                                tolerance: tolerance,
                                withinTolerance: isCorrect,
                                scorePercent: score.percent
                            }
                        });
                    }
                });

                stepsWrap.appendChild(row);
            })(items[i], i);
        }

        updateStatus();
        return card;
    }

    function createPanel(config, encounter) {
        var panel = document.createElement('section');
        panel.className = 'pc-case-section pc-card pc-case-intel';
        panel.setAttribute('aria-labelledby', 'pc-case-intel-title');

        var header = document.createElement('header');
        header.className = 'pc-case-intel__header';
        header.innerHTML =
            '<p class="pc-kicker">Phase 4 Live</p>' +
            '<h2 id="pc-case-intel-title">Case-Linked Calculator Workspace</h2>' +
            '<p class="pc-case-intel__meta">Encounter ID: <code>' + encounter.id + '</code></p>';

        var grid = document.createElement('div');
        grid.className = 'pc-case-intel__grid';

        var toolsCard = document.createElement('article');
        toolsCard.className = 'pc-tool-module';
        toolsCard.innerHTML = '<h3>Recommended Calculators</h3>';
        var toolsList = document.createElement('ul');
        toolsList.className = 'pc-case-intel__list';

        var decisionsCard = document.createElement('article');
        decisionsCard.className = 'pc-tool-module';
        decisionsCard.innerHTML = '<h3>Decision Checkpoints</h3>';
        var decisionsList = document.createElement('ol');
        decisionsList.className = 'pc-case-intel__list pc-case-intel__list--ordered';

        var i;
        for (i = 0; i < config.tools.length; i += 1) {
            var tool = config.tools[i];
            var item = document.createElement('li');
            item.className = 'pc-case-intel__item';

            var link = document.createElement('a');
            link.className = 'pc-link-chip pc-link-chip--primary';
            link.textContent = tool.label;

            if (window.pcIntegration && typeof window.pcIntegration.buildPrefillUrl === 'function') {
                link.href = window.pcIntegration.buildPrefillUrl(tool.href, tool.params || {}, {
                    caseId: config.caseId,
                    encounterId: encounter.id
                });
            } else {
                link.href = tool.href;
            }

            (function (selectedTool, targetHref) {
                link.addEventListener('click', function () {
                    if (window.pcIntegration && typeof window.pcIntegration.logCaseAction === 'function') {
                        window.pcIntegration.logCaseAction({
                            encounterId: encounter.id,
                            caseId: config.caseId,
                            caseTitle: config.title,
                            action: 'calculator_launch',
                            source: 'case_workspace',
                            details: {
                                calculatorId: selectedTool.id,
                                calculatorLabel: selectedTool.label,
                                href: targetHref
                            }
                        });
                    }
                });
            })(tool, link.href);

            var detail = document.createElement('p');
            detail.className = 'pc-case-intel__summary';
            detail.textContent = tool.summary;

            item.appendChild(link);
            item.appendChild(detail);
            toolsList.appendChild(item);
        }

        for (i = 0; i < config.decisionPoints.length; i += 1) {
            var decision = document.createElement('li');
            decision.className = 'pc-case-intel__item';
            decision.textContent = config.decisionPoints[i];
            decisionsList.appendChild(decision);
        }

        toolsCard.appendChild(toolsList);
        decisionsCard.appendChild(decisionsList);
        grid.appendChild(toolsCard);
        grid.appendChild(decisionsCard);

        var assessmentCard = createAssessmentCard(config, encounter);
        if (assessmentCard) {
            grid.appendChild(assessmentCard);
        }

        var actions = document.createElement('div');
        actions.className = 'pc-panel-actions';
        actions.innerHTML =
            '<button type="button" class="pc-btn pc-btn--secondary" data-pc-export-json>Export Encounter JSON</button>' +
            '<button type="button" class="pc-btn pc-btn--secondary" data-pc-export-csv>Export Encounter CSV</button>';

        var stats = document.createElement('p');
        stats.className = 'pc-calculator-note';
        stats.setAttribute('data-pc-encounter-stats', '');

        panel.appendChild(header);
        panel.appendChild(grid);
        panel.appendChild(actions);
        panel.appendChild(stats);

        renderStats(encounter.id, stats);

        actions.querySelector('[data-pc-export-json]').addEventListener('click', function () {
            if (window.pcIntegration && typeof window.pcIntegration.exportEncounter === 'function') {
                window.pcIntegration.exportEncounter(encounter.id, 'json');
                renderStats(encounter.id, stats);
            }
        });

        actions.querySelector('[data-pc-export-csv]').addEventListener('click', function () {
            if (window.pcIntegration && typeof window.pcIntegration.exportEncounter === 'function') {
                window.pcIntegration.exportEncounter(encounter.id, 'csv');
                renderStats(encounter.id, stats);
            }
        });

        window.addEventListener('focus', function () {
            renderStats(encounter.id, stats);
        });

        return panel;
    }

    function insertPanel(panel) {
        var article = document.querySelector('.pc-case-article');
        if (!article) {
            return;
        }

        var diagnoseBox = article.querySelector('.pc-diagnose-box');
        if (diagnoseBox && diagnoseBox.parentNode) {
            if (diagnoseBox.nextSibling) {
                diagnoseBox.parentNode.insertBefore(panel, diagnoseBox.nextSibling);
            } else {
                diagnoseBox.parentNode.appendChild(panel);
            }
            return;
        }

        var disclaimer = article.querySelector('.pc-disclaimer');
        if (disclaimer && disclaimer.parentNode) {
            disclaimer.parentNode.insertBefore(panel, disclaimer);
            return;
        }

        article.appendChild(panel);
    }

    function bindDiagnoseTracking(config, encounter) {
        var buttons = document.querySelectorAll('[id$="-check-btn"]');
        var i;

        for (i = 0; i < buttons.length; i += 1) {
            buttons[i].addEventListener('click', function () {
                var button = this;

                window.setTimeout(function () {
                    var container = button.closest('.pc-diagnose-container');
                    if (!container || !window.pcIntegration || typeof window.pcIntegration.logCaseAction !== 'function') {
                        return;
                    }

                    var selected = container.querySelector('input[type="radio"]:checked');
                    var questionNode = container.querySelector('.pc-diagnose-question');
                    var feedbackTitle = container.querySelector('.pc-diagnose-feedback h4');
                    var feedbackText = feedbackTitle ? String(feedbackTitle.textContent || '').toLowerCase() : '';
                    var outcome = 'unknown';

                    if (feedbackText.indexOf('correct') !== -1) {
                        outcome = 'correct';
                    } else if (feedbackText.indexOf('not the best') !== -1 || feedbackText.indexOf('not') !== -1) {
                        outcome = 'incorrect';
                    }

                    window.pcIntegration.logCaseAction({
                        encounterId: encounter.id,
                        caseId: config.caseId,
                        caseTitle: config.title,
                        action: 'diagnose_submit',
                        source: 'diagnose_block',
                        details: {
                            selectedOption: selected ? selected.value : '',
                            outcome: outcome,
                            question: questionNode ? questionNode.textContent.trim() : ''
                        }
                    });
                }, 80);
            });
        }
    }

    function init() {
        if (!window.pcIntegration || typeof window.pcIntegration.ensureEncounter !== 'function') {
            return;
        }

        var config = getConfig();
        if (!config) {
            return;
        }

        var encounter = window.pcIntegration.ensureEncounter({
            caseId: config.caseId,
            caseTitle: config.title,
            patient: config.patient,
            source: 'case_page'
        });

        if (!encounter) {
            return;
        }

        window.pcIntegration.logCaseOpen({
            caseId: config.caseId,
            caseTitle: config.title,
            encounterId: encounter.id,
            patient: config.patient
        });

        var panel = createPanel(config, encounter);
        insertPanel(panel);
        bindDiagnoseTracking(config, encounter);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
