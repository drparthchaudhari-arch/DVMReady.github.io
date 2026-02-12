(function () {
    var MODE_KEY = 'siteMode';
    var THEME_KEY = 'siteTheme';
    var VALID_MODES = ['pro', 'play'];
    var VALID_THEMES = ['light', 'dark'];

    function readSetting(key, fallback, validValues) {
        try {
            var value = localStorage.getItem(key);
            if (validValues.indexOf(value) !== -1) {
                return value;
            }
        } catch (error) {
            // localStorage may be unavailable in restricted contexts.
        }
        return fallback;
    }

    var currentMode = readSetting(MODE_KEY, 'pro', VALID_MODES);
    var currentTheme = readSetting(THEME_KEY, 'light', VALID_THEMES);

    function writeSetting(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Persisting is optional; continue with in-memory values.
        }
    }

    function modeLabel(value) {
        return value === 'play' ? 'Mode: Play' : 'Mode: Professional';
    }

    function themeLabel(value) {
        return value === 'dark' ? 'Theme: Night' : 'Theme: Day';
    }

    function applySettings() {
        var root = document.documentElement;
        root.setAttribute('data-mode', currentMode);
        root.setAttribute('data-theme', currentTheme);

        if (document.body) {
            document.body.setAttribute('data-mode', currentMode);
            document.body.setAttribute('data-theme', currentTheme);
        }

        var modeButtons = document.querySelectorAll('[data-pc-mode-toggle]');
        for (var i = 0; i < modeButtons.length; i += 1) {
            modeButtons[i].setAttribute('aria-pressed', String(currentMode === 'play'));
            modeButtons[i].setAttribute('aria-label', 'Toggle site mode. Current setting: ' + modeLabel(currentMode));
        }

        var modeLabels = document.querySelectorAll('[data-pc-mode-label]');
        for (var j = 0; j < modeLabels.length; j += 1) {
            modeLabels[j].textContent = modeLabel(currentMode);
        }

        var themeButtons = document.querySelectorAll('[data-pc-theme-toggle]');
        for (var k = 0; k < themeButtons.length; k += 1) {
            themeButtons[k].setAttribute('aria-pressed', String(currentTheme === 'dark'));
            themeButtons[k].setAttribute('aria-label', 'Toggle day or night theme. Current setting: ' + themeLabel(currentTheme));
        }

        var themeLabels = document.querySelectorAll('[data-pc-theme-label]');
        for (var n = 0; n < themeLabels.length; n += 1) {
            themeLabels[n].textContent = themeLabel(currentTheme);
        }
    }

    function toggleMode() {
        currentMode = currentMode === 'pro' ? 'play' : 'pro';
        writeSetting(MODE_KEY, currentMode);
        applySettings();
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        writeSetting(THEME_KEY, currentTheme);
        applySettings();
    }

    function bindButtons() {
        var modeButtons = document.querySelectorAll('[data-pc-mode-toggle]');
        for (var i = 0; i < modeButtons.length; i += 1) {
            if (modeButtons[i].dataset.pcToggleBound === 'true') {
                continue;
            }
            modeButtons[i].dataset.pcToggleBound = 'true';
            modeButtons[i].addEventListener('click', toggleMode);
        }

        var themeButtons = document.querySelectorAll('[data-pc-theme-toggle]');
        for (var j = 0; j < themeButtons.length; j += 1) {
            if (themeButtons[j].dataset.pcToggleBound === 'true') {
                continue;
            }
            themeButtons[j].dataset.pcToggleBound = 'true';
            themeButtons[j].addEventListener('click', toggleTheme);
        }
    }

    function init() {
        bindButtons();
        applySettings();
    }

    applySettings();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    window.addEventListener('storage', function (event) {
        if (event.key === MODE_KEY && VALID_MODES.indexOf(event.newValue) !== -1) {
            currentMode = event.newValue;
            applySettings();
        }
        if (event.key === THEME_KEY && VALID_THEMES.indexOf(event.newValue) !== -1) {
            currentTheme = event.newValue;
            applySettings();
        }
    });
})();
