/**
 * DVMReady - Persistent Patient Weight Ribbon
 * Stores weight in sessionStorage and auto-populates across all calculators
 */

class PatientWeightRibbon {
  constructor() {
    this.weight = this.getStoredWeight();
    this.species = this.getStoredSpecies();
    this.unit = this.getStoredUnit() || 'kg';
    this.init();
  }

  init() {
    this.createRibbon();
    this.attachEventListeners();
    this.populateCalculatorFields();
  }

  createRibbon() {
    const ribbon = document.createElement('div');
    ribbon.id = 'patient-weight-ribbon';
    ribbon.className = 'patient-ribbon';
    ribbon.innerHTML = `
      <div class="ribbon-container">
        <div class="ribbon-section">
          <label>Species:</label>
          <div class="species-toggle">
            <button class="species-btn ${this.species === 'dog' ? 'active' : ''}" data-species="dog">
              🐕 Dog
            </button>
            <button class="species-btn ${this.species === 'cat' ? 'active' : ''}" data-species="cat">
              🐈 Cat
            </button>
            <button class="species-btn ${this.species === 'exotic' ? 'active' : ''}" data-species="exotic">
              🦜 Exotic
            </button>
          </div>
        </div>
        <div class="ribbon-section">
          <label>Weight:</label>
          <div class="weight-input-group">
            <input type="number" id="ribbon-weight" value="${this.weight || ''}" 
                   placeholder="--" min="0" step="0.1">
            <div class="unit-toggle">
              <button class="unit-btn ${this.unit === 'kg' ? 'active' : ''}" data-unit="kg">kg</button>
              <button class="unit-btn ${this.unit === 'lb' ? 'active' : ''}" data-unit="lb">lb</button>
            </div>
          </div>
        </div>
        <div class="ribbon-section quick-presets">
          <button class="preset-btn" data-weight="2.5">2.5</button>
          <button class="preset-btn" data-weight="5">5</button>
          <button class="preset-btn" data-weight="10">10</button>
          <button class="preset-btn" data-weight="20">20</button>
          <button class="preset-btn" data-weight="30">30</button>
        </div>
        <button class="clear-btn" title="Clear">✕</button>
      </div>
    `;

    // Insert after header or at top of body
    const header = document.querySelector('header') || document.body.firstChild;
    header.parentNode.insertBefore(ribbon, header.nextSibling);
  }

  attachEventListeners() {
    // Weight input
    const weightInput = document.getElementById('ribbon-weight');
    weightInput.addEventListener('input', (e) => {
      this.setWeight(e.target.value);
      this.populateCalculatorFields();
    });

    // Species buttons
    document.querySelectorAll('.species-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setSpecies(btn.dataset.species);
        this.updateSpeciesUI();
        this.populateCalculatorFields();
      });
    });

    // Unit buttons
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setUnit(btn.dataset.unit);
        this.updateUnitUI();
        this.convertWeightDisplay();
      });
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const weight = btn.dataset.weight;
        weightInput.value = weight;
        this.setWeight(weight);
        this.populateCalculatorFields();
      });
    });

    // Clear button
    document.querySelector('.clear-btn').addEventListener('click', () => {
      this.clearWeight();
      weightInput.value = '';
      this.populateCalculatorFields();
    });
  }

  // Storage methods
  setWeight(weight) {
    this.weight = weight;
    sessionStorage.setItem('dvmready_patient_weight', weight);
  }

  getStoredWeight() {
    return sessionStorage.getItem('dvmready_patient_weight');
  }

  setSpecies(species) {
    this.species = species;
    sessionStorage.setItem('dvmready_patient_species', species);
  }

  getStoredSpecies() {
    return sessionStorage.getItem('dvmready_patient_species') || 'dog';
  }

  setUnit(unit) {
    this.unit = unit;
    sessionStorage.setItem('dvmready_weight_unit', unit);
  }

  getStoredUnit() {
    return sessionStorage.getItem('dvmready_weight_unit');
  }

  clearWeight() {
    this.weight = null;
    sessionStorage.removeItem('dvmready_patient_weight');
  }

  // UI updates
  updateSpeciesUI() {
    document.querySelectorAll('.species-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.species === this.species);
    });
  }

  updateUnitUI() {
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === this.unit);
    });
  }

  convertWeightDisplay() {
    const input = document.getElementById('ribbon-weight');
    if (!this.weight) return;
    
    let converted;
    if (this.unit === 'lb') {
      converted = parseFloat(this.weight) * 2.20462;
    } else {
      converted = parseFloat(this.weight) / 2.20462;
    }
    input.value = converted.toFixed(1);
  }

  // Auto-populate calculator fields
  populateCalculatorFields() {
    // Find all weight inputs on the page
    const weightInputs = document.querySelectorAll('input[name="weight"], input[id*="weight"], input[placeholder*="weight"]');
    weightInputs.forEach(input => {
      if (this.weight && !input.value) {
        input.value = this.weight;
        // Trigger change event for any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Find species selectors
    const speciesSelects = document.querySelectorAll('select[name="species"], select[id*="species"]');
    speciesSelects.forEach(select => {
      if (this.species) {
        const option = Array.from(select.options).find(opt => 
          opt.value.toLowerCase() === this.species.toLowerCase()
        );
        if (option) {
          select.value = option.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }
}

// CSS to include
const ribbonCSS = `
.patient-ribbon {
  background: linear-gradient(135deg, #1e3a4c 0%, #2d5a6b 100%);
  color: white;
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.ribbon-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.ribbon-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ribbon-section label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.species-toggle, .unit-toggle {
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.1);
  padding: 4px;
  border-radius: 8px;
}

.species-btn, .unit-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.species-btn:hover, .unit-btn:hover {
  background: rgba(255,255,255,0.1);
}

.species-btn.active, .unit-btn.active {
  background: #4ecdc4;
  color: #1a1a2e;
  font-weight: 600;
}

.weight-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

#ribbon-weight {
  width: 80px;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 16px;
  text-align: center;
}

#ribbon-weight::placeholder {
  color: rgba(255,255,255,0.4);
}

.quick-presets {
  display: flex;
  gap: 4px;
}

.preset-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: rgba(78, 205, 196, 0.3);
  border-color: #4ecdc4;
}

.clear-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: rgba(255,255,255,0.6);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(255,100,100,0.3);
  color: white;
}

@media (max-width: 768px) {
  .ribbon-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .ribbon-section {
    justify-content: space-between;
  }
}
`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add CSS
  const style = document.createElement('style');
  style.textContent = ribbonCSS;
  document.head.appendChild(style);
  
  // Initialize ribbon
  new PatientWeightRibbon();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PatientWeightRibbon;
}
