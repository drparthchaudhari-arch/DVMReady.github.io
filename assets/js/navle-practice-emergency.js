(function () {
    'use strict';

    var SESSION_KEY = 'pc_navle_practice_emergency_session_v1';
    var USAGE_KEY = 'pc_navle_free_usage_v1';
    var LEGACY_FREE_PREFIX = 'pc_free_questions_';

    var currentQuestion = null;
    var questionIndex = 0;
    var questions = [];
    var freeUsed = 0;
    var wasLoggedIn = false;
    var authHydrationInFlight = false;

    function byId(id) {
        return document.getElementById(id);
    }

    function safeParse(value, fallback) {
        try {
            var parsed = JSON.parse(value);
            return parsed !== null ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function safeGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    function getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }

    function getCurrentPath() {
        return window.location.pathname + window.location.search;
    }

    function rememberLearningLocation() {
        safeSet('pc_last_learning_url_v1', getCurrentPath());
        safeSet('pc_last_learning_seen_at_v1', new Date().toISOString());
    }

    function readUsage() {
        var today = getTodayKey();
        var usage = safeParse(safeGet(USAGE_KEY) || '{}', {});

        if (usage && String(usage.date || '') === today && Number.isFinite(Number(usage.used))) {
            return Math.max(0, Number(usage.used));
        }

        var legacy = parseInt(safeGet(LEGACY_FREE_PREFIX + today) || '0', 10);
        if (Number.isFinite(legacy) && legacy >= 0) {
            return legacy;
        }

        return 0;
    }

    function writeUsage(used) {
        var normalized = Math.max(0, Number(used) || 0);
        var today = getTodayKey();
        safeSet(USAGE_KEY, JSON.stringify({ date: today, used: normalized }));
        safeSet(LEGACY_FREE_PREFIX + today, String(normalized));
    }

    function readSessionIndex() {
        var today = getTodayKey();
        var session = safeParse(safeGet(SESSION_KEY) || '{}', {});
        if (session && String(session.date || '') === today && Number.isFinite(Number(session.index))) {
            return Math.max(0, Number(session.index));
        }
        return 0;
    }

    function writeSessionIndex(index) {
        var normalized = Math.max(0, Number(index) || 0);
        safeSet(SESSION_KEY, JSON.stringify({ date: getTodayKey(), index: normalized }));
    }

    function queueProgressSync() {
        if (!window.pcSync || typeof window.pcSync.getCurrentUser !== 'function' || typeof window.pcSync.syncToServer !== 'function') {
            return;
        }

        var user = window.pcSync.getCurrentUser();
        if (!user) {
            return;
        }

        window.pcSync.syncToServer({ trigger: 'practice_progress' }).catch(function () {
            // Keep local experience uninterrupted.
        });
    }

    function setProgress(index) {
        var progress = byId('question-progress');
        var fill = byId('practice-progress-fill');
        var current = Math.min(index + 1, 5);
        if (progress) {
            progress.textContent = 'Question ' + current + ' of 5 (Free)';
        }
        if (fill) {
            fill.style.width = String((current / 5) * 100) + '%';
        }
    }

    function parseQuestions(data) {
        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter(function (item) {
            return item && typeof item === 'object' && item.stem && item.options && item.correct;
        });
    }

    function renderLimitReached() {
        var container = byId('question-container');
        if (container) {
            container.innerHTML = '<p class="pc-calculator-note">Daily free limit reached. Create a free account to unlock all remaining questions.</p>';
        }
        setProgress(4);
        showGateModal();
    }

    async function loadQuestions() {
        var container = byId('question-container');

        try {
            var response = await fetch('/content/navle/questions.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            var data = await response.json();
            questions = parseQuestions(data).slice(0, 50);
            if (!questions.length) {
                throw new Error('No questions available');
            }

            freeUsed = readUsage();
            if (freeUsed >= 5) {
                renderLimitReached();
                return;
            }

            var resumeIndex = readSessionIndex();
            if (resumeIndex >= questions.length) {
                resumeIndex = 0;
            }

            showQuestion(resumeIndex);
        } catch (error) {
            console.error('Failed to load questions:', error);
            if (container) {
                container.innerHTML = '<p class="pc-calculator-warning">Error loading questions. Please refresh.</p>';
            }
        }
    }

    function showQuestion(index) {
        var container = byId('question-container');
        if (!container) {
            return;
        }

        if (index >= questions.length) {
            container.innerHTML = '<h3>You\'ve completed all available questions!</h3>';
            writeSessionIndex(0);
            return;
        }

        if (freeUsed >= 5) {
            renderLimitReached();
            return;
        }

        currentQuestion = questions[index];
        questionIndex = index;
        writeSessionIndex(index);

        var optionsHtml = Object.entries(currentQuestion.options).map(function (pair) {
            var key = pair[0];
            var text = pair[1];
            return '' +
                '<button class="pc-option-btn" type="button" onclick="selectOption(\'' + key + '\')" data-option="' + key + '">' +
                '<span class="pc-option-key">' + key + '</span>' +
                '<span class="pc-option-text">' + text + '</span>' +
                '</button>';
        }).join('');

        container.innerHTML = '' +
            '<div class="pc-question-card">' +
            '<div class="pc-question-header">' +
            '<span class="pc-question-number">Question ' + (index + 1) + '</span>' +
            '<span class="pc-question-topic">' + String(currentQuestion.topic || 'general') + '</span>' +
            '</div>' +
            '<p class="pc-question-stem">' + currentQuestion.stem + '</p>' +
            '<div class="pc-question-options">' + optionsHtml + '</div>' +
            '<div class="pc-question-feedback" id="feedback" style="display:none;"></div>' +
            '</div>';

        setProgress(index);
        rememberLearningLocation();
    }

    function selectOption(option) {
        if (!currentQuestion) {
            return;
        }

        var buttons = document.querySelectorAll('.pc-option-btn');
        buttons.forEach(function (btn) {
            btn.disabled = true;
            if (btn.dataset.option === currentQuestion.correct) {
                btn.classList.add('pc-option--correct');
            } else if (btn.dataset.option === option && option !== currentQuestion.correct) {
                btn.classList.add('pc-option--incorrect');
            }
        });

        var feedback = byId('feedback');
        if (!feedback) {
            return;
        }

        var isCorrect = option === currentQuestion.correct;
        feedback.style.display = 'block';
        feedback.className = 'pc-question-feedback ' + (isCorrect ? 'pc-feedback--correct' : 'pc-feedback--incorrect');
        feedback.innerHTML = '' +
            '<h4>' + (isCorrect ? '✓ Correct!' : '✗ Incorrect') + '</h4>' +
            '<p>' + currentQuestion.explanation + '</p>' +
            '<button class="pc-btn pc-btn--primary" type="button" onclick="nextQuestion()">Next Question</button>';

        freeUsed += 1;
        writeUsage(freeUsed);
        writeSessionIndex(questionIndex + 1);
        queueProgressSync();

        if (freeUsed >= 5) {
            window.setTimeout(showGateModal, 1200);
        }
    }

    function nextQuestion() {
        if (freeUsed >= 5) {
            renderLimitReached();
            return;
        }

        var nextIndex = questionIndex + 1;
        writeSessionIndex(nextIndex);
        showQuestion(nextIndex);
    }

    function showGateModal() {
        var modal = byId('gate-modal');
        if (modal) {
            modal.style.display = 'grid';
        }
    }

    async function sendMagicLinkFromGate() {
        var emailInput = byId('gate-email');
        var message = byId('gate-message');
        var submit = byId('gate-submit');

        var email = emailInput ? String(emailInput.value || '').trim() : '';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (message) {
                message.textContent = 'Enter a valid email address.';
                message.classList.add('pc-is-error');
            }
            return;
        }

        if (submit) {
            submit.disabled = true;
        }

        if (message) {
            message.textContent = 'Sending magic link...';
            message.classList.remove('pc-is-error');
            message.classList.remove('pc-is-success');
        }

        try {
            if (window.pcSync && typeof window.pcSync.sendMagicLink === 'function') {
                var result = await window.pcSync.sendMagicLink(email, {
                    redirectTo: window.location.origin + getCurrentPath()
                });

                if (result && result.ok) {
                    if (message) {
                        message.textContent = 'Magic link sent. Open it on any device to continue from synced progress.';
                        message.classList.add('pc-is-success');
                    }
                } else if (message) {
                    message.textContent = 'Could not send magic link right now. Please try again.';
                    message.classList.add('pc-is-error');
                }
            } else if (message) {
                message.textContent = 'Could not send magic link right now. Please try again.';
                message.classList.add('pc-is-error');
            }
        } catch (error) {
            if (message) {
                message.textContent = 'Could not send magic link right now. Please try again.';
                message.classList.add('pc-is-error');
            }
        }

        if (submit) {
            submit.disabled = false;
        }
    }

    function bindGateEvents() {
        var submit = byId('gate-submit');
        if (submit) {
            submit.addEventListener('click', function (event) {
                event.preventDefault();
                sendMagicLinkFromGate();
            });
        }
    }

    async function hydrateFromServerIfLoggedIn() {
        if (!window.pcSync) {
            return;
        }

        if (typeof window.pcSync.refreshCurrentUser === 'function') {
            await window.pcSync.refreshCurrentUser();
        }

        if (typeof window.pcSync.getCurrentUser !== 'function') {
            return;
        }

        var user = window.pcSync.getCurrentUser();
        wasLoggedIn = !!user;

        if (!user || typeof window.pcSync.syncFromServer !== 'function') {
            return;
        }

        await window.pcSync.syncFromServer();
    }

    function bindAuthResume() {
        window.addEventListener('pc-auth-status-change', function (event) {
            var loggedIn = !!(event && event.detail && event.detail.loggedIn);
            if (!loggedIn || wasLoggedIn || authHydrationInFlight) {
                wasLoggedIn = loggedIn;
                return;
            }

            authHydrationInFlight = true;
            wasLoggedIn = true;

            Promise.resolve()
                .then(function () {
                    if (window.pcSync && typeof window.pcSync.syncFromServer === 'function') {
                        return window.pcSync.syncFromServer();
                    }
                    return null;
                })
                .then(function () {
                    return loadQuestions();
                })
                .finally(function () {
                    authHydrationInFlight = false;
                });
        });
    }

    async function init() {
        if (!byId('question-container')) {
            return;
        }

        bindGateEvents();
        bindAuthResume();
        rememberLearningLocation();

        await hydrateFromServerIfLoggedIn();
        await loadQuestions();
    }

    window.selectOption = selectOption;
    window.nextQuestion = nextQuestion;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            init().catch(function () {
                // Keep page stable even if init fails.
            });
        }, { once: true });
    } else {
        init().catch(function () {
            // Keep page stable even if init fails.
        });
    }
})();
