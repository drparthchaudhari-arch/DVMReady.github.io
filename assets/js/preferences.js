/**
 * DVMReady User Preferences
 * Personalization system for tools and features
 */

(function() {
  'use strict';

  const PREFS_KEY = 'dvmready_preferences';

  // Default preferences
  const defaultPrefs = {
    favoriteTools: [],
    hiddenTools: [],
    toolOrder: [],
    savedPatients: [],
    savedCalculations: [],
    studyProgress: {},
    customNotes: {},
    theme: 'dark',
    lastVisited: null
  };

  let preferences = { ...defaultPrefs };

  /**
   * Initialize preferences
   */
  function initPreferences() {
    loadPreferences();
    trackVisit();
    applyPreferences();
  }

  /**
   * Load preferences from storage
   */
  function loadPreferences() {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      if (stored) {
        preferences = { ...defaultPrefs, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Prefs load error:', e);
    }
  }

  /**
   * Save preferences
   */
  function savePreferences() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.error('Prefs save error:', e);
    }
  }

  /**
   * Track page visit for recent history
   */
  function trackVisit() {
    const current = {
      page: window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString()
    };
    
    preferences.lastVisited = current;
    
    // Add to history (keep last 10)
    if (!preferences.visitHistory) preferences.visitHistory = [];
    preferences.visitHistory.unshift(current);
    preferences.visitHistory = preferences.visitHistory.slice(0, 10);
    
    savePreferences();
  }

  /**
   * Apply preferences to UI
   */
  function applyPreferences() {
    applyToolVisibility();
    applyToolOrder();
    applyFavorites();
  }

  /**
   * Apply tool visibility (hide hidden tools)
   */
  function applyToolVisibility() {
    preferences.hiddenTools.forEach(toolId => {
      const tool = document.querySelector(`[data-tool-id="${toolId}"]`);
      if (tool) tool.style.display = 'none';
    });
  }

  /**
   * Apply custom tool order
   */
  function applyToolOrder() {
    // Implementation depends on grid layout
  }

  /**
   * Apply favorite highlighting
   */
  function applyFavorites() {
    preferences.favoriteTools.forEach(toolId => {
      const tool = document.querySelector(`[data-tool-id="${toolId}"]`);
      if (tool) tool.classList.add('pc-is-favorite');
    });
  }

  /**
   * Toggle favorite tool
   */
  function toggleFavorite(toolId) {
    const idx = preferences.favoriteTools.indexOf(toolId);
    if (idx > -1) {
      preferences.favoriteTools.splice(idx, 1);
    } else {
      preferences.favoriteTools.push(toolId);
    }
    savePreferences();
    return idx === -1; // returns true if added
  }

  /**
   * Toggle hidden tool
   */
  function toggleHidden(toolId) {
    const idx = preferences.hiddenTools.indexOf(toolId);
    if (idx > -1) {
      preferences.hiddenTools.splice(idx, 1);
    } else {
      preferences.hiddenTools.push(toolId);
    }
    savePreferences();
    return idx === -1;
  }

  /**
   * Save patient data
   */
  function savePatient(patientData) {
    const patient = {
      id: 'pat_' + Date.now(),
      ...patientData,
      createdAt: new Date().toISOString()
    };
    preferences.savedPatients.push(patient);
    savePreferences();
    return patient.id;
  }

  /**
   * Delete patient
   */
  function deletePatient(patientId) {
    preferences.savedPatients = preferences.savedPatients.filter(p => p.id !== patientId);
    savePreferences();
  }

  /**
   * Save calculation
   */
  function saveCalculation(calcData) {
    const calc = {
      id: 'calc_' + Date.now(),
      ...calcData,
      timestamp: new Date().toISOString()
    };
    preferences.savedCalculations.unshift(calc);
    preferences.savedCalculations = preferences.savedCalculations.slice(0, 50); // Keep 50
    savePreferences();
    return calc.id;
  }

  /**
   * Delete calculation
   */
  function deleteCalculation(calcId) {
    preferences.savedCalculations = preferences.savedCalculations.filter(c => c.id !== calcId);
    savePreferences();
  }

  /**
   * Update study progress
   */
  function updateStudyProgress(topic, progress) {
    preferences.studyProgress[topic] = {
      ...preferences.studyProgress[topic],
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    savePreferences();
  }

  /**
   * Save custom note
   */
  function saveNote(toolId, note) {
    preferences.customNotes[toolId] = {
      text: note,
      updatedAt: new Date().toISOString()
    };
    savePreferences();
  }

  /**
   * Get visit history
   */
  function getRecentHistory(limit = 10) {
    return (preferences.visitHistory || []).slice(0, limit);
  }

  // Expose API
  window.DVMReadyPrefs = {
    init: initPreferences,
    get: () => preferences,
    save: savePreferences,
    toggleFavorite: toggleFavorite,
    toggleHidden: toggleHidden,
    savePatient: savePatient,
    deletePatient: deletePatient,
    saveCalculation: saveCalculation,
    deleteCalculation: deleteCalculation,
    updateStudyProgress: updateStudyProgress,
    saveNote: saveNote,
    getRecentHistory: getRecentHistory,
    isFavorite: (toolId) => preferences.favoriteTools.includes(toolId),
    isHidden: (toolId) => preferences.hiddenTools.includes(toolId)
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreferences);
  } else {
    initPreferences();
  }
})();
