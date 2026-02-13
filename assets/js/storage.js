const PC_STORAGE_PREFIX = 'pc_';
const PC_SCHEMA_VERSION = 1;

const PCStorage = {
  // Core methods
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(PC_STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PC_STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  merge(key, partialValue) {
    const existing = this.get(key, {});
    const merged = { ...existing, ...partialValue };
    return this.set(key, merged);
  },

  remove(key) {
    localStorage.removeItem(PC_STORAGE_PREFIX + key);
  },

  // Date handling (Toronto timezone without external libs)
  getTodayKey() {
    const now = new Date();
    // Create date string in Toronto timezone
    const torontoOffset = -300; // EST offset in minutes (simplified)
    const localOffset = now.getTimezoneOffset();
    const diff = (torontoOffset - localOffset) * 60 * 1000;
    const torontoTime = new Date(now.getTime() + diff);

    return torontoTime.toISOString().split('T')[0]; // YYYY-MM-DD
  },

  // Schema management
  checkSchema() {
    const currentVersion = this.get('schema_version', 0);
    if (currentVersion < PC_SCHEMA_VERSION) {
      this.migrate(currentVersion, PC_SCHEMA_VERSION);
      this.set('schema_version', PC_SCHEMA_VERSION);
    }
  },

  migrate(fromVersion, toVersion) {
    console.log(`Migrating storage from v${fromVersion} to v${toVersion}`);
    // Migration logic here if needed in future
  },

  // Specific data getters/setters
  getPrefs() {
    return this.get('prefs', { mode: 'pro', theme: 'light' });
  },

  setPrefs(prefs) {
    return this.set('prefs', prefs);
  },

  getCaseCompletion(caseId) {
    const completions = this.get('case_completion', {});
    return completions[caseId] || null;
  },

  setCaseCompletion(caseId, data) {
    const completions = this.get('case_completion', {});
    completions[caseId] = {
      completedAt: new Date().toISOString(),
      ...data
    };
    return this.set('case_completion', completions);
  },

  getStudyProgress() {
    return this.get('study_progress', {
      currentStreak: 0,
      lastActiveDate: null,
      topics: {}
    });
  },

  updateStudyProgress(topicId, status) {
    const progress = this.getStudyProgress();
    progress.topics[topicId] = {
      status,
      updatedAt: new Date().toISOString()
    };
    return this.set('study_progress', progress);
  },

  getDaily(dateKey) {
    return this.get('daily_' + dateKey, {
      dateKey,
      tasks: [],
      completedCount: 0,
      lastActivityAt: null
    });
  },

  setDaily(dateKey, data) {
    return this.set('daily_' + dateKey, data);
  },

  getStreak() {
    return this.get('streak', { current: 0, lastActiveDateKey: null });
  },

  updateStreak(dateKey) {
    const streak = this.getStreak();
    const lastDate = streak.lastActiveDateKey;

    if (!lastDate) {
      // First activity ever
      streak.current = 1;
    } else if (lastDate === dateKey) {
      // Already active today, no change
      return streak;
    } else {
      // Check if consecutive
      const last = new Date(lastDate);
      const today = new Date(dateKey);
      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.current += 1; // Consecutive day
      } else if (diffDays > 1) {
        streak.current = 1; // Streak broken, start new
      }
    }

    streak.lastActiveDateKey = dateKey;
    this.set('streak', streak);
    return streak;
  },

  recordGameLaunch(gameId) {
    const launches = this.get('game_launches', {});
    launches[gameId] = {
      lastLaunchedAt: new Date().toISOString(),
      launchCount: (launches[gameId]?.launchCount || 0) + 1
    };
    return this.set('game_launches', launches);
  },

  wasGamePlayedToday(gameId) {
    const launches = this.get('game_launches', {});
    const launch = launches[gameId];
    if (!launch) return false;

    const todayKey = this.getTodayKey();
    const launchDate = launch.lastLaunchedAt.split('T')[0];
    return launchDate === todayKey;
  },

  // Export/Import
  exportAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PC_STORAGE_PREFIX)) {
        const shortKey = key.replace(PC_STORAGE_PREFIX, '');
        data[shortKey] = this.get(shortKey);
      }
    }
    return {
      schema_version: PC_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data
    };
  },

  importAll(exportData) {
    if (!exportData || !exportData.data) {
      throw new Error('Invalid export data');
    }

    // Merge rather than replace
    Object.keys(exportData.data).forEach(key => {
      const existing = this.get(key);
      const incoming = exportData.data[key];

      if (existing && typeof existing === 'object' && typeof incoming === 'object') {
        this.set(key, { ...existing, ...incoming });
      } else {
        this.set(key, incoming);
      }
    });

    return true;
  }
};

// Initialize on load
PCStorage.checkSchema();

// Make globally available
window.PCStorage = PCStorage;
