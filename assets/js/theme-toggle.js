/**
 * Global Theme Toggle System
 * Dark mode by default with toggle button
 */

(function() {
  'use strict';

  const THEME_KEY = 'dvmready_theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  /**
   * Initialize theme system
   */
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // Default to dark mode
      applyTheme(DARK_THEME);
    }
    
    createThemeToggle();
    updateThemeIcon();
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', theme === DARK_THEME ? 'pro' : 'light');
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon();
  }

  /**
   * Toggle between dark and light
   */
  function toggleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || DARK_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  /**
   * Get current theme
   */
  function getCurrentTheme() {
    return localStorage.getItem(THEME_KEY) || DARK_THEME;
  }

  /**
   * Create theme toggle button in nav
   */
  function createThemeToggle() {
    // Find nav group
    const navGroups = document.querySelectorAll('.pc-nav-group');
    
    navGroups.forEach(navGroup => {
      // Check if toggle already exists
      if (navGroup.querySelector('.pc-theme-toggle')) return;
      
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'pc-theme-toggle';
      toggleBtn.setAttribute('aria-label', 'Toggle theme');
      toggleBtn.setAttribute('title', 'Toggle light/dark mode');
      toggleBtn.innerHTML = `
        <span class="pc-theme-toggle__icon pc-theme-toggle__icon--dark">🌙</span>
        <span class="pc-theme-toggle__icon pc-theme-toggle__icon--light">☀️</span>
      `;
      
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
      
      // Insert before mobile toggle
      const mobileToggle = navGroup.querySelector('.pc-mobile-toggle');
      if (mobileToggle) {
        navGroup.insertBefore(toggleBtn, mobileToggle);
      } else {
        navGroup.appendChild(toggleBtn);
      }
    });
  }

  /**
   * Update theme icon based on current theme
   */
  function updateThemeIcon() {
    const currentTheme = getCurrentTheme();
    const toggles = document.querySelectorAll('.pc-theme-toggle');
    
    toggles.forEach(toggle => {
      const darkIcon = toggle.querySelector('.pc-theme-toggle__icon--dark');
      const lightIcon = toggle.querySelector('.pc-theme-toggle__icon--light');
      
      if (darkIcon && lightIcon) {
        if (currentTheme === DARK_THEME) {
          darkIcon.style.display = 'none';
          lightIcon.style.display = 'inline';
        } else {
          darkIcon.style.display = 'inline';
          lightIcon.style.display = 'none';
        }
      }
    });
  }

  // Expose API
  window.DVMReadyTheme = {
    init: initTheme,
    toggle: toggleTheme,
    getTheme: getCurrentTheme,
    apply: applyTheme
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();