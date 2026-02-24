/**
 * DVMReady - Unified Calculator Framework
 * Provides common functionality for all calculators
 */

(function() {
  'use strict';

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  const STORAGE_PREFIX = 'dvmready_calc_';
  const LEGACY_STORAGE_PREFIX = 'dvmcalc_';
  
  const Utils = {
    // Weight conversions
    convertWeight: function(value, fromUnit, toUnit) {
      const conversions = {
        kg: { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 },
        g: { kg: 0.001, g: 1, lb: 0.00220462, oz: 0.035274 },
        lb: { kg: 0.453592, g: 453.592, lb: 1, oz: 16 },
        oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625, oz: 1 }
      };
      return value * (conversions[fromUnit]?.[toUnit] || 1);
    },
    
    // Volume conversions
    convertVolume: function(value, fromUnit, toUnit) {
      const conversions = {
        ml: { ml: 1, l: 0.001, oz: 0.033814, tsp: 0.202884 },
        l: { ml: 1000, l: 1, oz: 33.814, tsp: 202.884 },
        oz: { ml: 29.5735, l: 0.0295735, oz: 1, tsp: 6 },
        tsp: { ml: 4.92892, l: 0.00492892, oz: 0.166667, tsp: 1 }
      };
      return value * (conversions[fromUnit]?.[toUnit] || 1);
    },
    
    // Mass conversions for medications
    convertMass: function(value, fromUnit, toUnit) {
      const conversions = {
        mg: { mg: 1, g: 0.001, kg: 0.000001, mcg: 1000 },
        g: { mg: 1000, g: 1, kg: 0.001, mcg: 1000000 },
        kg: { mg: 1000000, g: 1000, kg: 1, mcg: 1000000000 },
        mcg: { mg: 0.001, g: 0.000001, kg: 0.000000001, mcg: 1 }
      };
      return value * (conversions[fromUnit]?.[toUnit] || 1);
    },
    
    // Format number with appropriate precision
    formatNumber: function(num, decimals = 2) {
      if (num === 0) return '0';
      if (num < 0.01) return num.toExponential(2);
      if (num < 1) return num.toFixed(3);
      if (num < 10) return num.toFixed(2);
      if (num < 100) return num.toFixed(1);
      return Math.round(num).toString();
    },
    
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Get URL parameters
    getUrlParam: function(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    },
    
    // Save to localStorage with error handling
    saveToStorage: function(key, value) {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('Failed to save to storage:', e);
        return false;
      }
    },
    
    // Load from localStorage
    loadFromStorage: function(key, defaultValue = null) {
      try {
        const primaryItem = localStorage.getItem(STORAGE_PREFIX + key);
        if (primaryItem) {
          return JSON.parse(primaryItem);
        }
        const legacyItem = localStorage.getItem(LEGACY_STORAGE_PREFIX + key);
        if (legacyItem) {
          const parsed = JSON.parse(legacyItem);
          localStorage.setItem(STORAGE_PREFIX + key, legacyItem);
          return parsed;
        }
        return defaultValue;
      } catch (e) {
        console.warn('Failed to load from storage:', e);
        return defaultValue;
      }
    },
    
    // Copy to clipboard
    copyToClipboard: async function(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    }
  };

  // ==========================================
  // CALCULATOR BASE CLASS
  // ==========================================
  
  class Calculator {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Calculator container #${containerId} not found`);
        return;
      }
      
      this.options = {
        mode: 'basic', // 'basic' or 'advanced'
        autoCalculate: true,
        saveHistory: true,
        ...options
      };
      
      this.currentMode = this.options.mode;
      this.history = Utils.loadFromStorage('history', []);
      
      this.init();
    }
    
    init() {
      this.setupModeToggle();
      this.setupUnitConverters();
      this.setupExpandableSections();
      this.loadPreferences();
      
      if (this.options.autoCalculate) {
        this.setupAutoCalculate();
      }
    }
    
    setupModeToggle() {
      const modeButtons = this.container.querySelectorAll('.calc-mode-btn');
      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          this.switchMode(mode);
        });
      });
    }
    
    switchMode(mode) {
      this.currentMode = mode;
      
      // Update button states
      this.container.querySelectorAll('.calc-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });
      
      // Show/hide mode sections
      const basicSection = this.container.querySelector('.calc-section--basic');
      const advancedSection = this.container.querySelector('.calc-section--advanced');
      
      if (basicSection) {
        basicSection.style.display = mode === 'basic' ? 'block' : 'none';
      }
      if (advancedSection) {
        advancedSection.style.display = mode === 'advanced' ? 'block' : 'none';
      }
      
      // Save preference
      Utils.saveToStorage('preferredMode', mode);
      
      // Trigger mode change event
      this.container.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }));
    }
    
    setupUnitConverters() {
      // Handle unit toggle buttons
      this.container.querySelectorAll('.calc-unit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const wrapper = e.target.closest('.calc-input-wrapper');
          const input = wrapper.querySelector('.calc-input');
          const currentUnit = e.target.dataset.unit;
          const previousUnit = wrapper.querySelector('.calc-unit-btn.active')?.dataset.unit;
          
          // Update active state
          wrapper.querySelectorAll('.calc-unit-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          
          // Convert value if exists
          if (input.value && previousUnit && currentUnit !== previousUnit) {
            const currentValue = parseFloat(input.value);
            if (!isNaN(currentValue)) {
              // Determine conversion type based on input context
              const conversionType = input.dataset.conversion || 'weight';
              let newValue;
              
              switch (conversionType) {
                case 'weight':
                  newValue = Utils.convertWeight(currentValue, previousUnit, currentUnit);
                  break;
                case 'volume':
                  newValue = Utils.convertVolume(currentValue, previousUnit, currentUnit);
                  break;
                case 'mass':
                  newValue = Utils.convertMass(currentValue, previousUnit, currentUnit);
                  break;
                default:
                  newValue = currentValue;
              }
              
              input.value = Utils.formatNumber(newValue);
            }
          }
          
          // Update data attribute
          input.dataset.unit = currentUnit;
          
          // Trigger calculation if auto-calculate is enabled
          if (this.options.autoCalculate) {
            this.calculate();
          }
        });
      });
    }
    
    setupExpandableSections() {
      this.container.querySelectorAll('.calc-details__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const details = trigger.closest('.calc-details');
          details.classList.toggle('open');
          const isOpen = details.classList.contains('open');
          trigger.setAttribute('aria-expanded', isOpen);
        });
      });
    }
    
    setupAutoCalculate() {
      const inputs = this.container.querySelectorAll('.calc-input, .calc-select');
      inputs.forEach(input => {
        input.addEventListener('input', Utils.debounce(() => {
          this.calculate();
        }, 300));
      });
    }
    
    loadPreferences() {
      // Load saved mode preference
      const savedMode = Utils.loadFromStorage('preferredMode');
      if (savedMode && savedMode !== this.currentMode) {
        this.switchMode(savedMode);
      }
    }
    
    // Calculate method - to be overridden by specific calculators
    calculate() {
      console.warn('Calculate method should be overridden');
    }
    
    // Display results
    showResults(results) {
      const resultsContainer = this.container.querySelector('.calc-results');
      if (!resultsContainer) return;
      
      // Clear previous results
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'block';
      
      // Build results HTML
      results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'calc-result-card';
        
        let html = `
          <p class="calc-result-card__label">${result.label}</p>
          <p class="calc-result-card__value">
            ${result.value}
            <span class="calc-result-card__unit">${result.unit}</span>
          </p>
        `;
        
        if (result.range) {
          html += `<p class="calc-result-card__range">✓ Within range: ${result.range}</p>`;
        }
        
        if (result.warning) {
          html += `<div class="calc-result-card__warning">⚠️ ${result.warning}</div>`;
        }
        
        if (result.error) {
          html += `<div class="calc-result-card__error">❌ ${result.error}</div>`;
        }
        
        card.innerHTML = html;
        resultsContainer.appendChild(card);
      });
      
      // Add action buttons
      const actions = document.createElement('div');
      actions.className = 'calc-actions';
      actions.innerHTML = `
        <button class="calc-action-btn" onclick="this.closest('.calc-container').dispatchEvent(new CustomEvent('copyresults'))">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy Results
        </button>
        <button class="calc-action-btn" onclick="window.print()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print
        </button>
      `;
      resultsContainer.appendChild(actions);
      
      // Scroll to results on mobile
      if (window.innerWidth < 768) {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    
    // Save calculation to history
    saveToHistory(data) {
      if (!this.options.saveHistory) return;
      
      const entry = {
        timestamp: new Date().toISOString(),
        calculator: this.constructor.name,
        data: data
      };
      
      this.history.unshift(entry);
      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50);
      }
      
      Utils.saveToStorage('history', this.history);
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `pc-toast pc-toast--${type}`;
      toast.textContent = message;
      
      const container = document.querySelector('.pc-toast-container') || document.body;
      container.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // ==========================================
  // SPECIES DATA
  // ==========================================
  
  const SpeciesData = {
    dog: {
      name: 'Dog',
      icon: '🐕',
      weightRange: { min: 0.5, max: 100, unit: 'kg' },
      commonWeights: [
        { label: 'Toy', weight: 2.5, unit: 'kg' },
        { label: 'Small', weight: 7, unit: 'kg' },
        { label: 'Medium', weight: 20, unit: 'kg' },
        { label: 'Large', weight: 35, unit: 'kg' },
        { label: 'Giant', weight: 55, unit: 'kg' }
      ]
    },
    cat: {
      name: 'Cat',
      icon: '🐈',
      weightRange: { min: 1, max: 15, unit: 'kg' },
      commonWeights: [
        { label: 'Kitten', weight: 1, unit: 'kg' },
        { label: 'Small', weight: 2.5, unit: 'kg' },
        { label: 'Average', weight: 4, unit: 'kg' },
        { label: 'Large', weight: 6, unit: 'kg' }
      ]
    },
    exotic: {
      name: 'Exotic',
      icon: '🦜',
      weightRange: { min: 0.01, max: 50, unit: 'kg' },
      commonWeights: [
        { label: 'Bird', weight: 0.3, unit: 'kg' },
        { label: 'Rabbit', weight: 2, unit: 'kg' },
        { label: 'Ferret', weight: 1, unit: 'kg' }
      ]
    }
  };

  // ==========================================
  // EXPORT
  // ==========================================
  
  window.CalcFramework = {
    Calculator,
    Utils,
    SpeciesData
  };

  // Auto-initialize calculators with data-calc attribute
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-calc]').forEach(el => {
      const calcType = el.dataset.calc;
      console.log(`Calculator ready: ${calcType}`);
    });
  });

})();
