/**
 * DVMReady Improved Cookie Consent
 * Non-intrusive, remember user choice, respects preferences
 * Fixes intrusive modal issues
 * 
 * @version 1.0.0
 * @author DVMReady Development Team
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'dvmready_cookie_consent',
    bannerId: 'cookie-consent-banner',
    zIndex: 10000,
    expireDays: 365,
    // Colors matching DVMReady dark theme
    colors: {
      bg: '#0d1b2a',
      bgSecondary: '#1b263b',
      border: '#1b3a4b',
      text: '#e0e1dd',
      primary: '#00d4aa',
      secondary: '#778da9',
      muted: '#415a77'
    }
  };

  // Consent state
  let consentState = {
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    timestamp: null,
    version: '1.0'
  };

  /**
   * Initialize cookie consent
   */
  function init() {
    loadConsent();

    // Check if consent already given
    if (!needsConsent()) {
      console.log('[DVMReady] Cookie consent already provided');
      applyConsent();
      return;
    }

    // Delay showing banner for better UX
    setTimeout(() => {
      showBanner();
    }, 1000);

    console.log('[DVMReady] Cookie consent initialized');
  }

  /**
   * Load consent from localStorage
   */
  function loadConsent() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        consentState = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[DVMReady] Could not load cookie consent:', e);
    }
  }

  /**
   * Save consent to localStorage
   */
  function saveConsent() {
    try {
      consentState.timestamp = Date.now();
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(consentState));
    } catch (e) {
      console.warn('[DVMReady] Could not save cookie consent:', e);
    }
  }

  /**
   * Check if consent is needed
   */
  function needsConsent() {
    // No saved consent
    if (!consentState.timestamp) return true;

    // Check if version changed (new features)
    if (consentState.version !== '1.0') return true;

    // Check if expired (1 year)
    const daysSince = (Date.now() - consentState.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSince > CONFIG.expireDays) return true;

    return false;
  }

  /**
   * Show consent banner
   */
  function showBanner() {
    if (document.getElementById(CONFIG.bannerId)) return;

    const banner = document.createElement('div');
    banner.id = CONFIG.bannerId;
    banner.innerHTML = getBannerHTML();
    document.body.appendChild(banner);

    addBannerStyles();
    attachBannerEvents(banner);

    // Animate in
    requestAnimationFrame(() => {
      banner.classList.add('show');
    });
  }

  /**
   * Hide consent banner
   */
  function hideBanner() {
    const banner = document.getElementById(CONFIG.bannerId);
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    }
  }

  /**
   * Get banner HTML
   */
  function getBannerHTML() {
    return `
      <div class="cc-container">
        <div class="cc-main">
          <div class="cc-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
              <path d="M8.5 8.5l1.5 1.5"/>
              <path d="M15.5 8.5l-1.5 1.5"/>
              <path d="M12 16a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z"/>
            </svg>
          </div>
          
          <div class="cc-content">
            <h4>Cookie Preferences</h4>
            <p>We use cookies to enhance your experience. Necessary cookies are always active. <button class="cc-link" id="cc-learn-more">Learn more</button></p>
          </div>
          
          <div class="cc-actions">
            <button class="cc-btn cc-btn-secondary" id="cc-customize">Customize</button>
            <button class="cc-btn cc-btn-secondary" id="cc-necessary">Necessary Only</button>
            <button class="cc-btn cc-btn-primary" id="cc-accept-all">Accept All</button>
          </div>
          
          <button class="cc-close" id="cc-close" title="Close">×</button>
        </div>
        
        <div class="cc-preferences" id="cc-preferences">
          <div class="cc-pref-header">
            <h5>Cookie Preferences</h5>
            <button class="cc-close" id="cc-close-prefs">×</button>
          </div>
          
          <div class="cc-pref-list">
            <div class="cc-pref-item">
              <div class="cc-pref-info">
                <strong>Necessary</strong>
                <span>Required for the website to function properly. Cannot be disabled.</span>
              </div>
              <label class="cc-toggle">
                <input type="checkbox" checked disabled>
                <span class="cc-toggle-slider"></span>
              </label>
            </div>
            
            <div class="cc-pref-item">
              <div class="cc-pref-info">
                <strong>Analytics</strong>
                <span>Helps us understand how visitors interact with our website.</span>
              </div>
              <label class="cc-toggle">
                <input type="checkbox" id="cc-analytics" ${consentState.analytics ? 'checked' : ''}>
                <span class="cc-toggle-slider"></span>
              </label>
            </div>
            
            <div class="cc-pref-item">
              <div class="cc-pref-info">
                <strong>Marketing</strong>
                <span>Used to deliver personalized advertisements.</span>
              </div>
              <label class="cc-toggle">
                <input type="checkbox" id="cc-marketing" ${consentState.marketing ? 'checked' : ''}>
                <span class="cc-toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="cc-pref-actions">
            <button class="cc-btn cc-btn-secondary" id="cc-save-prefs">Save Preferences</button>
            <button class="cc-btn cc-btn-primary" id="cc-accept-all-prefs">Accept All</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Add banner styles
   */
  function addBannerStyles() {
    if (document.getElementById('cc-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'cc-styles';
    styles.textContent = `
      #${CONFIG.bannerId} {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: ${CONFIG.zIndex};
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }
      
      #${CONFIG.bannerId}.show {
        transform: translateY(0);
      }
      
      .cc-container {
        background: ${CONFIG.colors.bg};
        border-top: 1px solid ${CONFIG.colors.border};
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
      }
      
      .cc-main {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .cc-icon {
        flex-shrink: 0;
        color: ${CONFIG.colors.primary};
      }
      
      .cc-content {
        flex: 1;
      }
      
      .cc-content h4 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
        color: ${CONFIG.colors.text};
      }
      
      .cc-content p {
        margin: 0;
        font-size: 0.875rem;
        color: ${CONFIG.colors.secondary};
        line-height: 1.5;
      }
      
      .cc-link {
        background: none;
        border: none;
        color: ${CONFIG.colors.primary};
        text-decoration: underline;
        cursor: pointer;
        font-size: inherit;
        padding: 0;
      }
      
      .cc-link:hover {
        color: #00ffb0;
      }
      
      .cc-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      
      .cc-btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        white-space: nowrap;
      }
      
      .cc-btn-primary {
        background: ${CONFIG.colors.primary};
        color: #0d1b2a;
      }
      
      .cc-btn-primary:hover {
        background: #00ffb0;
        transform: translateY(-1px);
      }
      
      .cc-btn-secondary {
        background: ${CONFIG.colors.bgSecondary};
        color: ${CONFIG.colors.text};
        border: 1px solid ${CONFIG.colors.border};
      }
      
      .cc-btn-secondary:hover {
        background: ${CONFIG.colors.border};
      }
      
      .cc-close {
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
        flex-shrink: 0;
      }
      
      .cc-close:hover {
        background: ${CONFIG.colors.bgSecondary};
        color: ${CONFIG.colors.text};
      }
      
      /* Preferences Panel */
      .cc-preferences {
        display: none;
        border-top: 1px solid ${CONFIG.colors.border};
        padding: 1.5rem;
        max-width: 600px;
        margin: 0 auto;
      }
      
      .cc-preferences.show {
        display: block;
        animation: cc-fade-in 0.3s ease;
      }
      
      @keyframes cc-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .cc-pref-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .cc-pref-header h5 {
        margin: 0;
        font-size: 1.1rem;
        color: ${CONFIG.colors.text};
      }
      
      .cc-pref-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .cc-pref-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: ${CONFIG.colors.bgSecondary};
        border: 1px solid ${CONFIG.colors.border};
        border-radius: 8px;
      }
      
      .cc-pref-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .cc-pref-info strong {
        color: ${CONFIG.colors.text};
        font-size: 0.95rem;
      }
      
      .cc-pref-info span {
        color: ${CONFIG.colors.secondary};
        font-size: 0.8rem;
      }
      
      /* Toggle Switch */
      .cc-toggle {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;
        flex-shrink: 0;
      }
      
      .cc-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .cc-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${CONFIG.colors.border};
        transition: 0.3s;
        border-radius: 24px;
      }
      
      .cc-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }
      
      .cc-toggle input:checked + .cc-toggle-slider {
        background-color: ${CONFIG.colors.primary};
      }
      
      .cc-toggle input:checked + .cc-toggle-slider:before {
        transform: translateX(24px);
      }
      
      .cc-toggle input:disabled + .cc-toggle-slider {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .cc-pref-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .cc-main {
          flex-wrap: wrap;
          padding: 1rem;
        }
        
        .cc-content {
          width: 100%;
          order: -1;
        }
        
        .cc-icon {
          display: none;
        }
        
        .cc-actions {
          width: 100%;
          justify-content: stretch;
        }
        
        .cc-actions .cc-btn {
          flex: 1;
        }
      }
      
      @media (max-width: 480px) {
        .cc-actions {
          flex-wrap: wrap;
        }
        
        .cc-btn {
          flex: 1 1 calc(50% - 0.25rem);
        }
        
        .cc-preferences {
          padding: 1rem;
        }
        
        .cc-pref-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Attach banner events
   */
  function attachBannerEvents(banner) {
    // Close button
    banner.querySelector('#cc-close').onclick = () => {
      // Close without accepting - will show again
      hideBanner();
    };

    // Learn more link
    banner.querySelector('#cc-learn-more').onclick = (e) => {
      e.preventDefault();
      showPreferences(banner);
    };

    // Customize button
    banner.querySelector('#cc-customize').onclick = () => {
      showPreferences(banner);
    };

    // Necessary only button
    banner.querySelector('#cc-necessary').onclick = () => {
      consentState.analytics = false;
      consentState.marketing = false;
      saveConsent();
      applyConsent();
      hideBanner();
      showNotification('Cookie preferences saved: Necessary only');
    };

    // Accept all button
    banner.querySelector('#cc-accept-all').onclick = () => {
      consentState.analytics = true;
      consentState.marketing = true;
      saveConsent();
      applyConsent();
      hideBanner();
      showNotification('Cookie preferences saved: All accepted');
    };

    // Preferences panel events
    banner.querySelector('#cc-close-prefs').onclick = () => {
      hidePreferences(banner);
    };

    banner.querySelector('#cc-save-prefs').onclick = () => {
      consentState.analytics = banner.querySelector('#cc-analytics').checked;
      consentState.marketing = banner.querySelector('#cc-marketing').checked;
      saveConsent();
      applyConsent();
      hidePreferences(banner);
      hideBanner();
      showNotification('Cookie preferences saved');
    };

    banner.querySelector('#cc-accept-all-prefs').onclick = () => {
      banner.querySelector('#cc-analytics').checked = true;
      banner.querySelector('#cc-marketing').checked = true;
      consentState.analytics = true;
      consentState.marketing = true;
      saveConsent();
      applyConsent();
      hidePreferences(banner);
      hideBanner();
      showNotification('Cookie preferences saved: All accepted');
    };
  }

  /**
   * Show preferences panel
   */
  function showPreferences(banner) {
    const prefs = banner.querySelector('#cc-preferences');
    prefs.classList.add('show');
    banner.querySelector('.cc-main').style.display = 'none';
  }

  /**
   * Hide preferences panel
   */
  function hidePreferences(banner) {
    const prefs = banner.querySelector('#cc-preferences');
    prefs.classList.remove('show');
    banner.querySelector('.cc-main').style.display = 'flex';
  }

  /**
   * Apply consent settings
   */
  function applyConsent() {
    // Enable/disable analytics
    if (consentState.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    // Enable/disable marketing
    if (consentState.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }
  }

  /**
   * Enable analytics scripts
   */
  function enableAnalytics() {
    // Google Analytics, Plausible, etc.
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted'
    });
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('cookieConsent:analyticsEnabled'));
  }

  /**
   * Disable analytics scripts
   */
  function disableAnalytics() {
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied'
    });
    
    window.dispatchEvent(new CustomEvent('cookieConsent:analyticsDisabled'));
  }

  /**
   * Enable marketing scripts
   */
  function enableMarketing() {
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    
    window.dispatchEvent(new CustomEvent('cookieConsent:marketingEnabled'));
  }

  /**
   * Disable marketing scripts
   */
  function disableMarketing() {
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    
    window.dispatchEvent(new CustomEvent('cookieConsent:marketingDisabled'));
  }

  /**
   * Show notification
   */
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cc-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: ${CONFIG.colors.bgSecondary};
      color: ${CONFIG.colors.text};
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: 1px solid ${CONFIG.colors.border};
      font-size: 0.875rem;
      z-index: ${CONFIG.zIndex + 1};
      animation: cc-notification-fade 3s ease forwards;
    `;

    // Add animation styles
    if (!document.getElementById('cc-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'cc-notification-styles';
      styles.textContent = `
        @keyframes cc-notification-fade {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          90% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  /**
   * Reset consent (for testing)
   */
  function resetConsent() {
    localStorage.removeItem(CONFIG.storageKey);
    consentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: null,
      version: '1.0'
    };
    showBanner();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.DVMReadyCookieConsent = {
    show: showBanner,
    hide: hideBanner,
    reset: resetConsent,
    getState: () => ({ ...consentState }),
    needsConsent
  };

})();
