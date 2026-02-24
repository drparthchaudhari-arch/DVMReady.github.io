;(function () {
  'use strict'

  if (!document || !document.body) {
    return
  }

  var CONTEXT_KEY = 'dvmready_patient_context_v1'
  var CLINIC_MODE_KEY = 'dvmready_clinic_mode_v1'
  var defaultContext = {
    patientName: '',
    species: 'dog',
    breed: '',
    sex: '',
    age: '',
    weight: '',
    weightUnit: 'kg',
    admitDate: '',
    notes: '',
  }

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value)
    } catch (_error) {
      return fallback
    }
  }

  function getContext() {
    var raw = localStorage.getItem(CONTEXT_KEY)
    var parsed = safeParse(raw, {})
    return Object.assign({}, defaultContext, parsed)
  }

  function setContext(next) {
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(next))
  }

  function getClinicMode() {
    return localStorage.getItem(CLINIC_MODE_KEY) === 'true'
  }

  function setClinicMode(enabled) {
    if (enabled) {
      localStorage.setItem(CLINIC_MODE_KEY, 'true')
      document.documentElement.classList.add('clinic-mode')
      document.body.classList.add('clinic-mode')
      return
    }

    localStorage.removeItem(CLINIC_MODE_KEY)
    document.documentElement.classList.remove('clinic-mode')
    document.body.classList.remove('clinic-mode')
  }

  function getWeightInput() {
    var selectors = [
      '#weight',
      '#tox-weight',
      '#fluid-weight',
      '#patient-weight',
      'input[name="weight"]',
      'input[data-patient-weight]',
      '.calc-input[data-conversion="weight"]',
    ]

    for (var i = 0; i < selectors.length; i += 1) {
      var input = document.querySelector(selectors[i])
      if (input) {
        return input
      }
    }

    return null
  }

  function dispatchInput(node) {
    if (!node) {
      return
    }
    node.dispatchEvent(new Event('input', { bubbles: true }))
    node.dispatchEvent(new Event('change', { bubbles: true }))
  }

  function applyContextToPage(context) {
    var weightInput = getWeightInput()
    if (weightInput && context.weight && String(weightInput.value || '').trim() === '') {
      weightInput.value = context.weight
      dispatchInput(weightInput)
    }

    if (context.weightUnit) {
      var unitButton = document.querySelector(
        '.calc-unit-btn[data-unit="' + context.weightUnit + '"]'
      )
      if (unitButton && !unitButton.classList.contains('active')) {
        unitButton.click()
      }
    }

    var speciesButton = document.querySelector('[data-species="' + context.species + '"]')
    if (speciesButton && !speciesButton.classList.contains('active')) {
      speciesButton.click()
    }

    var speciesSelect = document.querySelector('#tox-species, #species, select[name="species"]')
    if (speciesSelect && context.species) {
      speciesSelect.value = context.species
      dispatchInput(speciesSelect)
    }
  }

  function contextSummaryText(context) {
    return [
      'Patient: ' + (context.patientName || '-'),
      'Species: ' + (context.species || '-'),
      'Breed: ' + (context.breed || '-'),
      'Sex: ' + (context.sex || '-'),
      'Age: ' + (context.age || '-'),
      'Weight: ' + (context.weight || '-') + ' ' + (context.weightUnit || ''),
      'Admit Date: ' + (context.admitDate || '-'),
      'Notes: ' + (context.notes || '-'),
    ].join('\n')
  }

  function copyText(text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.reject(new Error('Clipboard unavailable'))
    }
    return navigator.clipboard.writeText(text)
  }

  function createNode(tag, className, text) {
    var node = document.createElement(tag)
    if (className) {
      node.className = className
    }
    if (text) {
      node.textContent = text
    }
    return node
  }

  function buildClinicPanel() {
    if (document.querySelector('.pc-clinic-fab')) {
      return
    }

    var context = getContext()
    setClinicMode(getClinicMode())

    var fab = createNode('button', 'pc-clinic-fab', 'Clinic Tools')
    fab.type = 'button'
    fab.setAttribute('aria-expanded', 'false')
    fab.setAttribute('aria-controls', 'pc-clinic-panel')

    var panel = createNode('section', 'pc-clinic-panel')
    panel.hidden = true
    panel.id = 'pc-clinic-panel'

    var header = createNode('div', 'pc-clinic-header')
    var title = createNode('h3', 'pc-clinic-title', 'Clinic Utility Panel')
    var close = createNode('button', 'pc-clinic-close', 'Close')
    close.type = 'button'
    close.setAttribute('aria-label', 'Close clinic utility panel')
    header.appendChild(title)
    header.appendChild(close)
    panel.appendChild(header)

    var contextSection = createNode('section', 'pc-clinic-section')
    contextSection.innerHTML =
      '<h4>Patient Context</h4>' +
      '<div class="pc-clinic-grid">' +
      '<div class="pc-clinic-field"><label for="pcctx-name">Patient</label><input id="pcctx-name" type="text" /></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-species">Species</label><select id="pcctx-species"><option value="dog">Dog</option><option value="cat">Cat</option><option value="exotic">Exotic</option></select></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-breed">Breed</label><input id="pcctx-breed" type="text" /></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-sex">Sex</label><input id="pcctx-sex" type="text" /></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-age">Age</label><input id="pcctx-age" type="text" placeholder="e.g. 8y" /></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-admit">Admit Date</label><input id="pcctx-admit" type="date" /></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-weight">Weight</label><input id="pcctx-weight" type="number" min="0" step="0.01" /></div>' +
      '<div class="pc-clinic-field"><label for="pcctx-unit">Weight Unit</label><select id="pcctx-unit"><option value="kg">kg</option><option value="lb">lb</option><option value="g">g</option></select></div>' +
      '<div class="pc-clinic-field pc-clinic-field--full"><label for="pcctx-notes">Notes</label><textarea id="pcctx-notes" placeholder="Important findings, meds, cautions"></textarea></div>' +
      '</div>' +
      '<div class="pc-clinic-actions">' +
      '<button type="button" id="pcctx-save">Save Context</button>' +
      '<button type="button" id="pcctx-apply">Apply To Page</button>' +
      '<button type="button" id="pcctx-copy">Copy Summary</button>' +
      '<button type="button" id="pcctx-clear">Clear</button>' +
      '</div>'
    panel.appendChild(contextSection)

    var mathSection = createNode('section', 'pc-clinic-section')
    mathSection.innerHTML =
      '<h4>Quick Arithmetic</h4>' +
      '<div class="pc-clinic-math-display" id="pc-clinic-math-display">0</div>' +
      '<div class="pc-clinic-math-grid" id="pc-clinic-math-grid"></div>'
    panel.appendChild(mathSection)

    var modeSection = createNode('section', 'pc-clinic-section')
    modeSection.innerHTML =
      '<h4>Clinic Mode</h4>' +
      '<div class="pc-clinic-mode-row">' +
      '<span>Simplify visuals for shift use</span>' +
      '<input id="pc-clinic-mode-toggle" class="pc-clinic-switch" type="checkbox" />' +
      '</div>' +
      '<p style="margin:0.55rem 0 0;font-size:0.75rem;color:var(--pc-text-muted,#94a3b8);">Shortcut: Shift + C</p>'
    panel.appendChild(modeSection)

    document.body.appendChild(fab)
    document.body.appendChild(panel)

    function syncFormFromContext() {
      document.getElementById('pcctx-name').value = context.patientName
      document.getElementById('pcctx-species').value = context.species
      document.getElementById('pcctx-breed').value = context.breed
      document.getElementById('pcctx-sex').value = context.sex
      document.getElementById('pcctx-age').value = context.age
      document.getElementById('pcctx-weight').value = context.weight
      document.getElementById('pcctx-unit').value = context.weightUnit
      document.getElementById('pcctx-admit').value = context.admitDate
      document.getElementById('pcctx-notes').value = context.notes
    }

    function readContextFromForm() {
      return {
        patientName: document.getElementById('pcctx-name').value.trim(),
        species: document.getElementById('pcctx-species').value,
        breed: document.getElementById('pcctx-breed').value.trim(),
        sex: document.getElementById('pcctx-sex').value.trim(),
        age: document.getElementById('pcctx-age').value.trim(),
        weight: document.getElementById('pcctx-weight').value,
        weightUnit: document.getElementById('pcctx-unit').value,
        admitDate: document.getElementById('pcctx-admit').value,
        notes: document.getElementById('pcctx-notes').value.trim(),
      }
    }

    function togglePanel(nextOpen) {
      var open = typeof nextOpen === 'boolean' ? nextOpen : panel.hidden
      panel.hidden = !open
      fab.setAttribute('aria-expanded', open ? 'true' : 'false')
      if (open) {
        syncFormFromContext()
      }
    }

    fab.addEventListener('click', function () {
      togglePanel()
    })

    close.addEventListener('click', function () {
      togglePanel(false)
    })

    document.getElementById('pcctx-save').addEventListener('click', function () {
      context = readContextFromForm()
      setContext(context)
    })

    document.getElementById('pcctx-apply').addEventListener('click', function () {
      context = readContextFromForm()
      setContext(context)
      applyContextToPage(context)
    })

    document.getElementById('pcctx-copy').addEventListener('click', function () {
      context = readContextFromForm()
      setContext(context)
      copyText(contextSummaryText(context)).catch(function () {
        // Clipboard may be blocked; no-op fallback.
      })
    })

    document.getElementById('pcctx-clear').addEventListener('click', function () {
      context = Object.assign({}, defaultContext)
      setContext(context)
      syncFormFromContext()
    })

    var modeToggle = document.getElementById('pc-clinic-mode-toggle')
    modeToggle.checked = getClinicMode()
    modeToggle.addEventListener('change', function () {
      setClinicMode(modeToggle.checked)
    })

    document.addEventListener('keydown', function (event) {
      if (event.shiftKey && String(event.key).toLowerCase() === 'c') {
        modeToggle.checked = !modeToggle.checked
        setClinicMode(modeToggle.checked)
      }
      if (event.key === 'Escape' && !panel.hidden) {
        togglePanel(false)
      }
    })

    var mathButtons = [
      '7',
      '8',
      '9',
      '/',
      '4',
      '5',
      '6',
      '*',
      '1',
      '2',
      '3',
      '-',
      '0',
      '.',
      '(',
      ')',
      'C',
      'DEL',
      '=',
      '+',
    ]

    var expression = ''
    var display = document.getElementById('pc-clinic-math-display')
    var mathGrid = document.getElementById('pc-clinic-math-grid')

    function renderExpression() {
      display.textContent = expression || '0'
    }

    function evaluateExpression(input) {
      if (!input) {
        return null
      }
      if (!/^[0-9+\-*/().\s]+$/.test(input)) {
        return null
      }
      try {
        var value = Function('return (' + input + ')')()
        if (!Number.isFinite(value)) {
          return null
        }
        return value
      } catch (_error) {
        return null
      }
    }

    mathButtons.forEach(function (token) {
      var button = createNode('button', 'pc-clinic-math-btn', token)
      button.type = 'button'
      button.addEventListener('click', function () {
        if (token === 'C') {
          expression = ''
          renderExpression()
          return
        }

        if (token === 'DEL') {
          expression = expression.slice(0, -1)
          renderExpression()
          return
        }

        if (token === '=') {
          var result = evaluateExpression(expression)
          expression = result === null ? 'ERR' : String(result)
          renderExpression()
          return
        }

        if (expression === 'ERR') {
          expression = ''
        }
        expression += token
        renderExpression()
      })
      mathGrid.appendChild(button)
    })

    applyContextToPage(context)
  }

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback)
      return
    }
    callback()
  }

  ready(buildClinicPanel)
})()
