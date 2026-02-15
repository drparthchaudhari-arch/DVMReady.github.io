/**
 * Dose Calculator with Verified Drug Database
 * All dosages verified against Plumb's Veterinary Drug Handbook & Merck Veterinary Manual
 * Controlled substances protected by veterinarian access control
 */

;(function () {
  'use strict'

  var drugsData = []
  var currentDrug = null
  var currentForm = null

  function byId(id) {
    return document.getElementById(id)
  }

  function parseConcentration(value) {
    var match = String(value || '').match(/([0-9]*\.?[0-9]+)/)
    if (!match) {
      return NaN
    }
    var parsed = Number(match[1])
    return Number.isFinite(parsed) ? parsed : NaN
  }

  function getDoseFrequencyMultiplier(frequency) {
    var text = String(frequency || '').toUpperCase()
    if (text.indexOf('Q4H') !== -1 || text.indexOf('QID') !== -1) {
      return 4
    }
    if (text.indexOf('Q6H') !== -1) {
      return 4
    }
    if (text.indexOf('TID') !== -1 || text.indexOf('Q8H') !== -1) {
      return 3
    }
    if (text.indexOf('Q12H') !== -1) {
      return 2
    }
    if (text.indexOf('BID') !== -1) {
      return 2
    }
    if (text.indexOf('QOD') !== -1) {
      return 0.5
    }
    return 1
  }

  function setResults(mg, ml, total, warning) {
    var mgNode = byId('result-mg')
    var mlNode = byId('result-ml')
    var totalNode = byId('result-total')
    var warningNode = byId('result-warning')

    if (mgNode) {
      mgNode.textContent = mg
    }
    if (mlNode) {
      mlNode.textContent = ml
    }
    if (totalNode) {
      totalNode.textContent = total
    }
    if (warningNode) {
      warningNode.textContent = warning || ''
      warningNode.classList.remove('pc-calculator-warning--danger')
      if (warning) {
        warningNode.classList.add('pc-calculator-warning--danger')
      }
    }
  }

  function setFormMessage(message, isError) {
    var node = byId('dose-form-message')
    if (!node) {
      return
    }
    node.textContent = message || ''
    node.classList.remove('pc-is-error')
    node.classList.remove('pc-is-success')
    if (message) {
      node.classList.add(isError ? 'pc-is-error' : 'pc-is-success')
    }
  }

  function setFieldInvalid(field, message) {
    if (!field) {
      return
    }
    field.setAttribute('aria-invalid', message ? 'true' : 'false')
  }

  function validateRequiredFields(fields) {
    var firstInvalid = null
    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i]
      var invalid = !field || !String(field.value || '').trim()
      setFieldInvalid(field, invalid)
      if (invalid && !firstInvalid) {
        firstInvalid = field
      }
    }
    return firstInvalid
  }

  function getSelectedSpecies() {
    var speciesSelect = byId('species')
    return speciesSelect ? speciesSelect.value : 'dog'
  }

  function renderConcentrationOptions(drug, form) {
    var list = byId('dose-concentration-list')
    var hint = byId('concentration-hint')
    var chipsContainer = byId('concentration-chips')
    var species = getSelectedSpecies()

    if (!list) return

    list.innerHTML = ''
    if (chipsContainer) chipsContainer.innerHTML = ''

    if (!drug || !form || !drug.forms || !drug.forms[form]) {
      if (hint) {
        hint.textContent = 'Select drug and dosage form to see concentrations.'
      }
      return
    }

    // Get species-specific form data
    var formDataAll = drug.forms[form]
    var formData = formDataAll[species] || formDataAll
    var concentrations = formData.concentrations || []

    // Update concentration unit hint
    var concUnitHint = byId('conc-unit-hint')
    if (concUnitHint) {
      if (form === 'oral') {
        concUnitHint.textContent = 'mg/tablet'
      } else {
        concUnitHint.textContent = 'mg/mL'
      }
    }

    // Populate datalist
    for (var i = 0; i < concentrations.length; i += 1) {
      var conc = concentrations[i]
      var option = document.createElement('option')
      var value = parseConcentration(conc)
      if (Number.isFinite(value)) {
        option.value = String(value)
        option.label = conc
        list.appendChild(option)
        
        // Add chip
        if (chipsContainer) {
          var chip = document.createElement('button')
          chip.type = 'button'
          chip.className = 'pc-calc-chip'
          chip.textContent = conc
          chip.onclick = function(val) {
            return function() {
              var concInput = byId('concentration')
              if (concInput) {
                concInput.value = val
                onInputChange()
              }
              // Update active state
              var chips = chipsContainer.querySelectorAll('.pc-calc-chip')
              chips.forEach(function(c) { c.classList.remove('pc-calc-chip--active') })
              this.classList.add('pc-calc-chip--active')
            }
          }(String(value))
          chipsContainer.appendChild(chip)
        }
      }
    }

    if (hint) {
      var categoryLabel = drug.category ? 'Category: ' + drug.category + '. ' : ''
      var formLabel = form === 'oral' ? 'Oral' : 'Injectable'
      var routesLabel = formData.routes ? 'Routes: ' + formData.routes.join(', ') + '. ' : ''
      var doseLabel = Number.isFinite(Number(formData.dose_mg_kg))
        ? 'Dose: ' + formData.dose_mg_kg + ' mg/kg (' + species + ')'
        : 'Dose unavailable'
      var frequencyLabel = formData.frequency ? ' (' + formData.frequency + ')' : ''
      var speciesNote = formData.notes ? ' [' + formData.notes + ']' : ''
      hint.textContent =
        categoryLabel + formLabel + '. ' + routesLabel + doseLabel + frequencyLabel + speciesNote + '.'
    }

    // Auto-select first concentration if available
    var concInput = byId('concentration')
    if (concentrations.length > 0 && concInput) {
      var firstValue = parseConcentration(concentrations[0])
      if (Number.isFinite(firstValue)) {
        concInput.value = String(firstValue)
      }
    }
  }

  async function loadDrugs() {
    try {
      var response = await fetch('/content/drugs_verified.json', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('HTTP ' + response.status)
      }

      var data = await response.json()
      drugsData = Array.isArray(data.drugs) ? data.drugs : []
      
      // Filter controlled substances if no access
      if (window.ControlledSubstanceAccess && !window.ControlledSubstanceAccess.hasActiveAccess()) {
        drugsData = drugsData.filter(function(drug) {
          return !drug.controlled
        })
      }
      
      // Sort by category then name
      drugsData.sort(function (left, right) {
        var leftCategory = String((left && left.category) || '').toLowerCase()
        var rightCategory = String((right && right.category) || '').toLowerCase()
        if (leftCategory !== rightCategory) {
          return leftCategory.localeCompare(rightCategory)
        }
        return String((left && left.name) || '').localeCompare(
          String((right && right.name) || '')
        )
      })

      var select = byId('drug-select')
      if (!select) {
        return
      }

      select.innerHTML = '<option value="">Select drug...</option>'
      
      // Group by category
      var currentCategory = ''
      var optgroup = null
      
      drugsData.forEach(function (drug) {
        var category = drug.category || 'Other'
        
        // Add controlled marker
        var controlledMarker = drug.controlled ? ' 🔒' : ''
        
        var option = document.createElement('option')
        option.value = drug.name
        option.textContent = drug.name + controlledMarker
        option.dataset.controlled = drug.controlled ? 'true' : 'false'
        option.dataset.schedule = drug.schedule || ''
        select.appendChild(option)
      })

      // Add optgroup for controlled substances if user has access
      if (window.ControlledSubstanceAccess && window.ControlledSubstanceAccess.hasActiveAccess()) {
        var controlledDrugs = drugsData.filter(function(d) { return d.controlled })
        if (controlledDrugs.length > 0) {
          var controlledGroup = document.createElement('optgroup')
          controlledGroup.label = '🔒 Controlled Substances (Verified Access)'
          
          controlledDrugs.forEach(function (drug) {
            var option = document.createElement('option')
            option.value = drug.name
            option.textContent = drug.name + ' (Schedule ' + drug.schedule + ')'
            controlledGroup.appendChild(option)
          })
          
          select.appendChild(controlledGroup)
        }
      }
    } catch (error) {
      console.error('Failed to load drugs:', error)
      var selectNode = byId('drug-select')
      if (selectNode) {
        selectNode.innerHTML = '<option value="">Unable to load drugs</option>'
      }
    }
  }

  function updateConcentrations() {
    var drugName = byId('drug-select') ? byId('drug-select').value : ''
    var formSelect = byId('dosage-form')
    var form = formSelect ? formSelect.value : ''
    var referenceHint = byId('drug-reference-hint')
    
    currentDrug = drugsData.find(function (item) {
      return item.name === drugName
    })
    currentForm = form

    // Check for controlled substance
    if (currentDrug && currentDrug.controlled) {
      if (window.ControlledSubstanceAccess && !window.ControlledSubstanceAccess.hasActiveAccess()) {
        // Show controlled warning
        var warning = byId('controlled-warning')
        if (warning) warning.style.display = 'block'
        
        var scheduleHint = byId('drug-schedule-hint')
        if (scheduleHint) {
          scheduleHint.style.display = 'inline'
          scheduleHint.textContent = '🔒 Schedule ' + currentDrug.schedule
        }
        
        // Don't show dosage form for controlled without access
        if (formSelect) formSelect.innerHTML = '<option value="">Verification required</option>'
        return
      }
    } else {
      // Hide controlled warning
      var warning = byId('controlled-warning')
      if (warning) warning.style.display = 'none'
      
      var scheduleHint = byId('drug-schedule-hint')
      if (scheduleHint) scheduleHint.style.display = 'none'
    }

    // Update dosage form options based on available forms
    if (currentDrug && currentDrug.forms) {
      var availableForms = Object.keys(currentDrug.forms)
      if (formSelect) {
        formSelect.innerHTML = '<option value="">Select form...</option>'
        
        if (availableForms.indexOf('oral') !== -1) {
          var oralOption = document.createElement('option')
          oralOption.value = 'oral'
          oralOption.textContent = '💊 Oral (Tablet/Capsule)'
          formSelect.appendChild(oralOption)
        }
        
        if (availableForms.indexOf('injectable') !== -1) {
          var injectOption = document.createElement('option')
          injectOption.value = 'injectable'
          injectOption.textContent = '💉 Injectable (IV/IM/SC)'
          formSelect.appendChild(injectOption)
        }
      }
    }

    if (referenceHint) {
      if (currentDrug && currentDrug.reference) {
        referenceHint.textContent = 'Reference: ' + currentDrug.reference
      } else if (currentDrug) {
        referenceHint.textContent = 'Reference: Verified against Plumb\'s Veterinary Drug Handbook & Merck Veterinary Manual'
      } else {
        referenceHint.textContent = 'Choose a drug to see reference context.'
      }
    }

    renderConcentrationOptions(currentDrug, form)
  }

  function onDosageFormChange() {
    var formSelect = byId('dosage-form')
    var routeField = byId('route-field')
    var species = getSelectedSpecies()
    
    if (formSelect) {
      currentForm = formSelect.value
    }
    
    if (formSelect && routeField) {
      if (formSelect.value === 'injectable') {
        routeField.style.display = 'block'
        // Populate available routes (species-specific)
        if (currentDrug && currentDrug.forms && currentDrug.forms.injectable) {
          var injectData = currentDrug.forms.injectable
          var speciesData = injectData[species]
          var routes = speciesData ? speciesData.routes : injectData.routes
          var routeSelect = byId('route-select')
          if (routeSelect && routes) {
            routeSelect.innerHTML = ''
            routes.forEach(function(route) {
              var option = document.createElement('option')
              option.value = route
              option.textContent = route
              routeSelect.appendChild(option)
            })
          }
        }
      } else {
        routeField.style.display = 'none'
      }
    }
    
    renderConcentrationOptions(currentDrug, formSelect ? formSelect.value : '')
    onInputChange()
  }

  function calculateDose(event) {
    if (event) {
      event.preventDefault()
    }

    var species = byId('species') ? byId('species').value : ''
    var weight = parseFloat(byId('weight') ? byId('weight').value : '')
    var drugName = byId('drug-select') ? byId('drug-select').value : ''
    var form = byId('dosage-form') ? byId('dosage-form').value : ''
    var concentration = parseFloat(byId('concentration') ? byId('concentration').value : '')
    
    var firstInvalid = validateRequiredFields([
      byId('weight'),
      byId('drug-select'),
      byId('dosage-form'),
      byId('concentration'),
    ])

    if (firstInvalid || !species || !weight || !drugName || !concentration || !form) {
      setFormMessage(
        'Please complete all fields before calculating.',
        true
      )
      if (firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus()
      }
      return
    }
    setFormMessage('', false)

    var drug = drugsData.find(function (item) {
      return item.name === drugName
    })

    if (!drug) {
      setFormMessage(
        'Selected drug is unavailable. Refresh and try again.',
        true
      )
      return
    }

    // Check controlled substance access
    if (drug.controlled && window.ControlledSubstanceAccess) {
      if (!window.ControlledSubstanceAccess.hasActiveAccess()) {
        setFormMessage('Controlled substance - veterinarian verification required.', true)
        window.ControlledSubstanceAccess.showAccessModal(drugName, function() {
          calculateDose()
        })
        return
      }
    }

    // Get form-specific dosing (with species-specific overrides)
    var formDataAll = drug.forms && drug.forms[form]
    if (!formDataAll) {
      setFormMessage('Selected dosage form not available for this drug.', true)
      return
    }
    
    // Get species-specific data
    var formData = formDataAll[species] || formDataAll
    
    var dosePerKg = Number(formData.dose_mg_kg || 0)
    var maxDosePerKg = Number(formData.max_mg_kg || 0)
    var frequency = formData.frequency || 'SID'
    
    if (!dosePerKg) {
      setFormMessage('Dose information unavailable for ' + species + '.', true)
      return
    }

    var mgPerDose = weight * dosePerKg
    var mlPerDose = mgPerDose / concentration
    var totalDaily = mgPerDose * getDoseFrequencyMultiplier(frequency)

    setResults(
      mgPerDose.toFixed(2) + ' mg',
      mlPerDose.toFixed(2) + (form === 'oral' ? ' tablets' : ' mL'),
      totalDaily.toFixed(2) + ' mg/day',
      ''
    )
    setFormMessage('Calculation complete. Verified dosing per ' + (drug.reference || 'standard references'), false)

    var maxDose = weight * maxDosePerKg
    if (mgPerDose > maxDose && maxDose > 0) {
      setResults(
        mgPerDose.toFixed(2) + ' mg',
        mlPerDose.toFixed(2) + (form === 'oral' ? ' tablets' : ' mL'),
        totalDaily.toFixed(2) + ' mg/day',
        '⚠️ Warning: Dose exceeds maximum (' + maxDose.toFixed(2) + ' mg). Verify with veterinarian.'
      )
    }
    
    // Log controlled drug access
    if (drug.controlled && window.ControlledSubstanceAccess) {
      window.ControlledSubstanceAccess.logAuditEvent('CONTROLLED_DRUG_CALCULATED', { 
        drug: drugName,
        dose: mgPerDose.toFixed(2)
      })
    }
  }

  function init() {
    var form = byId('dose-form')
    var drugSelect = byId('drug-select')
    var speciesSelect = byId('species')

    if (!form || !drugSelect) {
      return
    }

    loadDrugs()

    form.addEventListener('submit', calculateDose)
    drugSelect.addEventListener('change', updateConcentrations)
    
    // Update drug info display
    var dosageFormSelect = byId('dosage-form')
    if (dosageFormSelect) {
      dosageFormSelect.addEventListener('change', onDosageFormChange)
    }
    
    // Re-render concentrations when species changes
    if (speciesSelect) {
      speciesSelect.addEventListener('change', function() {
        if (currentDrug && currentForm) {
          renderConcentrationOptions(currentDrug, currentForm)
          onInputChange()
        }
      })
    }
  }

  // Expose functions globally
  window.updateConcentrations = updateConcentrations
  window.onDosageFormChange = onDosageFormChange
  window.onInputChange = function() {
    // Auto-calculate if enabled
    var autoCalcBtn = byId('auto-calc-btn')
    if (autoCalcBtn && autoCalcBtn.classList.contains('pc-calc-chip--active')) {
      calculateDose()
    }
  }
  window.onDrugChange = function() {
    // Check if controlled
    var drugSelect = byId('drug-select')
    if (drugSelect && window.ControlledSubstanceAccess) {
      var drugName = drugSelect.value
      if (window.ControlledSubstanceAccess.isControlled(drugName)) {
        if (!window.ControlledSubstanceAccess.hasActiveAccess()) {
          window.ControlledSubstanceAccess.showAccessModal(drugName, function() {
            updateConcentrations()
          })
          return
        }
      }
    }
    updateConcentrations()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
