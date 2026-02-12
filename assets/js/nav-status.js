(function () {
    var AUTH_STATE_KEY = 'pc_sync_auth_state';

    function isLoggedInFromCache() {
        try {
            return localStorage.getItem(AUTH_STATE_KEY) === 'signed_in';
        } catch (error) {
            return false;
        }
    }

    function applyIndicator(loggedIn) {
        var indicators = document.querySelectorAll('[data-pc-auth-indicator]');
        for (var i = 0; i < indicators.length; i += 1) {
            var indicator = indicators[i];
            indicator.textContent = loggedIn ? '●' : '○';
            indicator.classList.toggle('pc-auth-indicator--on', loggedIn);
            indicator.classList.toggle('pc-auth-indicator--off', !loggedIn);
            indicator.setAttribute('title', loggedIn ? 'Logged in' : 'Anonymous mode');
        }
    }

    function init() {
        applyIndicator(isLoggedInFromCache());

        window.addEventListener('storage', function (event) {
            if (event.key === AUTH_STATE_KEY) {
                applyIndicator(event.newValue === 'signed_in');
            }
        });

        window.addEventListener('pc-auth-status-change', function (event) {
            var loggedIn = !!(event && event.detail && event.detail.loggedIn);
            applyIndicator(loggedIn);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
