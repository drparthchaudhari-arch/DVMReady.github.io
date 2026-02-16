/**
 * DVMReady Authentication System
 * Handles guest access and account authentication
 */

(function() {
  'use strict';

  const AUTH_KEY = 'dvmready_auth';
  const GUEST_KEY = 'dvmready_guest';
  const ANALYTICS_KEY = 'dvmready_analytics';

  // Admin credentials (stored in Supabase in production)
  const ADMIN_EMAIL = 'drparthchaudhari@gmail.com';

  // Auth state
  let currentUser = null;
  let isGuest = false;

  /**
   * Initialize authentication
   */
  function initAuth() {
    loadUserFromStorage();
    updateAuthUI();
    setupEventListeners();
  }

  /**
   * Load user from localStorage/Supabase
   */
  function loadUserFromStorage() {
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      const guest = localStorage.getItem(GUEST_KEY);
      
      if (auth) {
        currentUser = JSON.parse(auth);
        isGuest = false;
      } else if (guest) {
        currentUser = JSON.parse(guest);
        isGuest = true;
      }
    } catch (e) {
      console.error('Auth load error:', e);
    }
  }

  /**
   * Check if user is logged in
   */
  function isLoggedIn() {
    return currentUser !== null;
  }

  /**
   * Check if user is admin
   */
  function isAdmin() {
    return currentUser && currentUser.email === ADMIN_EMAIL;
  }

  /**
   * Guest login - save email for analytics
   */
  function guestLogin(email) {
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return false;
    }

    const guestData = {
      email: email,
      type: 'guest',
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      sessionId: generateSessionId()
    };

    localStorage.setItem(GUEST_KEY, JSON.stringify(guestData));
    
    // Store for analytics
    storeAnalyticsData(email, 'guest');
    
    currentUser = guestData;
    isGuest = true;
    
    updateAuthUI();
    showToast('Welcome! You now have access to all tools.', 'success');
    
    return true;
  }

  /**
   * Account signup/login
   */
  async function accountLogin(email, password, isSignup = false) {
    // This will integrate with Supabase
    // For now, placeholder structure
    console.log('Account login:', email, isSignup);
    return true;
  }

  /**
   * Logout
   */
  function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(GUEST_KEY);
    currentUser = null;
    isGuest = false;
    updateAuthUI();
    showToast('Logged out successfully', 'info');
  }

  /**
   * Update auth UI elements
   */
  function updateAuthUI() {
    const authIndicators = document.querySelectorAll('[data-pc-auth-indicator]');
    const authText = document.querySelectorAll('[data-pc-auth-text]');
    
    authIndicators.forEach(ind => {
      if (isLoggedIn()) {
        ind.textContent = '●';
        ind.classList.add('pc-is-logged-in');
      } else {
        ind.textContent = '○';
        ind.classList.remove('pc-is-logged-in');
      }
    });

    authText.forEach(txt => {
      if (isLoggedIn()) {
        txt.textContent = isGuest ? 'Guest' : 'Account';
      } else {
        txt.textContent = 'Account';
      }
    });
  }

  /**
   * Store analytics data
   */
  function storeAnalyticsData(email, type) {
    try {
      const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
      analytics.push({
        email: email,
        type: type,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: window.location.pathname
      });
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics.slice(-100))); // Keep last 100
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }

  /**
   * Validate email
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Generate session ID
   */
  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Guest login form
    document.addEventListener('click', function(e) {
      if (e.target.matches('[data-pc-guest-login]')) {
        e.preventDefault();
        const emailInput = document.querySelector('[data-pc-guest-email]');
        if (emailInput) {
          guestLogin(emailInput.value.trim());
        }
      }
      
      if (e.target.matches('[data-pc-logout]')) {
        e.preventDefault();
        logout();
      }
    });
  }

  // Toast notification helper
  function showToast(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  }

  // Expose API
  window.DVMReadyAuth = {
    init: initAuth,
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin,
    isGuest: () => isGuest,
    getUser: () => currentUser,
    guestLogin: guestLogin,
    accountLogin: accountLogin,
    logout: logout
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
