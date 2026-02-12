(function () {
    var CASE_PREFIX = 'pc_case_';
    var STUDY_PLAN_KEY = 'pc_study_plan';
    var GAME_ACTIVITY_KEY = 'pc_game_activity';
    var SYNC_META_KEY = 'pc_sync_meta';
    var EXPORT_VERSION = 1;
    var KNOWN_GAME_KEYS = [
        'totalScore',
        'highestStreak',
        'gameProgress',
        'playerName',
        'lobbies',
        'sudoku-stats',
        'sudoku-theme',
        'neuralArchitectData',
        'tictactoe-nexus-stats'
    ];
    var KNOWN_GAME_PREFIXES = ['2048ultimate_'];

    function safeParse(value, fallback) {
        if (!value) {
            return fallback;
        }
        try {
            var parsed = JSON.parse(value);
            return parsed !== undefined ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function isObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    function cloneValue(value, fallback) {
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (error) {
            return fallback;
        }
    }

    function safeGetItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    function safeRemoveItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    function getAllLocalStorageKeys() {
        var keys = [];
        try {
            for (var i = 0; i < localStorage.length; i += 1) {
                keys.push(localStorage.key(i));
            }
        } catch (error) {
            return [];
        }
        return keys;
    }

    function getIsoNow() {
        return new Date().toISOString();
    }

    function toTimestamp(value) {
        var time = Date.parse(value || '');
        return Number.isFinite(time) ? time : 0;
    }

    function pickLatestIso(a, b) {
        return toTimestamp(a) >= toTimestamp(b) ? (a || '') : (b || '');
    }

    function getSyncMeta() {
        var parsed = safeParse(safeGetItem(SYNC_META_KEY), {});
        return isObject(parsed) ? parsed : {};
    }

    function saveSyncMeta(meta) {
        if (!isObject(meta)) {
            return false;
        }
        return safeSetItem(SYNC_META_KEY, JSON.stringify(meta));
    }

    function touchField(fieldName, timestamp) {
        if (!fieldName) {
            return false;
        }

        var value = timestamp || getIsoNow();
        var meta = getSyncMeta();
        meta[fieldName] = value;
        meta.updated_at = pickLatestIso(meta.updated_at, value);
        return saveSyncMeta(meta);
    }

    function setLastSyncedAt(timestamp) {
        var value = timestamp || getIsoNow();
        var meta = getSyncMeta();
        meta.last_synced_at = value;
        meta.updated_at = pickLatestIso(meta.updated_at, value);
        return saveSyncMeta(meta);
    }

    function getLastSyncedAt() {
        var meta = getSyncMeta();
        return meta.last_synced_at || '';
    }

    function normalizeSyncField(fieldValue, fallbackData) {
        var defaultData = fallbackData !== undefined ? fallbackData : {};
        if (isObject(fieldValue) && isObject(fieldValue.data)) {
            return {
                data: cloneValue(fieldValue.data, defaultData),
                updatedAt: fieldValue.updatedAt || fieldValue.updated_at || ''
            };
        }

        if (isObject(fieldValue)) {
            return {
                data: cloneValue(fieldValue, defaultData),
                updatedAt: fieldValue.updatedAt || fieldValue.updated_at || ''
            };
        }

        return {
            data: cloneValue(defaultData, {}),
            updatedAt: ''
        };
    }

    function getCaseCompletions() {
        var keys = getAllLocalStorageKeys();
        var output = {};

        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (!key || key.indexOf(CASE_PREFIX) !== 0) {
                continue;
            }
            if (safeGetItem(key) === 'completed') {
                output[key] = 'completed';
            }
        }

        return output;
    }

    function countCaseCompletions() {
        return Object.keys(getCaseCompletions()).length;
    }

    function markCaseCompleted(caseKey, timestamp) {
        if (!caseKey) {
            return false;
        }
        safeSetItem(caseKey, 'completed');
        touchField('case_completions', timestamp);
        return true;
    }

    function getStudyPlan() {
        var parsed = safeParse(safeGetItem(STUDY_PLAN_KEY), null);
        return isObject(parsed) ? parsed : null;
    }

    function setStudyPlan(plan, timestamp) {
        if (!isObject(plan)) {
            return false;
        }
        var stored = safeSetItem(STUDY_PLAN_KEY, JSON.stringify(plan));
        if (stored) {
            touchField('study_plan', timestamp);
        }
        return stored;
    }

    function getCurrentStreak() {
        var studyPlan = getStudyPlan();
        var streakValue = studyPlan ? Number(studyPlan.currentStreak) : 0;
        return Number.isFinite(streakValue) && streakValue > 0 ? streakValue : 0;
    }

    function getGameActivity() {
        var parsed = safeParse(safeGetItem(GAME_ACTIVITY_KEY), {});
        return isObject(parsed) ? parsed : {};
    }

    function setGameActivity(activity, timestamp) {
        if (!isObject(activity)) {
            return false;
        }
        var stored = safeSetItem(GAME_ACTIVITY_KEY, JSON.stringify(activity));
        if (stored) {
            touchField('game_activity', timestamp);
        }
        return stored;
    }

    function buildLocalSyncPayload() {
        var meta = getSyncMeta();
        return {
            case_completions: {
                data: getCaseCompletions(),
                updatedAt: meta.case_completions || ''
            },
            study_plan: {
                data: getStudyPlan() || {},
                updatedAt: meta.study_plan || ''
            },
            game_activity: {
                data: getGameActivity(),
                updatedAt: meta.game_activity || ''
            },
            updated_at: meta.updated_at || ''
        };
    }

    function applyCaseCompletionData(field) {
        var normalized = normalizeSyncField(field, {});
        var data = normalized.data;

        if (isObject(data)) {
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i += 1) {
                var key = keys[i];
                if (!key || key.indexOf(CASE_PREFIX) !== 0) {
                    continue;
                }

                var value = data[key];
                var completed = value === 'completed' || value === true || (isObject(value) && value.status === 'completed');
                if (completed) {
                    safeSetItem(key, 'completed');
                }
            }
        }

        if (normalized.updatedAt) {
            touchField('case_completions', normalized.updatedAt);
        }
    }

    function applyStudyPlanData(field) {
        var normalized = normalizeSyncField(field, {});
        if (isObject(normalized.data) && Object.keys(normalized.data).length) {
            safeSetItem(STUDY_PLAN_KEY, JSON.stringify(normalized.data));
            touchField('study_plan', normalized.updatedAt || getIsoNow());
        }
    }

    function applyGameActivityData(field) {
        var normalized = normalizeSyncField(field, {});
        if (isObject(normalized.data) && Object.keys(normalized.data).length) {
            safeSetItem(GAME_ACTIVITY_KEY, JSON.stringify(normalized.data));
            touchField('game_activity', normalized.updatedAt || getIsoNow());
        }
    }

    function applySyncData(payload) {
        if (!isObject(payload)) {
            return false;
        }

        applyCaseCompletionData(payload.case_completions);
        applyStudyPlanData(payload.study_plan);
        applyGameActivityData(payload.game_activity);

        if (payload.updated_at) {
            var meta = getSyncMeta();
            meta.updated_at = pickLatestIso(meta.updated_at, payload.updated_at);
            saveSyncMeta(meta);
        }

        return true;
    }

    function startsWithAnyPrefix(value, prefixes) {
        for (var i = 0; i < prefixes.length; i += 1) {
            if (value.indexOf(prefixes[i]) === 0) {
                return true;
            }
        }
        return false;
    }

    function shouldIncludeInExport(key) {
        if (!key) {
            return false;
        }

        if (key.indexOf('pc_') === 0) {
            return true;
        }

        if (KNOWN_GAME_KEYS.indexOf(key) !== -1) {
            return true;
        }

        return startsWithAnyPrefix(key, KNOWN_GAME_PREFIXES);
    }

    function exportDataBundle() {
        var keys = getAllLocalStorageKeys();
        var records = {};

        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (!shouldIncludeInExport(key)) {
                continue;
            }
            records[key] = safeGetItem(key);
        }

        return {
            version: EXPORT_VERSION,
            exportedAt: getIsoNow(),
            keys: records
        };
    }

    function importDataBundle(bundle) {
        if (!isObject(bundle)) {
            return {
                imported: 0,
                success: false
            };
        }

        var records = isObject(bundle.keys) ? bundle.keys : bundle;
        var keys = Object.keys(records);
        var imported = 0;

        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            var value = records[key];
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }
            if (safeSetItem(key, value)) {
                imported += 1;
            }
        }

        return {
            imported: imported,
            success: imported > 0
        };
    }

    window.pcStorage = {
        safeGetItem: safeGetItem,
        safeSetItem: safeSetItem,
        safeRemoveItem: safeRemoveItem,
        getSyncMeta: getSyncMeta,
        touchField: touchField,
        setLastSyncedAt: setLastSyncedAt,
        getLastSyncedAt: getLastSyncedAt,
        getCaseCompletions: getCaseCompletions,
        countCaseCompletions: countCaseCompletions,
        markCaseCompleted: markCaseCompleted,
        getStudyPlan: getStudyPlan,
        setStudyPlan: setStudyPlan,
        getCurrentStreak: getCurrentStreak,
        getGameActivity: getGameActivity,
        setGameActivity: setGameActivity,
        buildLocalSyncPayload: buildLocalSyncPayload,
        applySyncData: applySyncData,
        exportDataBundle: exportDataBundle,
        importDataBundle: importDataBundle
    };
})();
