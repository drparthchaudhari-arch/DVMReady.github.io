;(function () {
  'use strict'

  var DRUGS = [
    {
      id: 'amoxicillin',
      label: 'Amoxicillin',
      className: 'Beta-lactam antibiotic',
      elimination: 'Primarily renal (>70%)',
      binding: '17-20%',
      halflife: '1-1.5 hr',
      intervals: {
        normal: 'q8-12h',
        mild: 'q12h',
        moderate: 'q12-24h',
        severe: 'q24h',
      },
      caution:
        'Primarily renal elimination. Extend interval as azotemia worsens.',
    },
    {
      id: 'amoxicillin_clavulanate',
      label: 'Amoxicillin-Clavulanate',
      className: 'Beta-lactam antibiotic',
      elimination: 'Renal (amoxicillin)',
      binding: '18%',
      halflife: '1-1.3 hr',
      intervals: {
        normal: 'q12h',
        mild: 'q12h',
        moderate: 'q12-24h',
        severe: 'q24h',
      },
      caution:
        'Use interval extension first; reassess GI tolerance and hydration status.',
    },
    {
      id: 'cephalexin',
      label: 'Cephalexin',
      className: 'Cephalosporin antibiotic',
      elimination: 'Primarily renal',
      binding: '10-15%',
      halflife: '2-3 hr',
      intervals: {
        normal: 'q12h',
        mild: 'q12h',
        moderate: 'q12-24h',
        severe: 'q24h',
      },
      caution: 'Monitor for accumulation if appetite and hydration are poor.',
    },
    {
      id: 'cefazolin',
      label: 'Cefazolin',
      className: 'Cephalosporin antibiotic',
      elimination: 'Primarily renal',
      binding: '75-85%',
      halflife: '1.5-2.5 hr',
      intervals: {
        normal: 'q8h',
        mild: 'q8-12h',
        moderate: 'q12h',
        severe: 'q12-24h',
      },
      caution: 'For hospitalized use, align interval with serial renal trends.',
    },
    {
      id: 'cefpodoxime',
      label: 'Cefpodoxime',
      className: 'Cephalosporin antibiotic',
      elimination: 'Renal (active metabolite)',
      binding: '18-25%',
      halflife: '4-6 hr',
      intervals: {
        normal: 'q24h',
        mild: 'q24h',
        moderate: 'q24-48h',
        severe: 'q48h',
      },
      caution: 'Longer-acting drug; avoid stacking doses in severe compromise.',
    },
    {
      id: 'enrofloxacin',
      label: 'Enrofloxacin',
      className: 'Fluoroquinolone antibiotic',
      elimination: 'Hepatic + Renal',
      binding: '25-30%',
      halflife: '4-6 hr (dog)',
      intervals: {
        normal: 'q24h',
        mild: 'q24h',
        moderate: 'q24-36h',
        severe: 'q48h / consider alternative',
      },
      caution:
        'Monitor neurologic status and hydration; avoid excessive accumulation.',
    },
    {
      id: 'marbofloxacin',
      label: 'Marbofloxacin',
      className: 'Fluoroquinolone antibiotic',
      elimination: 'Hepatic + Renal',
      binding: '10%',
      halflife: '10-14 hr',
      intervals: {
        normal: 'q24h',
        mild: 'q24h',
        moderate: 'q24-36h',
        severe: 'q48h',
      },
      caution: 'Prefer interval adjustment over repeated dose escalation.',
    },
    {
      id: 'metronidazole',
      label: 'Metronidazole',
      className: 'Nitroimidazole antimicrobial',
      elimination: 'Hepatic metabolites + Renal',
      binding: '<20%',
      halflife: '4-8 hr',
      intervals: {
        normal: 'q12h',
        mild: 'q12h',
        moderate: 'q12-24h',
        severe: 'q24h / lower dose',
      },
      caution:
        'Neurotoxicity risk increases with prolonged exposure in advanced disease.',
    },
    {
      id: 'famotidine',
      label: 'Famotidine',
      className: 'H2 blocker',
      elimination: 'Renal (unchanged)',
      binding: '15-20%',
      halflife: '2-3 hr',
      intervals: {
        normal: 'q12h',
        mild: 'q24h',
        moderate: 'q24h',
        severe: 'q24-48h',
      },
      caution:
        'Interval extension is preferred over dose stacking in severe azotemia.',
    },
    {
      id: 'gabapentin',
      label: 'Gabapentin',
      className: 'Neuropathic analgesic',
      elimination: 'Primarily renal (unchanged)',
      binding: '<3%',
      halflife: '3-4 hr',
      intervals: {
        normal: 'q8-12h',
        mild: 'q12h',
        moderate: 'q12-24h',
        severe: 'q24h',
      },
      caution:
        'Sedation risk rises with renal compromise; start lower and titrate carefully.',
    },
    {
      id: 'levetiracetam',
      label: 'Levetiracetam',
      className: 'Anticonvulsant',
      elimination: 'Primarily renal (unchanged)',
      binding: '<10%',
      halflife: '3-6 hr',
      intervals: {
        normal: 'q8h',
        mild: 'q8-12h',
        moderate: 'q12h',
        severe: 'q12-24h',
      },
      caution:
        'Renal clearance is substantial; avoid abrupt high-frequency dosing in severe compromise.',
    },
    {
      id: 'fluconazole',
      label: 'Fluconazole',
      className: 'Antifungal',
      elimination: 'Primarily renal (unchanged)',
      binding: '11-12%',
      halflife: '20-30 hr',
      intervals: {
        normal: 'q24h',
        mild: 'q24h',
        moderate: 'q24-48h',
        severe: 'q48h',
      },
      caution:
        'Reduce exposure in advanced CKD and monitor liver/kidney trends together.',
    },
    {
      id: 'tramadol',
      label: 'Tramadol',
      className: 'Analgesic',
      elimination: 'Hepatic (active metabolite)',
      binding: '20%',
      halflife: '1-3 hr (dog)',
      intervals: {
        normal: 'q8-12h',
        mild: 'q12h',
        moderate: 'q12-24h',
        severe: 'q24h',
      },
      caution:
        'Sedation and dysphoria may increase; reassess comfort plan frequently.',
    },
    {
      id: 'furosemide',
      label: 'Furosemide',
      className: 'Loop diuretic',
      elimination: 'Primarily renal (secreted)',
      binding: '90-99%',
      halflife: '1-2 hr',
      intervals: {
        normal: 'q8-12h',
        mild: 'q8-12h',
        moderate: 'q12h',
        severe: 'q12-24h (titrate to effect)',
      },
      caution:
        'Dose frequency depends on congestion and hydration; monitor electrolytes and renal values closely.',
    },
    {
      id: 'spironolactone',
      label: 'Spironolactone',
      className: 'Aldosterone antagonist',
      elimination: 'Hepatic metabolites + Renal',
      binding: '90%',
      halflife: '1-2 hr (metabolites longer)',
      intervals: {
        normal: 'q24h',
        mild: 'q24h',
        moderate: 'q24h',
        severe: 'q24-48h / use caution',
      },
      caution:
        'Hyperkalemia risk increases with advanced CKD or concurrent RAAS blockers.',
    },
  ]

  var STAGE_NOTES = {
    normal: 'Baseline renal function selected. Use standard dosing intervals.',
    mild: 'Mild compromise (IRIS Stage 2): Usually maintain dose and extend interval only when needed.',
    moderate: 'Moderate compromise (IRIS Stage 3): Interval extension is commonly required. Monitor for accumulation.',
    severe:
      'Severe compromise (IRIS Stage 4): Conservative intervals and close monitoring are recommended. Consider alternatives.',
  }

  function byId(id) {
    return document.getElementById(id)
  }

  function setText(id, text) {
    var node = byId(id)
    if (node) {
      node.textContent = text
    }
  }

  function getDrugById(id) {
    for (var i = 0; i < DRUGS.length; i += 1) {
      if (DRUGS[i].id === id) {
        return DRUGS[i]
      }
    }
    return null
  }

  function populateDrugOptions() {
    var select = byId('rda-drug')
    if (!select) {
      return
    }

    select.innerHTML = '<option value="">Select drug...</option>'
    for (var i = 0; i < DRUGS.length; i += 1) {
      var option = document.createElement('option')
      option.value = DRUGS[i].id
      option.textContent = DRUGS[i].label
      select.appendChild(option)
    }
    
    // Store all drugs for filtering
    window.allDrugs = DRUGS.map(function(d) {
      return { id: d.id, label: d.label, className: d.className }
    })
  }

  function updateDrugInfo(drug) {
    if (!drug) return
    
    // Update drug info card
    var drugNameEl = byId('drug-name')
    var drugCatEl = byId('drug-category')
    var drugDetailsEl = byId('drug-details')
    var elimEl = byId('drug-elimination')
    var bindingEl = byId('drug-binding')
    var halflifeEl = byId('drug-halflife')
    
    if (drugNameEl) drugNameEl.textContent = drug.label
    if (drugCatEl) drugCatEl.textContent = drug.className
    if (drugDetailsEl) drugDetailsEl.style.opacity = '1'
    if (elimEl) elimEl.textContent = drug.elimination || 'Renal'
    if (bindingEl) bindingEl.textContent = drug.binding || 'Variable'
    if (halflifeEl) halflifeEl.textContent = drug.halflife || 'Varies'
    
    // Update caution alert
    var cautionAlert = byId('caution-alert')
    var cautionText = byId('caution-text')
    if (cautionAlert && cautionText) {
      cautionAlert.style.display = 'flex'
      cautionText.textContent = drug.caution
    }
  }

  function render(event) {
    if (event) {
      event.preventDefault()
    }

    var stageNode = byId('rda-stage')
    var drugNode = byId('rda-drug')
    var stage = stageNode ? String(stageNode.value || 'mild') : 'mild'
    var drugKey = drugNode ? String(drugNode.value || '') : ''
    
    if (!drugKey) {
      // No drug selected yet
      return
    }
    
    var drug = getDrugById(drugKey)

    if (!drug || !drug.intervals || !drug.intervals[stage]) {
      setText('stage-note', 'Select a valid drug and renal stage.')
      return
    }

    // Update drug info
    updateDrugInfo(drug)

    // Update main results
    setText('result-interval', drug.intervals[stage])
    setText('result-baseline', drug.intervals.normal)
    setText('result-class', drug.className.split(' ')[0])
    
    // Update visualization
    setText('viz-baseline', drug.intervals.normal)
    setText('viz-adjusted', drug.intervals[stage])
    
    // Update context
    var stageContext = byId('stage-context')
    if (stageContext) {
      var stageLabels = {
        normal: 'Normal function',
        mild: 'Mild compromise',
        moderate: 'Moderate compromise',
        severe: 'Severe compromise'
      }
      stageContext.textContent = stageLabels[stage] || stage
    }
    
    // Update interval context
    var intervalContext = byId('result-interval-context')
    if (intervalContext) {
      intervalContext.textContent = 'Adjusted for ' + stage + ' renal compromise'
    }
    
    // Update elimination info
    var elimInfo = byId('result-elimination')
    if (elimInfo) {
      elimInfo.textContent = drug.elimination ? drug.elimination.split(' ')[0] + ' clearance' : 'Renal clearance'
    }
    
    // Update monitor priority
    var monitorEl = byId('result-monitor')
    var monitorContext = byId('result-monitor-context')
    if (monitorEl && monitorContext) {
      if (stage === 'severe') {
        monitorEl.textContent = 'Critical'
        monitorContext.textContent = 'Therapeutic drug monitoring advised'
      } else if (stage === 'moderate') {
        monitorEl.textContent = 'High'
        monitorContext.textContent = 'Monitor for accumulation'
      } else {
        monitorEl.textContent = 'Standard'
        monitorContext.textContent = 'Routine monitoring'
      }
    }

    // Update stage note
    setText('stage-note', STAGE_NOTES[stage])
  }

  function init() {
    var form = byId('rda-form')
    if (!form) {
      return
    }

    populateDrugOptions()
    form.addEventListener('submit', render)
    
    // Don't auto-render on change - let the dashboard script handle that
    // form.addEventListener('change', render)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
