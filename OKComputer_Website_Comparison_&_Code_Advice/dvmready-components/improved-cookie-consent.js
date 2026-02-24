/**
 * DVMReady - Improved Cookie Consent
 * Remembers user choice, less intrusive, better UX
 */

class CookieConsent {
  constructor(options = {}) {
    this.options = {
      cookieName: 'dvmready_cookie_consent',
      cookieExpiry: 365, // days
      position: 'bottom', // 'bottom' or 'top'
      ...options
    };
    
    this.consent = this.getStoredConsent();
    this.init();
  }

  init() {
    // Check if consent already given
    if (this.consent) {
      this.applyConsent();
      return;
    }

    // Show banner after short delay
    setTimeout(() => {
      this.showBanner();
    }, 1000);
  }

  getStoredConsent() {
    try {
      const stored = localStorage.getItem(this.options.cookieName);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  storeConsent(preferences) {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(this.options.cookieName, JSON.stringify(consent));
    this.consent = consent;
  }

  showBanner() {
    // Remove existing banner if any
    this.removeBanner();

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = `cookie-banner ${this.options.position}`;
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-text">
          <p>
            We use cookies to enhance your experience. 
            <a href="/privacy.html" class="cookie-link">Learn more</a>
          </p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn-secondary" id="cookie-customize">
            Customize
          </button>
          <button class="cookie-btn cookie-btn-secondary" id="cookie-reject">
            Reject Optional
          </button>
          <button class="cookie-btn cookie-btn-primary" id="cookie-accept">
            Accept All
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });

    // Attach listeners
    banner.querySelector('#cookie-accept').addEventListener('click', () => {
      this.acceptAll();
    });

    banner.querySelector('#cookie-reject').addEventListener('click', () => {
      this.rejectOptional();
    });

    banner.querySelector('#cookie-customize').addEventListener('click', () => {
      this.showPreferences();
    });
  }

  showPreferences() {
    this.removeBanner();

    const modal = document.createElement('div');
    modal.id = 'cookie-preferences-modal';
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <div class="cookie-modal-overlay"></div>
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h3>Cookie Preferences</h3>
          <button class="cookie-modal-close" id="cookie-modal-close">✕</button>
        </div>
        <div class="cookie-modal-body">
          <p class="cookie-modal-intro">
            Choose which cookies you allow. Essential cookies are always enabled 
            for the website to function properly.
          </p>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Essential</h4>
                <span class="cookie-badge cookie-badge-required">Required</span>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" checked disabled>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-category-desc">
              Required for navigation, security, and basic functionality. 
              These cannot be disabled.
            </p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Analytics</h4>
                <span class="cookie-badge cookie-badge-optional">Optional</span>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-analytics" checked>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-category-desc">
              Help us understand how visitors interact with our website 
              by collecting anonymous usage data.
            </p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Functional</h4>
                <span class="cookie-badge cookie-badge-optional">Optional</span>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-functional" checked>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-category-desc">
              Enable enhanced features like saved preferences, 
              weight memory, and personalized settings.
            </p>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button class="cookie-btn cookie-btn-secondary" id="cookie-save-preferences">
            Save Preferences
          </button>
          <button class="cookie-btn cookie-btn-primary" id="cookie-accept-all-modal">
            Accept All
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });

    // Listeners
    modal.querySelector('#cookie-modal-close').addEventListener('click', () => {
      this.closeModal();
      this.showBanner();
    });

    modal.querySelector('.cookie-modal-overlay').addEventListener('click', () => {
      this.closeModal();
      this.showBanner();
    });

    modal.querySelector('#cookie-save-preferences').addEventListener('click', () => {
      this.savePreferences({
        essential: true,
        analytics: document.getElementById('cookie-analytics').checked,
        functional: document.getElementById('cookie-functional').checked
      });
    });

    modal.querySelector('#cookie-accept-all-modal').addEventListener('click', () => {
      this.acceptAll();
    });
  }

  closeModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    }
  }

  removeBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
  }

  acceptAll() {
    this.savePreferences({
      essential: true,
      analytics: true,
      functional: true
    });
  }

  rejectOptional() {
    this.savePreferences({
      essential: true,
      analytics: false,
      functional: false
    });
  }

  savePreferences(preferences) {
    this.storeConsent(preferences);
    this.removeBanner();
    this.closeModal();
    this.applyConsent();

    // Show confirmation toast
    this.showToast('Preferences saved');
  }

  applyConsent() {
    if (!this.consent) return;

    // Apply analytics
    if (this.consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Apply functional
    if (this.consent.functional) {
      this.enableFunctional();
    } else {
      this.disableFunctional();
    }
  }

  enableAnalytics() {
    // Enable Google Analytics or other tracking
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  }

  disableAnalytics() {
    // Disable analytics cookies
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    
    // Remove analytics cookies
    this.deleteCookie('_ga');
    this.deleteCookie('_gid');
    this.deleteCookie('_gat');
  }

  enableFunctional() {
    // Functional cookies are allowed
    document.body.classList.add('cookies-functional-enabled');
  }

  disableFunctional() {
    // Clear functional storage
    localStorage.removeItem('dvmready_patient_weight');
    localStorage.removeItem('dvmready_patient_species');
    localStorage.removeItem('dvmready_weight_unit');
    document.body.classList.remove('cookies-functional-enabled');
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cookie-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}

// CSS
const cookieCSS = `
/* Banner */
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  background: #1e293b;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 16px 20px;
  z-index: 10000;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.cookie-banner.bottom {
  bottom: 0;
}

.cookie-banner.top {
  top: 0;
  border-top: none;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transform: translateY(-100%);
}

.cookie-banner.visible {
  transform: translateY(0);
  opacity: 1;
}

.cookie-banner-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.cookie-text p {
  margin: 0;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
}

.cookie-link {
  color: #4ecdc4;
  text-decoration: none;
}

.cookie-link:hover {
  text-decoration: underline;
}

.cookie-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cookie-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cookie-btn-primary {
  background: linear-gradient(135deg, #4ecdc4, #44a3aa);
  color: white;
}

.cookie-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.cookie-btn-secondary {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.2);
}

.cookie-btn-secondary:hover {
  background: rgba(255,255,255,0.15);
}

/* Modal */
.cookie-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.cookie-modal.visible {
  opacity: 1;
  visibility: visible;
}

.cookie-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
}

.cookie-modal-content {
  position: relative;
  background: #1e293b;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  transform: scale(0.9);
  transition: transform 0.3s;
}

.cookie-modal.visible .cookie-modal-content {
  transform: scale(1);
}

.cookie-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.cookie-modal-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.cookie-modal-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.cookie-modal-close:hover {
  color: white;
}

.cookie-modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  max-height: 50vh;
}

.cookie-modal-intro {
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.cookie-category {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.cookie-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cookie-category-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cookie-category-info h4 {
  margin: 0;
  color: white;
  font-size: 15px;
}

.cookie-badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.cookie-badge-required {
  background: rgba(72, 187, 120, 0.2);
  color: #48bb78;
}

.cookie-badge-optional {
  background: rgba(237, 137, 54, 0.2);
  color: #ed8936;
}

.cookie-category-desc {
  margin: 0;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  line-height: 1.5;
}

/* Toggle Switch */
.cookie-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.cookie-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.cookie-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 24px;
  transition: 0.3s;
}

.cookie-toggle-slider:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.cookie-toggle input:checked + .cookie-toggle-slider {
  background: #4ecdc4;
}

.cookie-toggle input:checked + .cookie-toggle-slider:before {
  transform: translateX(24px);
}

.cookie-toggle input:disabled + .cookie-toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.cookie-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

/* Toast */
.cookie-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #48bb78;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transition: all 0.3s;
  z-index: 10002;
}

.cookie-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 600px) {
  .cookie-banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .cookie-actions {
    width: 100%;
    justify-content: center;
  }
  
  .cookie-btn {
    flex: 1;
    min-width: 120px;
  }
}
`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = cookieCSS;
  document.head.appendChild(style);
  
  window.cookieConsent = new CookieConsent();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CookieConsent;
}
