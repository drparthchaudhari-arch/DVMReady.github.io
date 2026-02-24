/**
 * DVMReady Patient Weight Ribbon
 * Persistent weight input that auto-fills across all calculator pages
 * Competitive feature matching DVMCalc.com
 * 
 * @version 1.0.0
 * @author DVMReady Development Team
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'dvmready_patient_data',
    ribbonId: 'patient-weight-ribbon',
    zIndex: 9999,
    height: '60px',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    // Colors matching DVMReady dark theme
    colors: {
      bg: '#0d1b2a',
      border: '#1b3a4b',
      text: '#e0e1dd',
      primary: '#00d4aa',
      secondary: '#778da9',
      inputBg: '#1b263b',
      hover: '#415a77'
    }
  };

  // State management
  let patientData = {
    weight: '',
    weightUnit: 'kg',
    species: 'canine',
    timestamp: null
  };

  /**
   * Initialize the weight ribbon
   */
  function init() {
    // Load saved data
    loadPatientData();
    
    // Create ribbon
    createRibbon();
    
    // Setup auto-fill listeners
    setupAutoFill();
    
    // Listen for page changes (for SPAs)
    observePageChanges();
    
    console.log('[DVMReady] Patient Weight Ribbon initialized');
  }

  /**
   * Load patient data from sessionStorage
   */
  function loadPatientData() {
    try {
      const saved = sessionStorage.getItem(CONFIG.storageKey);
      if (saved) {
        patientData = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[DVMReady] Could not load patient data:', e);
    }
  }

  /**
   * Save patient data to sessionStorage
   */
  function savePatientData() {
    try {
      patientData.timestamp = Date.now();
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(patientData));
    } catch (e) {
      console.warn('[DVMReady] Could not save patient data:', e);
    }
  }

  /**
   * Create the ribbon DOM element
   */
  function createRibbon() {
    // Check if already exists
    if (document.getElementById(CONFIG.ribbonId)) {
      return;
    }

    const ribbon = document.createElement('div');
    ribbon.id = CONFIG.ribbonId;
    ribbon.innerHTML = getRibbonHTML();
    document.body.appendChild(ribbon);

    // Add styles
    addRibbonStyles();

    // Add event listeners
    attachRibbonEvents(ribbon);

    // Restore saved values
    restoreValues(ribbon);
  }

  /**
   * Get ribbon HTML content
   */
  function getRibbonHTML() {
    return `
      <div class="pwr-container">
        <div class="pwr-content">
          <div class="pwr-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Patient</span>
          </div>
          
          <div class="pwr-field">
            <label for="pwr-weight">Weight</label>
            <div class="pwr-input-group">
              <input 
                type="number" 
                id="pwr-weight" 
                placeholder="0.0" 
                min="0.1" 
                max="9999"
                step="0.1"
                value="${patientData.weight}"
              >
              <select id="pwr-weight-unit">
                <option value="kg" ${patientData.weightUnit === 'kg' ? 'selected' : ''}>kg</option>
                <option value="lb" ${patientData.weightUnit === 'lb' ? 'selected' : ''}>lb</option>
              </select>
            </div>
          </div>
          
          <div class="pwr-field">
            <label for="pwr-species">Species</label>
            <select id="pwr-species">
              <option value="canine" ${patientData.species === 'canine' ? 'selected' : ''}>Canine</option>
              <option value="feline" ${patientData.species === 'feline' ? 'selected' : ''}>Feline</option>
              <option value="avian" ${patientData.species === 'avian' ? 'selected' : ''}>Avian</option>
              <option value="rabbit" ${patientData.species === 'rabbit' ? 'selected' : ''}>Rabbit</option>
              <option value="ferret" ${patientData.species === 'ferret' ? 'selected' : ''}>Ferret</option>
              <option value="reptile" ${patientData.species === 'reptile' ? 'selected' : ''}>Reptile</option>
              <option value="rodent" ${patientData.species === 'rodent' ? 'selected' : ''}>Rodent</option>
              <option value="other" ${patientData.species === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          
          <div class="pwr-actions">
            <button id="pwr-apply" class="pwr-btn-primary" title="Apply to current page">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
              Apply
            </button>
            <button id="pwr-clear" class="pwr-btn-secondary" title="Clear all fields">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <button id="pwr-toggle" class="pwr-toggle" title="Minimize/Expand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        
        <div class="pwr-minimized" style="display: none;">
          <button id="pwr-expand" class="pwr-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            Patient: <span id="pwr-min-weight">--</span> <span id="pwr-min-unit">kg</span>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Add ribbon styles
   */
  function addRibbonStyles() {
    if (document.getElementById('pwr-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'pwr-styles';
    styles.textContent = `
      #${CONFIG.ribbonId} {
        position: ${CONFIG.position};
        bottom: ${CONFIG.bottom};
        left: ${CONFIG.left};
        right: ${CONFIG.right};
        height: ${CONFIG.height};
        background: ${CONFIG.colors.bg};
        border-top: 2px solid ${CONFIG.colors.primary};
        z-index: ${CONFIG.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
      }
      
      #${CONFIG.ribbonId}.minimized {
        height: auto;
        background: transparent;
        border: none;
        box-shadow: none;
      }
      
      .pwr-container {
        height: 100%;
        padding: 0 1rem;
        display: flex;
        align-items: center;
      }
      
      .pwr-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .pwr-minimized {
        padding: 0.5rem;
      }
      
      .pwr-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: ${CONFIG.colors.primary};
        font-weight: 600;
        font-size: 0.875rem;
        white-space: nowrap;
      }
      
      .pwr-field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .pwr-field label {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${CONFIG.colors.secondary};
        font-weight: 600;
      }
      
      .pwr-input-group {
        display: flex;
        gap: 0.25rem;
      }
      
      #pwr-weight {
        width: 70px;
        padding: 0.375rem 0.5rem;
        background: ${CONFIG.colors.inputBg};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 4px;
        color: ${CONFIG.colors.text};
        font-size: 0.875rem;
        text-align: right;
      }
      
      #pwr-weight:focus {
        outline: none;
        border-color: ${CONFIG.colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2);
      }
      
      #pwr-weight-unit,
      #pwr-species {
        padding: 0.375rem 0.5rem;
        background: ${CONFIG.colors.inputBg};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 4px;
        color: ${CONFIG.colors.text};
        font-size: 0.875rem;
        cursor: pointer;
      }
      
      #pwr-weight-unit:focus,
      #pwr-species:focus {
        outline: none;
        border-color: ${CONFIG.colors.primary};
      }
      
      #pwr-species {
        min-width: 100px;
      }
      
      .pwr-actions {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
      }
      
      .pwr-btn-primary,
      .pwr-btn-secondary {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .pwr-btn-primary {
        background: ${CONFIG.colors.primary};
        color: #0d1b2a;
      }
      
      .pwr-btn-primary:hover {
        background: #00ffb0;
        transform: translateY(-1px);
      }
      
      .pwr-btn-secondary {
        background: ${CONFIG.colors.inputBg};
        color: ${CONFIG.colors.text};
        border: 1px solid ${CONFIG.colors.border};
        padding: 0.5rem;
      }
      
      .pwr-btn-secondary:hover {
        background: ${CONFIG.colors.hover};
      }
      
      .pwr-toggle {
        background: none;
        border: none;
        color: ${CONFIG.colors.secondary};
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      .pwr-toggle:hover {
        background: ${CONFIG.colors.inputBg};
        color: ${CONFIG.colors.text};
      }
      
      /* Minimized state */
      .minimized .pwr-content {
        display: none;
      }
      
      .minimized .pwr-minimized {
        display: flex !important;
        justify-content: flex-end;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        #${CONFIG.ribbonId} {
          height: auto;
          padding: 0.5rem 0;
        }
        
        .pwr-content {
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0 0.5rem;
        }
        
        .pwr-label {
          width: 100%;
        }
        
        .pwr-actions {
          margin-left: 0;
          width: 100%;
          justify-content: flex-end;
        }
      }
      
      /* Animation for apply button */
      @keyframes pwr-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .pwr-applied {
        animation: pwr-pulse 0.3s ease;
      }
      
      /* Add padding to body to prevent content from being hidden behind ribbon */
      body {
        padding-bottom: ${CONFIG.height};
      }
      
      @media (max-width: 768px) {
        body {
          padding-bottom: 100px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Attach event listeners to ribbon
   */
  function attachRibbonEvents(ribbon) {
    const weightInput = ribbon.querySelector('#pwr-weight');
    const unitSelect = ribbon.querySelector('#pwr-weight-unit');
    const speciesSelect = ribbon.querySelector('#pwr-species');
    const applyBtn = ribbon.querySelector('#pwr-apply');
    const clearBtn = ribbon.querySelector('#pwr-clear');
    const toggleBtn = ribbon.querySelector('#pwr-toggle');
    const expandBtn = ribbon.querySelector('#pwr-expand');

    // Weight input change
    weightInput.addEventListener('input', (e) => {
      patientData.weight = e.target.value;
      savePatientData();
      updateMinimizedDisplay();
    });

    // Unit change
    unitSelect.addEventListener('change', (e) => {
      patientData.weightUnit = e.target.value;
      savePatientData();
      updateMinimizedDisplay();
    });

    // Species change
    speciesSelect.addEventListener('change', (e) => {
      patientData.species = e.target.value;
      savePatientData();
    });

    // Apply button
    applyBtn.addEventListener('click', () => {
      applyToPage();
      applyBtn.classList.add('pwr-applied');
      setTimeout(() => applyBtn.classList.remove('pwr-applied'), 300);
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
      patientData = {
        weight: '',
        weightUnit: 'kg',
        species: 'canine',
        timestamp: null
      };
      savePatientData();
      restoreValues(ribbon);
      updateMinimizedDisplay();
    });

    // Toggle minimize
    toggleBtn.addEventListener('click', () => {
      ribbon.classList.toggle('minimized');
      updateMinimizedDisplay();
    });

    // Expand from minimized
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        ribbon.classList.remove('minimized');
      });
    }
  }

  /**
   * Restore values to ribbon inputs
   */
  function restoreValues(ribbon) {
    const weightInput = ribbon.querySelector('#pwr-weight');
    const unitSelect = ribbon.querySelector('#pwr-weight-unit');
    const speciesSelect = ribbon.querySelector('#pwr-species');

    if (weightInput) weightInput.value = patientData.weight;
    if (unitSelect) unitSelect.value = patientData.weightUnit;
    if (speciesSelect) speciesSelect.value = patientData.species;
  }

  /**
   * Update minimized display
   */
  function updateMinimizedDisplay() {
    const minWeight = document.getElementById('pwr-min-weight');
    const minUnit = document.getElementById('pwr-min-unit');
    
    if (minWeight && minUnit) {
      minWeight.textContent = patientData.weight || '--';
      minUnit.textContent = patientData.weightUnit;
    }
  }

  /**
   * Apply patient data to page forms
   */
  function applyToPage() {
    if (!patientData.weight) {
      showNotification('Please enter a weight first', 'warning');
      return;
    }

    // Common weight input selectors
    const weightSelectors = [
      'input[name*="weight"]:not([type="hidden"])',
      'input[id*="weight"]:not([type="hidden"])',
      'input[placeholder*="weight" i]',
      'input[placeholder*="kg" i]',
      'input[placeholder*="lb" i]',
      '.weight-input',
      '#weight',
      '#patient-weight',
      '#body-weight'
    ];

    // Common species selectors
    const speciesSelectors = [
      'select[name*="species"]',
      'select[id*="species"]',
      'input[name*="species"][type="radio"]',
      '#species',
      '#animal-type',
      '#patient-species'
    ];

    let weightApplied = false;
    let speciesApplied = false;

    // Try to fill weight
    for (const selector of weightSelectors) {
      const inputs = document.querySelectorAll(selector);
      for (const input of inputs) {
        if (isVisible(input) && !input.readOnly && !input.disabled) {
          // Convert weight if needed
          let weight = parseFloat(patientData.weight);
          if (isNaN(weight)) continue;

          // Check if target expects different unit
          const targetUnit = detectUnit(input);
          if (targetUnit && targetUnit !== patientData.weightUnit) {
            weight = convertWeight(weight, patientData.weightUnit, targetUnit);
          }

          input.value = weight.toFixed(2).replace(/\.?0+$/, '');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          weightApplied = true;
          
          // Highlight the field briefly
          highlightField(input);
        }
      }
    }

    // Try to fill species
    for (const selector of speciesSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (!isVisible(el)) continue;

        if (el.tagName === 'SELECT') {
          const option = findSpeciesOption(el, patientData.species);
          if (option) {
            el.value = option.value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
            speciesApplied = true;
            highlightField(el);
          }
        } else if (el.type === 'radio') {
          if (matchesSpecies(el.value, patientData.species)) {
            el.checked = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
            speciesApplied = true;
          }
        }
      }
    }

    // Show notification
    if (weightApplied || speciesApplied) {
      const messages = [];
      if (weightApplied) messages.push('weight');
      if (speciesApplied) messages.push('species');
      showNotification(`Applied ${messages.join(' & ')} to page`, 'success');
    } else {
      showNotification('No matching fields found on this page', 'info');
    }
  }

  /**
   * Check if element is visible
   */
  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  /**
   * Detect expected unit from input
   */
  function detectUnit(input) {
    const text = (input.placeholder + ' ' + input.name + ' ' + input.id).toLowerCase();
    if (text.includes('lb') || text.includes('pound')) return 'lb';
    if (text.includes('kg') || text.includes('kilo')) return 'kg';
    return null;
  }

  /**
   * Convert weight between units
   */
  function convertWeight(value, from, to) {
    if (from === to) return value;
    if (from === 'kg' && to === 'lb') return value * 2.20462;
    if (from === 'lb' && to === 'kg') return value / 2.20462;
    return value;
  }

  /**
   * Find matching species option in select
   */
  function findSpeciesOption(select, species) {
    const speciesMap = {
      'canine': ['canine', 'dog', 'dogs', 'canis'],
      'feline': ['feline', 'cat', 'cats', 'felis'],
      'avian': ['avian', 'bird', 'birds', 'aves'],
      'rabbit': ['rabbit', 'rabbits', 'oryctolagus'],
      'ferret': ['ferret', 'ferrets', 'mustela'],
      'reptile': ['reptile', 'reptiles', 'herp'],
      'rodent': ['rodent', 'rodents', 'mouse', 'rat', 'hamster']
    };

    const aliases = speciesMap[species] || [species];
    
    for (const option of select.options) {
      const optionText = option.text.toLowerCase();
      const optionValue = option.value.toLowerCase();
      
      for (const alias of aliases) {
        if (optionText.includes(alias) || optionValue.includes(alias)) {
          return option;
        }
      }
    }
    
    return null;
  }

  /**
   * Check if value matches species
   */
  function matchesSpecies(value, species) {
    const value_lower = value.toLowerCase();
    const speciesMap = {
      'canine': ['canine', 'dog', 'dogs'],
      'feline': ['feline', 'cat', 'cats'],
      'avian': ['avian', 'bird', 'birds'],
      'rabbit': ['rabbit', 'rabbits'],
      'ferret': ['ferret', 'ferrets'],
      'reptile': ['reptile', 'reptiles'],
      'rodent': ['rodent', 'rodents', 'mouse', 'rat']
    };
    
    const aliases = speciesMap[species] || [species];
    return aliases.some(alias => value_lower.includes(alias));
  }

  /**
   * Highlight field briefly
   */
  function highlightField(el) {
    const originalTransition = el.style.transition;
    el.style.transition = 'all 0.3s ease';
    el.style.boxShadow = '0 0 0 3px rgba(0, 212, 170, 0.5)';
    
    setTimeout(() => {
      el.style.boxShadow = '';
      el.style.transition = originalTransition;
    }, 1000);
  }

  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.pwr-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `pwr-notification pwr-notification-${type}`;
    notification.textContent = message;
    
    const colors = {
      success: '#00d4aa',
      warning: '#ffb347',
      info: '#778da9',
      error: '#ff6b6b'
    };

    notification.style.cssText = `
      position: fixed;
      bottom: 70px;
      right: 1rem;
      background: ${CONFIG.colors.bg};
      color: ${type === 'success' ? colors.success : CONFIG.colors.text};
      padding: 0.75rem 1rem;
      border-radius: 4px;
      border-left: 3px solid ${colors[type] || colors.info};
      font-size: 0.875rem;
      z-index: ${CONFIG.zIndex + 1};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: pwr-slide-in 0.3s ease;
    `;

    // Add animation
    if (!document.getElementById('pwr-anim-styles')) {
      const animStyles = document.createElement('style');
      animStyles.id = 'pwr-anim-styles';
      animStyles.textContent = `
        @keyframes pwr-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(animStyles);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'pwr-slide-in 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Setup auto-fill when page loads
   */
  function setupAutoFill() {
    // Auto-fill after a short delay to ensure page is ready
    setTimeout(() => {
      if (patientData.weight && patientData.autoApply !== false) {
        applyToPage();
      }
    }, 500);
  }

  /**
   * Observe page changes for SPAs
   */
  function observePageChanges() {
    let lastUrl = location.href;
    
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        // Recreate ribbon on page change
        setTimeout(() => {
          const existing = document.getElementById(CONFIG.ribbonId);
          if (!existing) {
            createRibbon();
          }
        }, 100);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external use
  window.DVMReadyWeightRibbon = {
    getData: () => ({ ...patientData }),
    setData: (data) => {
      patientData = { ...patientData, ...data };
      savePatientData();
      const ribbon = document.getElementById(CONFIG.ribbonId);
      if (ribbon) restoreValues(ribbon);
    },
    apply: applyToPage,
    clear: () => {
      patientData = { weight: '', weightUnit: 'kg', species: 'canine', timestamp: null };
      savePatientData();
      const ribbon = document.getElementById(CONFIG.ribbonId);
      if (ribbon) restoreValues(ribbon);
    }
  };

})();
