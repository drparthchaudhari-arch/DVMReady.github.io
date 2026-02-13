(function () {
    'use strict';

    var STORAGE_KEY = 'pc_navle_practice_session_v1';
    var PAID_FLAG_KEY = 'pc_navle_paid';

    var QUESTIONS = [
        {
            id: 'q1',
            stem: 'A 9-year-old Cavalier King Charles Spaniel has acute dyspnea, crackles, and radiographic pulmonary edema. What is the best immediate medication priority?',
            options: {
                A: 'Start oral enalapril only',
                B: 'Give furosemide and oxygen support',
                C: 'Delay treatment until echocardiography',
                D: 'Use corticosteroids as first-line therapy'
            },
            correct: 'B',
            explanation: 'Acute cardiogenic edema is a stabilize-first emergency. Oxygen and loop diuretic therapy are first-line while diagnostics continue.'
        },
        {
            id: 'q2',
            stem: 'A dog with confirmed diabetic ketoacidosis is severely dehydrated. What should happen before insulin infusion is started?',
            options: {
                A: 'Begin regular insulin immediately',
                B: 'Administer bicarbonate first',
                C: 'Initiate fluid resuscitation and plan potassium support',
                D: 'Restrict fluids to avoid cerebral edema'
            },
            correct: 'C',
            explanation: 'In DKA, perfusion restoration and electrolyte planning precede insulin to avoid abrupt potassium decline and worsening instability.'
        },
        {
            id: 'q3',
            stem: 'An obstructed male cat has severe hyperkalemia with bradycardia and peaked T waves. Which intervention protects the myocardium first?',
            options: {
                A: 'Calcium gluconate',
                B: 'Furosemide',
                C: 'Prednisolone',
                D: 'Cefovecin'
            },
            correct: 'A',
            explanation: 'Calcium gluconate stabilizes cardiac membranes in life-threatening hyperkalemia. Potassium-shifting and removal strategies follow.'
        },
        {
            id: 'q4',
            stem: 'A Great Dane presents with non-productive retching, shock, and severe abdominal distension. Which sequence is most appropriate?',
            options: {
                A: 'Immediate surgery without stabilization',
                B: 'Fluids, decompression, then surgical correction with gastropexy',
                C: 'Observe for 12 hours before intervention',
                D: 'Treat with oral antacids only'
            },
            correct: 'B',
            explanation: 'GDV management requires rapid stabilization, gastric decompression, and definitive surgery once perfusion improves.'
        },
        {
            id: 'q5',
            stem: 'Which chocolate source is generally highest risk for severe theobromine toxicity at smaller ingested amounts?',
            options: {
                A: 'Milk chocolate',
                B: 'White chocolate',
                C: 'Baking chocolate',
                D: 'Chocolate-flavored cereal'
            },
            correct: 'C',
            explanation: 'Baking chocolate has high theobromine concentration, increasing toxicity risk at lower ingested doses.'
        },
        {
            id: 'q6',
            stem: 'A cat chewed true lily leaves 2 hours ago and is asymptomatic. Best next step?',
            options: {
                A: 'Wait for azotemia before treatment',
                B: 'Immediate decontamination and aggressive IV fluids',
                C: 'Single antiemetic and discharge',
                D: 'No therapy needed unless vomiting starts'
            },
            correct: 'B',
            explanation: 'Any true lily exposure in cats is an emergency. Early decontamination and renal-protective fluids are time-critical.'
        },
        {
            id: 'q7',
            stem: 'Which electrolyte pattern is most classically associated with Addisonian crisis in dogs?',
            options: {
                A: 'Hypernatremia and hypokalemia',
                B: 'Hyponatremia and hyperkalemia',
                C: 'Hypercalcemia and hypophosphatemia',
                D: 'Normal sodium and potassium'
            },
            correct: 'B',
            explanation: 'Primary hypoadrenocorticism commonly causes low sodium and high potassium due to mineralocorticoid deficiency.'
        },
        {
            id: 'q8',
            stem: 'A postpartum dairy cow has reduced appetite and a left-sided "ping". Most likely diagnosis?',
            options: {
                A: 'Left displaced abomasum',
                B: 'Right-sided heart failure',
                C: 'Acute rabies',
                D: 'Pulmonary edema'
            },
            correct: 'A',
            explanation: 'Classic LDA findings include recent calving, reduced intake, and left-sided ping in the appropriate rib space.'
        },
        {
            id: 'q9',
            stem: 'In an adult horse with colic, which finding strongly increases need for surgical referral?',
            options: {
                A: 'Mild intermittent discomfort responsive to analgesics',
                B: 'Heart rate persistently above 60 bpm with refractory pain',
                C: 'Single soft fecal output',
                D: 'Normal abdominal ultrasound'
            },
            correct: 'B',
            explanation: 'Persistent severe pain and tachycardia despite medical management are key surgical red flags in equine colic.'
        },
        {
            id: 'q10',
            stem: 'A pale, icteric dog has regenerative anemia. Which finding best supports IMHA?',
            options: {
                A: 'Low platelet count alone',
                B: 'Spherocytes and autoagglutination',
                C: 'Low T4',
                D: 'High urine specific gravity'
            },
            correct: 'B',
            explanation: 'Spherocytosis and agglutination are classic clues for immune-mediated hemolytic anemia in the right clinical context.'
        },
        {
            id: 'q11',
            stem: 'In septic shock resuscitation, which trend suggests improving perfusion?',
            options: {
                A: 'Rising blood lactate',
                B: 'Falling blood lactate over serial checks',
                C: 'Persistent hypothermia',
                D: 'Increasing vasopressor need'
            },
            correct: 'B',
            explanation: 'Serial lactate clearance is a practical marker of improved tissue perfusion when interpreted with overall clinical status.'
        },
        {
            id: 'q12',
            stem: 'A dog ingested ibuprofen 45 minutes ago and is clinically stable. What is a priority early intervention (if no contraindication)?',
            options: {
                A: 'Induce emesis',
                B: 'Start insulin CRI',
                C: 'Delay all therapy until signs appear',
                D: 'Give diuretics only'
            },
            correct: 'A',
            explanation: 'Recent ingestion may allow decontamination by emesis (case dependent), followed by GI and renal protective plans.'
        },
        {
            id: 'q13',
            stem: 'Dog + chronic cough + systolic murmur + cardiomegaly + edema pattern on thoracic imaging most strongly indicates:',
            options: {
                A: 'Primary tracheal collapse only',
                B: 'Left-sided congestive heart failure',
                C: 'Simple kennel cough',
                D: 'Pulmonary thromboembolism only'
            },
            correct: 'B',
            explanation: 'The combined auscultation, imaging, and respiratory pattern is classic for left-sided CHF rather than isolated airway disease.'
        },
        {
            id: 'q14',
            stem: 'When managing DKA, insulin should usually be delayed until:',
            options: {
                A: 'At least initial fluid therapy is underway',
                B: 'Urine ketones become negative',
                C: 'Blood glucose normalizes naturally',
                D: 'A complete endocrine panel is returned'
            },
            correct: 'A',
            explanation: 'Starting insulin before restoring perfusion can worsen electrolyte shifts and destabilize the patient.'
        },
        {
            id: 'q15',
            stem: 'What is a hallmark early danger in canine xylitol ingestion?',
            options: {
                A: 'Delayed hypercalcemia only',
                B: 'Rapid hypoglycemia',
                C: 'Immediate megacolon',
                D: 'Primary pulmonary edema'
            },
            correct: 'B',
            explanation: 'Xylitol can trigger profound insulin release and early hypoglycemia; hepatic injury can follow.'
        },
        {
            id: 'q16',
            stem: 'A dyspneic cat with suspected cardiomyopathy and pleural effusion is in respiratory distress. Best immediate therapeutic procedure?',
            options: {
                A: 'Abdominocentesis',
                B: 'Thoracocentesis',
                C: 'Cystocentesis',
                D: 'Pericardiocentesis in all cases'
            },
            correct: 'B',
            explanation: 'When pleural effusion compromises breathing, thoracocentesis can provide rapid relief and diagnostic value.'
        },
        {
            id: 'q17',
            stem: 'A puppy with hemorrhagic diarrhea and suspected parvoviral enteritis is hypovolemic. Core stabilization fluid choice?',
            options: {
                A: 'Hypotonic crystalloid',
                B: 'Isotonic crystalloid resuscitation',
                C: 'Only oral rehydration',
                D: 'No fluids until CBC returns'
            },
            correct: 'B',
            explanation: 'Parvoviral shock management is aggressive isotonic fluid resuscitation with ongoing reassessment and supportive care.'
        },
        {
            id: 'q18',
            stem: 'Before melarsomine adulticide in canine heartworm disease, which adjunct is commonly part of protocol planning?',
            options: {
                A: 'Doxycycline therapy',
                B: 'Long-term metronidazole as sole treatment',
                C: 'Immediate intense exercise',
                D: 'No macrocyclic lactone exposure'
            },
            correct: 'A',
            explanation: 'Doxycycline targeting Wolbachia is a common component of staged heartworm treatment protocols.'
        },
        {
            id: 'q19',
            stem: 'Which ECG progression is consistent with worsening hyperkalemia?',
            options: {
                A: 'Tall R waves then short QT',
                B: 'Peaked T waves progressing to widened QRS',
                C: 'Normal sinus rhythm with narrow QRS only',
                D: 'ST depression only'
            },
            correct: 'B',
            explanation: 'Hyperkalemia classically progresses from peaked T waves to QRS widening, then severe conduction compromise.'
        },
        {
            id: 'q20',
            stem: 'In acute pancreatitis supportive care for dogs, which principle is most appropriate?',
            options: {
                A: 'Withhold analgesia to track pain severity',
                B: 'Early fluid support and adequate analgesia',
                C: 'Delay antiemetics until day 3',
                D: 'Immediate high-fat feeding'
            },
            correct: 'B',
            explanation: 'Evidence-based supportive care emphasizes fluid therapy, pain control, antiemesis, and careful nutritional planning.'
        }
    ];

    var state = {
        session: null,
        questionMap: {},
        showingFeedback: false,
        isAuthenticated: false,
        isPaid: false
    };

    function getTodayString() {
        return new Date().toISOString().slice(0, 10);
    }

    function toPositiveInt(value, fallback) {
        var parsed = Number(value);
        if (Number.isFinite(parsed) && parsed >= 0) {
            return Math.floor(parsed);
        }
        return fallback;
    }

    function shuffle(items) {
        var copy = items.slice();
        for (var i = copy.length - 1; i > 0; i -= 1) {
            var swapIndex = Math.floor(Math.random() * (i + 1));
            var temp = copy[i];
            copy[i] = copy[swapIndex];
            copy[swapIndex] = temp;
        }
        return copy;
    }

    function buildQuestionMap() {
        for (var i = 0; i < QUESTIONS.length; i += 1) {
            state.questionMap[QUESTIONS[i].id] = QUESTIONS[i];
        }
    }

    function createSession() {
        var ids = [];
        for (var i = 0; i < QUESTIONS.length; i += 1) {
            ids.push(QUESTIONS[i].id);
        }

        return {
            date: getTodayString(),
            order: shuffle(ids),
            answeredCount: 0,
            correctCount: 0,
            cursor: 0,
            accountUnlock: false
        };
    }

    function loadSession() {
        var parsed = null;
        try {
            parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        } catch (error) {
            parsed = null;
        }

        if (!parsed || parsed.date !== getTodayString() || !Array.isArray(parsed.order) || !parsed.order.length) {
            state.session = createSession();
            saveSession();
            return;
        }

        parsed.answeredCount = toPositiveInt(parsed.answeredCount, 0);
        parsed.correctCount = toPositiveInt(parsed.correctCount, 0);
        parsed.cursor = toPositiveInt(parsed.cursor, parsed.answeredCount);
        parsed.accountUnlock = !!parsed.accountUnlock;

        if (parsed.cursor < parsed.answeredCount) {
            parsed.cursor = parsed.answeredCount;
        }

        if (parsed.cursor > QUESTIONS.length) {
            parsed.cursor = QUESTIONS.length;
        }

        state.session = parsed;
    }

    function saveSession() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.session));
        } catch (error) {
            // Storage persistence is best effort.
        }
    }

    function readPaidState(currentUser) {
        try {
            if (localStorage.getItem(PAID_FLAG_KEY) === 'true') {
                return true;
            }
        } catch (error) {
            // Ignore localStorage read failures.
        }

        if (!currentUser) {
            return false;
        }

        var metadata = currentUser.user_metadata || currentUser.app_metadata || {};
        return metadata.plan === 'premium' || metadata.subscription === 'active';
    }

    function getMaxAllowedQuestions() {
        if (state.isPaid) {
            return QUESTIONS.length;
        }

        if (state.isAuthenticated || state.session.accountUnlock) {
            return Math.min(12, QUESTIONS.length);
        }

        return Math.min(5, QUESTIONS.length);
    }

    function getCurrentQuestion() {
        if (!state.session || state.session.cursor >= state.session.order.length) {
            return null;
        }

        var id = state.session.order[state.session.cursor];
        return state.questionMap[id] || null;
    }

    function setText(id, value) {
        var node = document.getElementById(id);
        if (node) {
            node.textContent = value;
        }
    }

    function openModal(id) {
        var modal = document.getElementById(id);
        if (modal) {
            modal.hidden = false;
        }
    }

    function closeModal(id) {
        var modal = document.getElementById(id);
        if (modal) {
            modal.hidden = true;
        }
    }

    function closeAllModals() {
        closeModal('question-gate');
        closeModal('premium-gate');
    }

    function setGateMessage(message, isError) {
        var node = document.getElementById('gate-message');
        if (!node) {
            return;
        }

        node.textContent = message || '';
        node.classList.remove('pc-is-error');
        node.classList.remove('pc-is-success');

        if (!message) {
            return;
        }

        if (isError) {
            node.classList.add('pc-is-error');
        } else {
            node.classList.add('pc-is-success');
        }
    }

    function updateHud(feedbackView) {
        var maxAllowed = getMaxAllowedQuestions();
        var answered = state.session.answeredCount;

        var displayNumber;
        if (feedbackView) {
            displayNumber = Math.min(Math.max(answered, 1), maxAllowed);
        } else if (answered >= maxAllowed) {
            displayNumber = maxAllowed;
        } else {
            displayNumber = Math.min(answered + 1, maxAllowed);
        }

        var progress = maxAllowed ? (displayNumber / maxAllowed) * 100 : 0;

        setText('practice-question-counter', 'Question ' + displayNumber + ' of ' + maxAllowed);
        setText('practice-score', state.session.correctCount + '/' + maxAllowed + ' correct');

        var fill = document.getElementById('practice-progress-fill');
        if (fill) {
            fill.style.width = progress.toFixed(1) + '%';
        }
    }

    function resetCardForQuestion(question) {
        var stem = document.getElementById('practice-stem');
        var optionsWrap = document.getElementById('practice-options');
        var explanation = document.getElementById('practice-explanation');
        var nextButton = document.getElementById('practice-next');

        if (!stem || !optionsWrap || !explanation || !nextButton || !question) {
            return;
        }

        stem.textContent = question.stem;
        optionsWrap.innerHTML = '';

        var labels = ['A', 'B', 'C', 'D'];
        for (var i = 0; i < labels.length; i += 1) {
            var optionId = labels[i];
            var optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'pc-practice-option';
            optionButton.setAttribute('data-choice', optionId);
            optionButton.innerHTML = '<strong>' + optionId + '.</strong> ' + question.options[optionId];
            optionButton.addEventListener('click', onChooseAnswer);
            optionsWrap.appendChild(optionButton);
        }

        explanation.hidden = true;
        nextButton.hidden = true;
        state.showingFeedback = false;
    }

    function renderLockedState(maxAllowed) {
        setText('practice-stem', 'Daily question limit reached.');

        var optionsWrap = document.getElementById('practice-options');
        if (optionsWrap) {
            optionsWrap.innerHTML = '';
        }

        var explanation = document.getElementById('practice-explanation');
        if (explanation) {
            explanation.hidden = true;
        }

        var nextButton = document.getElementById('practice-next');
        if (nextButton) {
            nextButton.hidden = true;
        }

        updateHud(true);

        if (!state.isPaid && maxAllowed <= 5 && !state.session.accountUnlock && !state.isAuthenticated) {
            openModal('question-gate');
            return;
        }

        if (!state.isPaid) {
            openModal('premium-gate');
        }
    }

    function renderQuestion() {
        closeAllModals();
        setGateMessage('', false);

        var maxAllowed = getMaxAllowedQuestions();
        if (state.session.answeredCount >= maxAllowed) {
            renderLockedState(maxAllowed);
            return;
        }

        var question = getCurrentQuestion();
        if (!question) {
            renderLockedState(maxAllowed);
            return;
        }

        resetCardForQuestion(question);
        updateHud(false);
    }

    function styleOptions(selectedId, correctId) {
        var optionNodes = document.querySelectorAll('.pc-practice-option');
        for (var i = 0; i < optionNodes.length; i += 1) {
            var option = optionNodes[i];
            var choice = option.getAttribute('data-choice');
            option.disabled = true;

            if (choice === correctId) {
                option.classList.add('pc-practice-option--correct');
            }

            if (choice === selectedId && selectedId !== correctId) {
                option.classList.add('pc-practice-option--incorrect');
            }
        }
    }

    function showExplanation(isCorrect, question) {
        var panel = document.getElementById('practice-explanation');
        var title = document.getElementById('practice-feedback-title');
        var text = document.getElementById('practice-feedback-text');

        if (!panel || !title || !text) {
            return;
        }

        panel.hidden = false;
        panel.classList.remove('pc-answer--correct');
        panel.classList.remove('pc-answer--incorrect');
        panel.classList.add(isCorrect ? 'pc-answer--correct' : 'pc-answer--incorrect');
        title.textContent = isCorrect ? 'Correct' : 'Incorrect';
        text.textContent = question.explanation;
    }

    function onChooseAnswer(event) {
        if (state.showingFeedback) {
            return;
        }

        var button = event.currentTarget;
        var selected = String(button.getAttribute('data-choice') || '');
        var question = state.questionMap[state.session.order[state.session.cursor]];

        if (!question || !selected) {
            return;
        }

        var isCorrect = selected === question.correct;
        styleOptions(selected, question.correct);
        showExplanation(isCorrect, question);

        state.session.answeredCount += 1;
        if (isCorrect) {
            state.session.correctCount += 1;
        }
        state.session.cursor += 1;
        saveSession();

        state.showingFeedback = true;
        updateHud(true);

        var nextButton = document.getElementById('practice-next');
        if (!nextButton) {
            return;
        }

        var maxAllowed = getMaxAllowedQuestions();
        if (state.session.answeredCount >= maxAllowed && !state.isPaid) {
            nextButton.hidden = true;
            if (maxAllowed <= 5 && !state.session.accountUnlock && !state.isAuthenticated) {
                openModal('question-gate');
                return;
            }
            openModal('premium-gate');
            return;
        }

        nextButton.textContent = 'Next Question';
        nextButton.hidden = false;
    }

    function onNextQuestion() {
        if (!state.showingFeedback) {
            return;
        }

        state.showingFeedback = false;

        var maxAllowed = getMaxAllowedQuestions();
        if (state.session.answeredCount >= maxAllowed && !state.isPaid) {
            if (maxAllowed <= 5 && !state.session.accountUnlock && !state.isAuthenticated) {
                openModal('question-gate');
            } else {
                openModal('premium-gate');
            }
            return;
        }

        renderQuestion();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function sendGateMagicLink() {
        var emailInput = document.getElementById('gate-email');
        var submitButton = document.getElementById('gate-submit');

        var email = emailInput ? String(emailInput.value || '').trim() : '';
        if (!isValidEmail(email)) {
            setGateMessage('Enter a valid email address.', true);
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        setGateMessage('Sending magic link...', false);

        var unlocked = false;
        if (window.pcSync && typeof window.pcSync.sendMagicLink === 'function') {
            try {
                var redirectTarget = window.location.origin + '/study/navle/practice/';
                var result = await window.pcSync.sendMagicLink(email, { redirectTo: redirectTarget });
                if (result && result.ok) {
                    unlocked = true;
                    setGateMessage('Magic link sent. 7 more questions unlocked.', false);
                } else {
                    setGateMessage('Could not send magic link right now. Please try again.', true);
                }
            } catch (error) {
                setGateMessage('Could not send magic link right now. Please try again.', true);
            }
        } else {
            unlocked = true;
            setGateMessage('Sync service unavailable. 7 more questions unlocked locally.', false);
        }

        if (unlocked) {
            state.session.accountUnlock = true;
            saveSession();
            window.setTimeout(function () {
                closeModal('question-gate');
                renderQuestion();
            }, 500);
        }

        if (submitButton) {
            submitButton.disabled = false;
        }
    }

    function updateAuthStateAndRerender(snapshot) {
        var user = snapshot && snapshot.user ? snapshot.user : null;

        if (!user && window.pcSync && typeof window.pcSync.getCurrentUser === 'function') {
            user = window.pcSync.getCurrentUser();
        }

        state.isAuthenticated = !!user;
        state.isPaid = readPaidState(user);

        if (state.isAuthenticated) {
            state.session.accountUnlock = true;
            saveSession();
        }

        renderQuestion();
    }

    function bindEvents() {
        var nextButton = document.getElementById('practice-next');
        var gateButton = document.getElementById('gate-submit');
        var premiumClose = document.getElementById('premium-close');

        if (nextButton) {
            nextButton.addEventListener('click', onNextQuestion);
        }

        if (gateButton) {
            gateButton.addEventListener('click', function (event) {
                event.preventDefault();
                sendGateMagicLink();
            });
        }

        if (premiumClose) {
            premiumClose.addEventListener('click', function () {
                closeModal('premium-gate');
            });
        }

        if (window.pcSync && typeof window.pcSync.onAuthStateChange === 'function') {
            window.pcSync.onAuthStateChange(updateAuthStateAndRerender);
        }
    }

    function initAuthRefresh() {
        if (window.pcSync && typeof window.pcSync.refreshCurrentUser === 'function') {
            window.pcSync.refreshCurrentUser().finally(function () {
                updateAuthStateAndRerender();
            });
            return;
        }

        updateAuthStateAndRerender();
    }

    function init() {
        if (!document.getElementById('practice-options')) {
            return;
        }

        buildQuestionMap();
        loadSession();
        bindEvents();
        initAuthRefresh();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
