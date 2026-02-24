/**
 * DVMReady Quick Calculate Widget
 * Floating mini-calculator for instant calculations without navigation
 * Competitive feature matching DVMCalc.com
 * 
 * @version 1.0.0
 * @author DVMReady Development Team
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'dvmready_quickcalc_state',
    widgetId: 'quick-calc-widget',
    buttonId: 'quick-calc-button',
    zIndex: 9998,
    // Colors matching DVMReady dark theme
    colors: {
      bg: '#0d1b2a',
      bgSecondary: '#1b263b',
      border: '#1b3a4b',
      text: '#e0e1dd',
      primary: '#00d4aa',
      secondary: '#778da9',
      accent: '#ff6b6b',
      warning: '#ffb347',
      success: '#00d4aa'
    }
  };

  // Widget state
  let isOpen = false;
  let activeTab = 'drug';
  let position = { x: null, y: null };

  // Drug database (subset for quick calc)
  const quickDrugs = [
    { name: 'Acepromazine', doseRange: '0.01-0.05 mg/kg', route: 'IV/IM/SC', notes: 'Sedation' },
    { name: 'Atropine', doseRange: '0.02-0.04 mg/kg', route: 'IV/IM/SC', notes: 'Bradycardia' },
    { name: 'Butorphanol', doseRange: '0.2-0.4 mg/kg', route: 'IV/IM/SC', notes: 'Analgesia/sedation' },
    { name: 'Carprofen', doseRange: '4.4 mg/kg', route: 'SC/PO', notes: 'NSAID (dogs)' },
    { name: 'Cefazolin', doseRange: '22 mg/kg', route: 'IV', notes: 'Antibiotic' },
    { name: 'Dexmedetomidine', doseRange: '0.5-1 mcg/kg', route: 'IV/IM', notes: 'Sedation' },
    { name: 'Diazepam', doseRange: '0.5-1 mg/kg', route: 'IV', notes: 'Seizures/sedation' },
    { name: 'Diphenhydramine', doseRange: '2-4 mg/kg', route: 'IM/PO', notes: 'Antihistamine' },
    { name: 'Hydromorphone', doseRange: '0.05-0.2 mg/kg', route: 'IV/IM/SC', notes: 'Analgesia' },
    { name: 'Ketamine', doseRange: '3-10 mg/kg', route: 'IV', notes: 'Anesthesia' },
    { name: 'Lidocaine (dog)', doseRange: '2-4 mg/kg', route: 'IV', notes: 'Antiarrhythmic' },
    { name: 'Lidocaine CRI (dog)', doseRange: '25-50 mcg/kg/min', route: 'CRI', notes: 'Analgesia' },
    { name: 'Maropitant', doseRange: '1 mg/kg', route: 'SC', notes: 'Antiemetic' },
    { name: 'Meloxicam', doseRange: '0.2 mg/kg', route: 'SC/PO', notes: 'NSAID' },
    { name: 'Midazolam', doseRange: '0.1-0.3 mg/kg', route: 'IV/IM', notes: 'Sedation/seizures' },
    { name: 'Morphine', doseRange: '0.5-1 mg/kg', route: 'IM/SC', notes: 'Analgesia' },
    { name: 'Propofol', doseRange: '3-6 mg/kg', route: 'IV', notes: 'Induction' },
    { name: 'Robenacoxib', doseRange: '1-2 mg/kg', route: 'SC/PO', notes: 'NSAID (cats)' },
    { name: 'Trazodone', doseRange: '5-7 mg/kg', route: 'PO', notes: 'Anxiolytic' },
    { name: 'Tramadol', doseRange: '2-5 mg/kg', route: 'PO', notes: 'Analgesia' }
  ];

  // Toxins for quick calc
  const quickToxins = [
    { name: 'Chocolate', calcType: 'theobromine', threshold: '20 mg/kg' },
    { name: 'Xylitol', calcType: 'xylitol', threshold: '0.1 g/kg (dogs)' },
    { name: 'Ethylene Glycol', calcType: 'eg', threshold: '0.1 mL/kg' },
    { name: 'Ibuprofen', calcType: 'nsaid', threshold: '50 mg/kg' },
    { name: 'Acetaminophen', calcType: 'acetaminophen', threshold: '50-100 mg/kg' },
    { name: 'Grapes/Raisins', calcType: 'grape', threshold: '0.7 g/kg' }
  ];

  /**
   * Initialize widget
   */
  function init() {
    loadState();
    createButton();
    addStyles();
    
    console.log('[DVMReady] Quick Calculate Widget initialized');
  }

  /**
   * Load saved state
   */
  function loadState() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        activeTab = state.activeTab || 'drug';
        position = state.position || { x: null, y: null };
      }
    } catch (e) {
      console.warn('[DVMReady] Could not load quick calc state:', e);
    }
  }

  /**
   * Save state
   */
  function saveState() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify({
        activeTab,
        position
      }));
    } catch (e) {
      console.warn('[DVMReady] Could not save quick calc state:', e);
    }
  }

  /**
   * Create floating button
   */
  function createButton() {
    if (document.getElementById(CONFIG.buttonId)) return;

    const button = document.createElement('button');
    button.id = CONFIG.buttonId;
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="12" y2="14"/>
        <circle cx="17" cy="17" r="3" fill="${CONFIG.colors.primary}" stroke="none"/>
      </svg>
      <span class="qc-btn-text">Quick Calc</span>
    `;
    
    button.onclick = toggleWidget;
    document.body.appendChild(button);
  }

  /**
   * Toggle widget visibility
   */
  function toggleWidget() {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  /**
   * Open widget
   */
  function openWidget() {
    if (!document.getElementById(CONFIG.widgetId)) {
      createWidget();
    }
    
    const widget = document.getElementById(CONFIG.widgetId);
    widget.style.display = 'block';
    
    // Restore position if saved
    if (position.x !== null && position.y !== null) {
      widget.style.left = position.x + 'px';
      widget.style.top = position.y + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    }
    
    // Animate in
    requestAnimationFrame(() => {
      widget.style.opacity = '1';
      widget.style.transform = 'scale(1)';
    });
    
    isOpen = true;
    
    // Load saved values
    loadPatientWeight();
  }

  /**
   * Close widget
   */
  function closeWidget() {
    const widget = document.getElementById(CONFIG.widgetId);
    if (widget) {
      widget.style.opacity = '0';
      widget.style.transform = 'scale(0.95)';
      setTimeout(() => {
        widget.style.display = 'none';
      }, 200);
    }
    isOpen = false;
  }

  /**
   * Create widget DOM
   */
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = CONFIG.widgetId;
    widget.innerHTML = getWidgetHTML();
    document.body.appendChild(widget);

    // Add drag functionality
    makeDraggable(widget);

    // Attach events
    attachWidgetEvents(widget);

    // Switch to saved tab
    switchTab(activeTab);
  }

  /**
   * Get widget HTML
   */
  function getWidgetHTML() {
    return `
      <div class="qc-header">
        <h3>Quick Calculate</h3>
        <button class="qc-close" title="Close">×</button>
      </div>
      
      <div class="qc-tabs">
        <button class="qc-tab ${activeTab === 'drug' ? 'active' : ''}" data-tab="drug">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
            <path d="M8.5 8.5l7 7"/>
          </svg>
          Drug
        </button>
        <button class="qc-tab ${activeTab === 'fluid' ? 'active' : ''}" data-tab="fluid">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
          Fluid
        </button>
        <button class="qc-tab ${activeTab === 'toxin' ? 'active' : ''}" data-tab="toxin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4"/>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          </svg>
          Toxin
        </button>
      </div>
      
      <div class="qc-body">
        <!-- Drug Tab -->
        <div class="qc-panel ${activeTab === 'drug' ? 'active' : ''}" data-panel="drug">
          <div class="qc-input-group">
            <label>Weight</label>
            <div class="qc-input-row">
              <input type="number" id="qc-drug-weight" placeholder="0.0" step="0.1" min="0.1">
              <select id="qc-drug-unit">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          
          <div class="qc-input-group">
            <label>Drug</label>
            <select id="qc-drug-select">
              <option value="">Select drug...</option>
              ${quickDrugs.map((d, i) => `<option value="${i}">${d.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="qc-drug-info" id="qc-drug-info"></div>
          
          <div class="qc-input-group">
            <label>Dose (mg/kg)</label>
            <input type="number" id="qc-drug-dose" placeholder="0.0" step="0.01" min="0">
          </div>
          
          <div class="qc-input-group">
            <label>Concentration (mg/mL)</label>
            <input type="number" id="qc-drug-conc" placeholder="0.0" step="0.1" min="0">
          </div>
          
          <button class="qc-calc-btn" id="qc-drug-calc">Calculate Dose</button>
          
          <div class="qc-result" id="qc-drug-result"></div>
        </div>
        
        <!-- Fluid Tab -->
        <div class="qc-panel ${activeTab === 'fluid' ? 'active' : ''}" data-panel="fluid">
          <div class="qc-input-group">
            <label>Weight</label>
            <div class="qc-input-row">
              <input type="number" id="qc-fluid-weight" placeholder="0.0" step="0.1" min="0.1">
              <select id="qc-fluid-unit">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          
          <div class="qc-input-group">
            <label>% Dehydration</label>
            <input type="number" id="qc-fluid-dehydration" placeholder="5" step="0.5" min="0" max="15">
          </div>
          
          <div class="qc-input-group">
            <label>Ongoing Losses (mL)</label>
            <input type="number" id="qc-fluid-losses" placeholder="0" step="10" min="0">
          </div>
          
          <div class="qc-input-group">
            <label>Maintenance Rate</label>
            <select id="qc-fluid-rate">
              <option value="50">Standard (50 mL/kg/day)</option>
              <option value="60">Cat (60 mL/kg/day)</option>
              <option value="75">Neonate (75 mL/kg/day)</option>
            </select>
          </div>
          
          <button class="qc-calc-btn" id="qc-fluid-calc">Calculate Fluids</button>
          
          <div class="qc-result" id="qc-fluid-result"></div>
        </div>
        
        <!-- Toxin Tab -->
        <div class="qc-panel ${activeTab === 'toxin' ? 'active' : ''}" data-panel="toxin">
          <div class="qc-input-group">
            <label>Toxin</label>
            <select id="qc-toxin-select">
              <option value="">Select toxin...</option>
              ${quickToxins.map((t, i) => `<option value="${i}">${t.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="qc-toxin-info" id="qc-toxin-info"></div>
          
          <div class="qc-input-group">
            <label>Weight</label>
            <div class="qc-input-row">
              <input type="number" id="qc-toxin-weight" placeholder="0.0" step="0.1" min="0.1">
              <select id="qc-toxin-unit">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          
          <div class="qc-input-group" id="qc-toxin-amount-group">
            <label id="qc-toxin-amount-label">Amount Ingested</label>
            <input type="number" id="qc-toxin-amount" placeholder="0" step="0.1" min="0">
            <small id="qc-toxin-unit-label">grams</small>
          </div>
          
          <button class="qc-calc-btn" id="qc-toxin-calc">Calculate Toxicity</button>
          
          <div class="qc-result" id="qc-toxin-result"></div>
        </div>
      </div>
    `;
  }

  /**
   * Add widget styles
   */
  function addStyles() {
    if (document.getElementById('qc-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'qc-styles';
    styles.textContent = `
      /* Floating Button */
      #${CONFIG.buttonId} {
        position: fixed;
        right: 1.5rem;
        bottom: 80px;
        z-index: ${CONFIG.zIndex};
        background: ${CONFIG.colors.primary};
        color: #0d1b2a;
        border: none;
        border-radius: 50px;
        padding: 0.75rem 1.25rem;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 212, 170, 0.4);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
      }
      
      #${CONFIG.buttonId}:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(0, 212, 170, 0.5);
      }
      
      .qc-btn-text {
        display: inline;
      }
      
      @media (max-width: 480px) {
        #${CONFIG.buttonId} {
          padding: 0.75rem;
        }
        .qc-btn-text {
          display: none;
        }
      }
      
      /* Widget */
      #${CONFIG.widgetId} {
        position: fixed;
        right: 1.5rem;
        bottom: 140px;
        width: 320px;
        max-height: 80vh;
        background: ${CONFIG.colors.bg};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        z-index: ${CONFIG.zIndex};
        display: none;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.2s ease, transform 0.2s ease;
        overflow: hidden;
      }
      
      /* Header */
      .qc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: ${CONFIG.colors.bgSecondary};
        border-bottom: 1px solid ${CONFIG.colors.border};
        cursor: move;
      }
      
      .qc-header h3 {
        margin: 0;
        font-size: 1rem;
        color: ${CONFIG.colors.text};
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .qc-close {
        background: none;
        border: none;
        color: ${CONFIG.colors.secondary};
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      .qc-close:hover {
        background: ${CONFIG.colors.border};
        color: ${CONFIG.colors.text};
      }
      
      /* Tabs */
      .qc-tabs {
        display: flex;
        border-bottom: 1px solid ${CONFIG.colors.border};
      }
      
      .qc-tab {
        flex: 1;
        padding: 0.75rem 0.5rem;
        background: none;
        border: none;
        color: ${CONFIG.colors.secondary};
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        transition: all 0.2s ease;
      }
      
      .qc-tab:hover {
        color: ${CONFIG.colors.text};
        background: ${CONFIG.colors.bgSecondary};
      }
      
      .qc-tab.active {
        color: ${CONFIG.colors.primary};
        border-bottom: 2px solid ${CONFIG.colors.primary};
      }
      
      /* Body */
      .qc-body {
        padding: 1rem;
        max-height: calc(80vh - 120px);
        overflow-y: auto;
      }
      
      /* Panels */
      .qc-panel {
        display: none;
      }
      
      .qc-panel.active {
        display: block;
        animation: qc-fade-in 0.2s ease;
      }
      
      @keyframes qc-fade-in {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Input Groups */
      .qc-input-group {
        margin-bottom: 1rem;
      }
      
      .qc-input-group label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        color: ${CONFIG.colors.secondary};
        margin-bottom: 0.375rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .qc-input-row {
        display: flex;
        gap: 0.5rem;
      }
      
      .qc-input-group input,
      .qc-input-group select {
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: ${CONFIG.colors.bgSecondary};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 6px;
        color: ${CONFIG.colors.text};
        font-size: 0.875rem;
        transition: all 0.2s ease;
      }
      
      .qc-input-group input:focus,
      .qc-input-group select:focus {
        outline: none;
        border-color: ${CONFIG.colors.primary};
        box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
      }
      
      .qc-input-row input {
        flex: 1;
      }
      
      .qc-input-row select {
        width: auto;
        min-width: 60px;
      }
      
      .qc-input-group small {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: ${CONFIG.colors.secondary};
      }
      
      /* Drug Info */
      .qc-drug-info {
        background: ${CONFIG.colors.bgSecondary};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 6px;
        padding: 0.75rem;
        margin-bottom: 1rem;
        font-size: 0.8rem;
        display: none;
      }
      
      .qc-drug-info.show {
        display: block;
      }
      
      .qc-drug-info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }
      
      .qc-drug-info-label {
        color: ${CONFIG.colors.secondary};
      }
      
      .qc-drug-info-value {
        color: ${CONFIG.colors.primary};
        font-weight: 500;
      }
      
      /* Toxin Info */
      .qc-toxin-info {
        background: ${CONFIG.colors.bgSecondary};
        border-left: 3px solid ${CONFIG.colors.warning};
        border-radius: 0 6px 6px 0;
        padding: 0.75rem;
        margin-bottom: 1rem;
        font-size: 0.8rem;
        display: none;
      }
      
      .qc-toxin-info.show {
        display: block;
      }
      
      /* Calc Button */
      .qc-calc-btn {
        width: 100%;
        padding: 0.75rem;
        background: ${CONFIG.colors.primary};
        color: #0d1b2a;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 0.5rem;
      }
      
      .qc-calc-btn:hover {
        background: #00ffb0;
        transform: translateY(-1px);
      }
      
      /* Results */
      .qc-result {
        margin-top: 1rem;
        padding: 1rem;
        background: ${CONFIG.colors.bgSecondary};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 6px;
        display: none;
      }
      
      .qc-result.show {
        display: block;
        animation: qc-fade-in 0.3s ease;
      }
      
      .qc-result-title {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${CONFIG.colors.secondary};
        margin-bottom: 0.5rem;
      }
      
      .qc-result-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: ${CONFIG.colors.primary};
      }
      
      .qc-result-detail {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid ${CONFIG.colors.border};
        font-size: 0.8rem;
        color: ${CONFIG.colors.text};
      }
      
      .qc-result-detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }
      
      .qc-result-alert {
        margin-top: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }
      
      .qc-result-alert.success {
        background: rgba(0, 212, 170, 0.1);
        color: ${CONFIG.colors.success};
        border: 1px solid rgba(0, 212, 170, 0.3);
      }
      
      .qc-result-alert.warning {
        background: rgba(255, 179, 71, 0.1);
        color: ${CONFIG.colors.warning};
        border: 1px solid rgba(255, 179, 71, 0.3);
      }
      
      .qc-result-alert.danger {
        background: rgba(255, 107, 107, 0.1);
        color: ${CONFIG.colors.accent};
        border: 1px solid rgba(255, 107, 107, 0.3);
      }
      
      /* Responsive */
      @media (max-width: 480px) {
        #${CONFIG.widgetId} {
          left: 0.5rem;
          right: 0.5rem;
          bottom: 80px;
          width: auto;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Attach widget events
   */
  function attachWidgetEvents(widget) {
    // Close button
    widget.querySelector('.qc-close').onclick = closeWidget;

    // Tab switching
    widget.querySelectorAll('.qc-tab').forEach(tab => {
      tab.onclick = () => switchTab(tab.dataset.tab);
    });

    // Drug select
    const drugSelect = widget.querySelector('#qc-drug-select');
    drugSelect.onchange = () => {
      const drug = quickDrugs[drugSelect.value];
      const infoDiv = widget.querySelector('#qc-drug-info');
      
      if (drug) {
        infoDiv.innerHTML = `
          <div class="qc-drug-info-row">
            <span class="qc-drug-info-label">Dose Range:</span>
            <span class="qc-drug-info-value">${drug.doseRange}</span>
          </div>
          <div class="qc-drug-info-row">
            <span class="qc-drug-info-label">Route:</span>
            <span class="qc-drug-info-value">${drug.route}</span>
          </div>
          <div class="qc-drug-info-row">
            <span class="qc-drug-info-label">Notes:</span>
            <span class="qc-drug-info-value">${drug.notes}</span>
          </div>
        `;
        infoDiv.classList.add('show');
        
        // Auto-fill dose from range (use midpoint or low end)
        const doseMatch = drug.doseRange.match(/([\d.]+)/);
        if (doseMatch) {
          widget.querySelector('#qc-drug-dose').value = doseMatch[1];
        }
      } else {
        infoDiv.classList.remove('show');
      }
    };

    // Toxin select
    const toxinSelect = widget.querySelector('#qc-toxin-select');
    toxinSelect.onchange = () => {
      const toxin = quickToxins[toxinSelect.value];
      const infoDiv = widget.querySelector('#qc-toxin-info');
      
      if (toxin) {
        infoDiv.innerHTML = `
          <strong>Toxic threshold:</strong> ${toxin.threshold}
        `;
        infoDiv.classList.add('show');
      } else {
        infoDiv.classList.remove('show');
      }
    };

    // Calculate buttons
    widget.querySelector('#qc-drug-calc').onclick = calculateDrug;
    widget.querySelector('#qc-fluid-calc').onclick = calculateFluid;
    widget.querySelector('#qc-toxin-calc').onclick = calculateToxin;

    // Enter key triggers calculation
    widget.querySelectorAll('input').forEach(input => {
      input.onkeypress = (e) => {
        if (e.key === 'Enter') {
          if (activeTab === 'drug') calculateDrug();
          if (activeTab === 'fluid') calculateFluid();
          if (activeTab === 'toxin') calculateToxin();
        }
      };
    });
  }

  /**
   * Switch tab
   */
  function switchTab(tab) {
    activeTab = tab;
    saveState();

    const widget = document.getElementById(CONFIG.widgetId);
    if (!widget) return;

    // Update tabs
    widget.querySelectorAll('.qc-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Update panels
    widget.querySelectorAll('.qc-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.panel === tab);
    });
  }

  /**
   * Load patient weight from ribbon or storage
   */
  function loadPatientWeight() {
    try {
      const ribbonData = sessionStorage.getItem('dvmready_patient_data');
      if (ribbonData) {
        const data = JSON.parse(ribbonData);
        if (data.weight) {
          document.getElementById('qc-drug-weight').value = data.weight;
          document.getElementById('qc-drug-unit').value = data.weightUnit;
          document.getElementById('qc-fluid-weight').value = data.weight;
          document.getElementById('qc-fluid-unit').value = data.weightUnit;
          document.getElementById('qc-toxin-weight').value = data.weight;
          document.getElementById('qc-toxin-unit').value = data.weightUnit;
        }
      }
    } catch (e) {
      console.warn('[DVMReady] Could not load patient weight:', e);
    }
  }

  /**
   * Calculate drug dose
   */
  function calculateDrug() {
    const weight = parseFloat(document.getElementById('qc-drug-weight').value);
    const unit = document.getElementById('qc-drug-unit').value;
    const dose = parseFloat(document.getElementById('qc-drug-dose').value);
    const conc = parseFloat(document.getElementById('qc-drug-conc').value);

    if (!weight || !dose) {
      showResult('drug', 'Please enter weight and dose', 'error');
      return;
    }

    // Convert weight to kg
    const weightKg = unit === 'lb' ? weight / 2.20462 : weight;

    // Calculate total dose
    const totalDose = weightKg * dose; // mg

    // Calculate volume if concentration provided
    let volume = null;
    if (conc && conc > 0) {
      volume = totalDose / conc; // mL
    }

    // Display result
    let html = `
      <div class="qc-result-title">Total Dose</div>
      <div class="qc-result-value">${totalDose.toFixed(2)} mg</div>
    `;

    if (volume !== null) {
      html += `
        <div class="qc-result-detail">
          <div class="qc-result-detail-row">
            <span>Volume to administer:</span>
            <strong>${volume.toFixed(2)} mL</strong>
          </div>
          <div class="qc-result-detail-row">
            <span>Concentration:</span>
            <span>${conc} mg/mL</span>
          </div>
        </div>
      `;
    }

    html += `
      <div class="qc-result-detail">
        <div class="qc-result-detail-row">
          <span>Patient weight:</span>
          <span>${weightKg.toFixed(2)} kg</span>
        </div>
        <div class="qc-result-detail-row">
          <span>Dose rate:</span>
          <span>${dose} mg/kg</span>
        </div>
      </div>
    `;

    showResult('drug', html, 'success');
  }

  /**
   * Calculate fluid needs
   */
  function calculateFluid() {
    const weight = parseFloat(document.getElementById('qc-fluid-weight').value);
    const unit = document.getElementById('qc-fluid-unit').value;
    const dehydration = parseFloat(document.getElementById('qc-fluid-dehydration').value) || 0;
    const losses = parseFloat(document.getElementById('qc-fluid-losses').value) || 0;
    const maintenanceRate = parseFloat(document.getElementById('qc-fluid-rate').value);

    if (!weight) {
      showResult('fluid', 'Please enter weight', 'error');
      return;
    }

    // Convert weight to kg
    const weightKg = unit === 'lb' ? weight / 2.20462 : weight;

    // Calculate fluid needs
    const deficit = weightKg * dehydration * 10; // mL (1% = 10 mL/kg)
    const maintenance = weightKg * maintenanceRate; // mL/day
    const total24h = deficit + maintenance + losses;
    const hourlyRate = total24h / 24;

    // Display result
    const html = `
      <div class="qc-result-title">24-Hour Fluid Plan</div>
      <div class="qc-result-value">${total24h.toFixed(0)} mL</div>
      <div class="qc-result-detail">
        <div class="qc-result-detail-row">
          <span>Hourly rate:</span>
          <strong>${hourlyRate.toFixed(1)} mL/hr</strong>
        </div>
        <div class="qc-result-detail-row">
          <span>Deficit replacement:</span>
          <span>${deficit.toFixed(0)} mL (${dehydration}%)</span>
        </div>
        <div class="qc-result-detail-row">
          <span>Maintenance:</span>
          <span>${maintenance.toFixed(0)} mL/day</span>
        </div>
        ${losses > 0 ? `
        <div class="qc-result-detail-row">
          <span>Ongoing losses:</span>
          <span>${losses.toFixed(0)} mL</span>
        </div>
        ` : ''}
      </div>
    `;

    showResult('fluid', html, 'success');
  }

  /**
   * Calculate toxicity
   */
  function calculateToxin() {
    const toxinIndex = document.getElementById('qc-toxin-select').value;
    const weight = parseFloat(document.getElementById('qc-toxin-weight').value);
    const unit = document.getElementById('qc-toxin-unit').value;
    const amount = parseFloat(document.getElementById('qc-toxin-amount').value);

    if (!toxinIndex || !weight || !amount) {
      showResult('toxin', 'Please fill all fields', 'error');
      return;
    }

    const toxin = quickToxins[toxinIndex];
    const weightKg = unit === 'lb' ? weight / 2.20462 : weight;
    const dose = amount / weightKg; // g/kg or mg/kg depending on toxin

    // Determine risk level (simplified)
    let riskLevel, alertClass, message;
    
    if (toxin.calcType === 'chocolate') {
      // Theobromine: <20 mild, 20-40 moderate, >40 severe
      if (dose < 20) {
        riskLevel = 'low';
        alertClass = 'success';
        message = 'Likely mild signs - monitor';
      } else if (dose < 40) {
        riskLevel = 'moderate';
        alertClass = 'warning';
        message = 'Moderate toxicity - treatment recommended';
      } else {
        riskLevel = 'high';
        alertClass = 'danger';
        message = 'Severe toxicity - immediate treatment!';
      }
    } else if (toxin.calcType === 'xylitol') {
      // Xylitol: >0.1 g/kg can cause hypoglycemia
      if (dose < 0.1) {
        riskLevel = 'low';
        alertClass = 'success';
        message = 'Below hypoglycemia threshold';
      } else if (dose < 0.5) {
        riskLevel = 'moderate';
        alertClass = 'warning';
        message = 'Hypoglycemia risk - monitor glucose';
      } else {
        riskLevel = 'high';
        alertClass = 'danger';
        message = 'High risk - hepatotoxicity possible';
      }
    } else {
      // Generic assessment
      riskLevel = 'unknown';
      alertClass = 'warning';
      message = 'Contact poison control for assessment';
    }

    const html = `
      <div class="qc-result-title">Ingested Dose</div>
      <div class="qc-result-value">${dose.toFixed(2)} ${toxin.calcType === 'chocolate' ? 'mg/kg' : 'g/kg'}</div>
      <div class="qc-result-alert ${alertClass}">${message}</div>
      <div class="qc-result-detail">
        <div class="qc-result-detail-row">
          <span>Patient weight:</span>
          <span>${weightKg.toFixed(2)} kg</span>
        </div>
        <div class="qc-result-detail-row">
          <span>Amount ingested:</span>
          <span>${amount} ${toxin.calcType === 'chocolate' ? 'mg' : 'g'}</span>
        </div>
      </div>
    `;

    showResult('toxin', html, riskLevel);
  }

  /**
   * Show calculation result
   */
  function showResult(tab, html, type) {
    const resultDiv = document.getElementById(`qc-${tab}-result`);
    if (!resultDiv) return;

    if (type === 'error') {
      resultDiv.innerHTML = `
        <div class="qc-result-alert warning">${html}</div>
      `;
    } else {
      resultDiv.innerHTML = html;
    }

    resultDiv.classList.add('show');
  }

  /**
   * Make widget draggable
   */
  function makeDraggable(widget) {
    const header = widget.querySelector('.qc-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = widget.offsetLeft;
      startTop = widget.offsetTop;
      widget.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      position.x = Math.max(0, Math.min(window.innerWidth - widget.offsetWidth, startLeft + dx));
      position.y = Math.max(0, Math.min(window.innerHeight - widget.offsetHeight, startTop + dy));
      
      widget.style.left = position.x + 'px';
      widget.style.top = position.y + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        widget.style.transition = '';
        saveState();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.DVMReadyQuickCalc = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
    switchTab: switchTab
  };

})();
