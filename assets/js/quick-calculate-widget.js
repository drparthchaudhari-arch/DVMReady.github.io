/**
 * DVMReady - Quick Calculate Widget
 * Floating mini-calculator for instant dose calculations
 */

class QuickCalculateWidget {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
  }

  createWidget() {
    // Create floating button
    const floatBtn = document.createElement('button');
    floatBtn.id = 'quick-calc-float-btn';
    floatBtn.className = 'quick-calc-float-btn';
    floatBtn.innerHTML = '⚡';
    floatBtn.title = 'Quick Calculate';
    document.body.appendChild(floatBtn);

    // Create widget panel
    const widget = document.createElement('div');
    widget.id = 'quick-calc-widget';
    widget.className = 'quick-calc-widget';
    widget.innerHTML = `
      <div class="widget-header">
        <h3>⚡ Quick Calculate</h3>
        <button class="close-btn">✕</button>
      </div>
      <div class="widget-body">
        <div class="calc-tabs">
          <button class="tab-btn active" data-tab="drug">💊 Drug</button>
          <button class="tab-btn" data-tab="fluid">💧 Fluid</button>
          <button class="tab-btn" data-tab="toxin">☠️ Toxin</button>
        </div>
        
        <!-- Drug Calculator -->
        <div class="tab-content active" data-tab="drug">
          <div class="input-group">
            <label>Weight</label>
            <div class="input-with-unit">
              <input type="number" id="qc-weight" placeholder="10" step="0.1">
              <select id="qc-weight-unit">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          <div class="input-group">
            <label>Drug</label>
            <select id="qc-drug">
              <option value="">Select drug...</option>
              <option value="carprofen" data-dose-low="2" data-dose-high="4" data-unit="mg/kg">Carprofen (Rimadyl)</option>
              <option value="meloxicam" data-dose-low="0.1" data-dose-high="0.2" data-unit="mg/kg">Meloxicam (Metacam)</option>
              <option value="tramadol" data-dose-low="2" data-dose-high="5" data-unit="mg/kg">Tramadol</option>
              <option value="amoxicillin" data-dose-low="10" data-dose-high="20" data-unit="mg/kg">Amoxicillin</option>
              <option value="cephalexin" data-dose-low="10" data-dose-high="15" data-unit="mg/kg">Cephalexin</option>
              <option value="enrofloxacin" data-dose-low="5" data-dose-high="20" data-unit="mg/kg">Enrofloxacin (Baytril)</option>
              <option value="metronidazole" data-dose-low="10" data-dose-high="15" data-unit="mg/kg">Metronidazole</option>
              <option value="prednisone" data-dose-low="0.5" data-dose-high="2" data-unit="mg/kg">Prednisone</option>
            </select>
          </div>
          <div class="input-group">
            <label>Dose</label>
            <div class="input-with-unit">
              <input type="number" id="qc-dose" placeholder="--" step="0.1">
              <span class="unit-label">mg/kg</span>
            </div>
          </div>
          <div class="input-group">
            <label>Concentration</label>
            <div class="input-with-unit">
              <input type="number" id="qc-conc" placeholder="50" step="1">
              <select id="qc-conc-unit">
                <option value="mg/ml">mg/mL</option>
                <option value="mg/tab">mg/tab</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <button class="calculate-btn" id="qc-calc-drug">Calculate</button>
          <div class="result-box" id="qc-drug-result">
            <div class="result-placeholder">Enter values to calculate</div>
          </div>
        </div>
        
        <!-- Fluid Calculator -->
        <div class="tab-content" data-tab="fluid">
          <div class="input-group">
            <label>Weight</label>
            <div class="input-with-unit">
              <input type="number" id="qc-fluid-weight" placeholder="10" step="0.1">
              <span class="unit-label">kg</span>
            </div>
          </div>
          <div class="input-group">
            <label>Dehydration %</label>
            <div class="input-with-unit">
              <input type="number" id="qc-dehydration" placeholder="5" step="1" min="0" max="15">
              <span class="unit-label">%</span>
            </div>
          </div>
          <div class="input-group">
            <label>Maintenance Factor</label>
            <select id="qc-maintenance">
              <option value="1">Normal (1x)</option>
              <option value="1.5">Mild stress (1.5x)</option>
              <option value="2">Moderate stress (2x)</option>
              <option value="3">Severe stress (3x)</option>
            </select>
          </div>
          <button class="calculate-btn" id="qc-calc-fluid">Calculate Fluids</button>
          <div class="result-box" id="qc-fluid-result">
            <div class="result-placeholder">Enter values to calculate</div>
          </div>
        </div>
        
        <!-- Toxin Calculator -->
        <div class="tab-content" data-tab="toxin">
          <div class="input-group">
            <label>Toxin</label>
            <select id="qc-toxin">
              <option value="">Select toxin...</option>
              <option value="chocolate">🍫 Chocolate</option>
              <option value="xylitol">🍬 Xylitol</option>
              <option value="grapes">🍇 Grapes/Raisins</option>
              <option value="macadamia">🥜 Macadamia Nuts</option>
            </select>
          </div>
          <div class="input-group">
            <label>Weight</label>
            <div class="input-with-unit">
              <input type="number" id="qc-toxin-weight" placeholder="10" step="0.1">
              <span class="unit-label">kg</span>
            </div>
          </div>
          <div class="input-group" id="chocolate-type-group" style="display:none;">
            <label>Chocolate Type</label>
            <select id="qc-chocolate-type">
              <option value="64">Milk (64 mg/oz)</option>
              <option value="160">Semi-sweet (160 mg/oz)</option>
              <option value="440">Baking (440 mg/oz)</option>
              <option value="807">Cocoa powder (807 mg/oz)</option>
            </select>
          </div>
          <div class="input-group">
            <label>Amount Ingested</label>
            <div class="input-with-unit">
              <input type="number" id="qc-amount" placeholder="1" step="0.1">
              <select id="qc-amount-unit">
                <option value="oz">oz</option>
                <option value="g">grams</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>
          <button class="calculate-btn" id="qc-calc-toxin">Assess Risk</button>
          <div class="result-box" id="qc-toxin-result">
            <div class="result-placeholder">Enter values to assess</div>
          </div>
        </div>
      </div>
      <div class="widget-footer">
        <a href="/tools/" class="full-calc-link">Open Full Calculator →</a>
      </div>
    `;
    document.body.appendChild(widget);
  }

  attachEventListeners() {
    // Toggle widget
    const floatBtn = document.getElementById('quick-calc-float-btn');
    const widget = document.getElementById('quick-calc-widget');
    const closeBtn = widget.querySelector('.close-btn');

    floatBtn.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      widget.classList.toggle('open', this.isOpen);
      floatBtn.classList.toggle('active', this.isOpen);
      
      // Pre-fill weight from ribbon if available
      if (this.isOpen) {
        const ribbonWeight = sessionStorage.getItem('dvmready_patient_weight');
        if (ribbonWeight) {
          document.getElementById('qc-weight').value = ribbonWeight;
          document.getElementById('qc-fluid-weight').value = ribbonWeight;
          document.getElementById('qc-toxin-weight').value = ribbonWeight;
        }
      }
    });

    closeBtn.addEventListener('click', () => {
      this.isOpen = false;
      widget.classList.remove('open');
      floatBtn.classList.remove('active');
    });

    // Tab switching
    widget.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        widget.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        widget.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        widget.querySelector(`.tab-content[data-tab="${tab}"]`).classList.add('active');
      });
    });

    // Drug selection - auto-fill dose range
    document.getElementById('qc-drug').addEventListener('change', (e) => {
      const option = e.target.selectedOptions[0];
      if (option.dataset.doseLow) {
        const avgDose = (parseFloat(option.dataset.doseLow) + parseFloat(option.dataset.doseHigh)) / 2;
        document.getElementById('qc-dose').value = avgDose.toFixed(1);
      }
    });

    // Toxin selection - show/hide chocolate type
    document.getElementById('qc-toxin').addEventListener('change', (e) => {
      const chocolateGroup = document.getElementById('chocolate-type-group');
      chocolateGroup.style.display = e.target.value === 'chocolate' ? 'block' : 'none';
    });

    // Calculate buttons
    document.getElementById('qc-calc-drug').addEventListener('click', () => this.calculateDrug());
    document.getElementById('qc-calc-fluid').addEventListener('click', () => this.calculateFluid());
    document.getElementById('qc-calc-toxin').addEventListener('click', () => this.calculateToxin());

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !widget.contains(e.target) && !floatBtn.contains(e.target)) {
        this.isOpen = false;
        widget.classList.remove('open');
        floatBtn.classList.remove('active');
      }
    });
  }

  calculateDrug() {
    const weight = parseFloat(document.getElementById('qc-weight').value);
    const weightUnit = document.getElementById('qc-weight-unit').value;
    const dose = parseFloat(document.getElementById('qc-dose').value);
    const conc = parseFloat(document.getElementById('qc-conc').value);
    const concUnit = document.getElementById('qc-conc-unit').value;

    if (!weight || !dose || !conc) {
      this.showResult('qc-drug-result', '<div class="error">Please fill all fields</div>');
      return;
    }

    // Convert weight to kg
    const weightKg = weightUnit === 'lb' ? weight * 0.453592 : weight;
    
    // Calculate total mg needed
    const totalMg = weightKg * dose;
    
    // Calculate volume/tablets
    let volume, unit;
    if (concUnit === 'mg/ml') {
      volume = totalMg / conc;
      unit = 'mL';
    } else if (concUnit === 'mg/tab') {
      volume = totalMg / conc;
      unit = 'tablets';
    } else if (concUnit === '%') {
      // % = g/100mL = mg/0.1mL
      const mgPerMl = conc * 10;
      volume = totalMg / mgPerMl;
      unit = 'mL';
    }

    const resultHTML = `
      <div class="result-item">
        <span class="result-label">Total Dose:</span>
        <span class="result-value">${totalMg.toFixed(2)} mg</span>
      </div>
      <div class="result-item highlight">
        <span class="result-label">Give:</span>
        <span class="result-value">${volume.toFixed(2)} ${unit}</span>
      </div>
      <button class="copy-btn" onclick="navigator.clipboard.writeText('${volume.toFixed(2)} ${unit}')">📋 Copy</button>
    `;

    this.showResult('qc-drug-result', resultHTML);
  }

  calculateFluid() {
    const weight = parseFloat(document.getElementById('qc-fluid-weight').value);
    const dehydration = parseFloat(document.getElementById('qc-dehydration').value) || 0;
    const maintenanceFactor = parseFloat(document.getElementById('qc-maintenance').value);

    if (!weight) {
      this.showResult('qc-fluid-result', '<div class="error">Please enter weight</div>');
      return;
    }

    // Maintenance: 60 x weight^0.75 for dogs, 50 x weight^0.75 for cats
    const maintenance = 60 * Math.pow(weight, 0.75) * maintenanceFactor;
    
    // Deficit: weight (kg) x % dehydration x 10
    const deficit = weight * dehydration * 10;
    
    // 24-hour total
    const total24h = maintenance + deficit;
    const hourly = total24h / 24;

    const resultHTML = `
      <div class="result-item">
        <span class="result-label">Maintenance:</span>
        <span class="result-value">${maintenance.toFixed(0)} mL/day</span>
      </div>
      ${deficit > 0 ? `
      <div class="result-item">
        <span class="result-label">Deficit:</span>
        <span class="result-value">${deficit.toFixed(0)} mL</span>
      </div>
      ` : ''}
      <div class="result-item highlight">
        <span class="result-label">Total 24h:</span>
        <span class="result-value">${total24h.toFixed(0)} mL</span>
      </div>
      <div class="result-item">
        <span class="result-label">Rate:</span>
        <span class="result-value">${hourly.toFixed(1)} mL/hr</span>
      </div>
    `;

    this.showResult('qc-fluid-result', resultHTML);
  }

  calculateToxin() {
    const toxin = document.getElementById('qc-toxin').value;
    const weight = parseFloat(document.getElementById('qc-toxin-weight').value);
    const amount = parseFloat(document.getElementById('qc-amount').value);
    const amountUnit = document.getElementById('qc-amount-unit').value;

    if (!toxin || !weight || !amount) {
      this.showResult('qc-toxin-result', '<div class="error">Please fill all fields</div>');
      return;
    }

    let dose, risk, action, color;

    if (toxin === 'chocolate') {
      const theobrominePerOz = parseFloat(document.getElementById('qc-chocolate-type').value);
      const oz = amountUnit === 'g' ? amount / 28.35 : amount;
      const totalTheobromine = oz * theobrominePerOz;
      dose = totalTheobromine / weight;
      
      if (dose < 20) {
        risk = 'Minimal';
        action = 'Monitor at home. GI upset possible.';
        color = 'green';
      } else if (dose < 40) {
        risk = 'Mild';
        action = 'Contact vet. May need monitoring.';
        color = 'yellow';
      } else if (dose < 100) {
        risk = 'Moderate';
        action = 'Veterinary attention needed.';
        color = 'orange';
      } else {
        risk = 'Severe';
        action = 'EMERGENCY - Seek immediate care!';
        color = 'red';
      }
    } else if (toxin === 'xylitol') {
      const mgPerPiece = 100; // Approximate
      const totalMg = amountUnit === 'pieces' ? amount * mgPerPiece : 
                      amountUnit === 'oz' ? amount * 28350 : amount;
      dose = totalMg / weight;
      
      if (dose < 0.1) {
        risk = 'Minimal';
        action = 'Monitor blood glucose.';
        color = 'green';
      } else if (dose < 0.5) {
        risk = 'Hypoglycemia Risk';
        action = 'Veterinary care needed.';
        color = 'orange';
      } else {
        risk = 'High Risk';
        action = 'EMERGENCY - Hepatotoxic dose!';
        color = 'red';
      }
    }

    const resultHTML = `
      <div class="risk-badge ${color}">${risk}</div>
      <div class="result-item">
        <span class="result-label">Dose:</span>
        <span class="result-value">${dose.toFixed(2)} mg/kg</span>
      </div>
      <div class="result-item">
        <span class="result-label">Action:</span>
        <span class="result-value">${action}</span>
      </div>
      <div class="emergency-contacts">
        <a href="tel:888-426-4435">ASPCA: 888-426-4435</a>
      </div>
    `;

    this.showResult('qc-toxin-result', resultHTML);
  }

  showResult(elementId, html) {
    document.getElementById(elementId).innerHTML = html;
  }
}

// CSS
const widgetCSS = `
.quick-calc-float-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ecdc4, #44a3aa);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
  transition: all 0.3s;
  z-index: 9998;
}

.quick-calc-float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.5);
}

.quick-calc-float-btn.active {
  background: #ff6b6b;
  transform: rotate(45deg);
}

.quick-calc-widget {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  max-height: 600px;
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  z-index: 9999;
  overflow: hidden;
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.quick-calc-widget.open {
  transform: scale(1) translateY(0);
  opacity: 1;
  visibility: visible;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #2d3748, #1a202c);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.widget-header h3 {
  margin: 0;
  color: white;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.close-btn:hover {
  color: white;
}

.widget-body {
  padding: 16px;
  max-height: 450px;
  overflow-y: auto;
}

.calc-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 10px 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: rgba(255,255,255,0.1);
}

.tab-btn.active {
  background: #4ecdc4;
  color: #1a202c;
  font-weight: 600;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.input-group {
  margin-bottom: 12px;
}

.input-group label {
  display: block;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-with-unit {
  display: flex;
  gap: 8px;
}

.input-with-unit input,
.input-with-unit select {
  flex: 1;
  padding: 10px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

.input-with-unit input:focus,
.input-with-unit select:focus {
  outline: none;
  border-color: #4ecdc4;
}

.unit-label {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
}

.calculate-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4ecdc4, #44a3aa);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin: 16px 0;
  transition: all 0.2s;
}

.calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.result-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 16px;
  min-height: 80px;
}

.result-placeholder {
  color: rgba(255,255,255,0.4);
  text-align: center;
  font-size: 13px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
}

.result-item.highlight {
  background: rgba(78, 205, 196, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin: 12px 0;
}

.result-item.highlight .result-value {
  color: #4ecdc4;
  font-weight: 600;
  font-size: 18px;
}

.copy-btn {
  width: 100%;
  padding: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
}

.copy-btn:hover {
  background: rgba(255,255,255,0.15);
}

.risk-badge {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.risk-badge.green { background: rgba(72, 187, 120, 0.2); color: #48bb78; }
.risk-badge.yellow { background: rgba(236, 201, 75, 0.2); color: #ecc94b; }
.risk-badge.orange { background: rgba(237, 137, 54, 0.2); color: #ed8936; }
.risk-badge.red { background: rgba(245, 101, 101, 0.2); color: #f56565; }

.emergency-contacts {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.emergency-contacts a {
  color: #f56565;
  font-size: 13px;
  text-decoration: none;
}

.widget-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}

.full-calc-link {
  color: #4ecdc4;
  font-size: 13px;
  text-decoration: none;
}

.full-calc-link:hover {
  text-decoration: underline;
}

.error {
  color: #f56565;
  text-align: center;
  font-size: 13px;
}

@media (max-width: 480px) {
  .quick-calc-widget {
    right: 10px;
    left: 10px;
    width: auto;
  }
}
`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = widgetCSS;
  document.head.appendChild(style);
  
  new QuickCalculateWidget();
});
