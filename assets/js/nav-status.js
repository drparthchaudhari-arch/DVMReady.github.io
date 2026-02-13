(function () {
    var AUTH_STATE_KEY = 'pc_sync_auth_state';
    var GLOBAL_NAV_LINKS = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'today', label: 'Today', href: '/today/' },
        { id: 'play', label: 'Play', href: '/play/' },
        { id: 'bridge', label: 'Bridge', href: '/bridge/' },
        { id: 'study', label: 'Study', href: '/study/' },
        { id: 'profile', label: 'Profile', href: '/account/' }
    ];

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

    function getActiveNavId(pathname) {
        if (pathname === '/' || pathname === '/index.html') {
            return 'home';
        }

        if (pathname === '/today' || pathname.indexOf('/today/') === 0) {
            return 'today';
        }

        if (pathname === '/play' || pathname.indexOf('/play/') === 0) {
            return 'play';
        }

        if (pathname === '/bridge' || pathname.indexOf('/bridge/') === 0) {
            return 'bridge';
        }

        if (pathname === '/study' || pathname.indexOf('/study/') === 0) {
            return 'study';
        }

        if (
            pathname === '/account' ||
            pathname.indexOf('/account/') === 0 ||
            pathname === '/info' ||
            pathname === '/info.html'
        ) {
            return 'profile';
        }

        return 'home';
    }

    function hasTodayLink(container) {
        if (!container) {
            return false;
        }
        var links = container.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i += 1) {
            var href = links[i].getAttribute('href');
            if (href === '/today/' || href === '/today') {
                return true;
            }
        }
        return false;
    }

    function createPortalNavLink(link, activeId) {
        var anchor = document.createElement('a');
        anchor.className = 'pc-nav-link' + (link.id === activeId ? ' pc-is-active' : '');
        anchor.href = link.href;

        if (link.id === 'profile') {
            var indicator = document.createElement('span');
            indicator.className = 'pc-auth-indicator';
            indicator.setAttribute('data-pc-auth-indicator', '');
            indicator.setAttribute('aria-hidden', 'true');
            indicator.textContent = '○';
            anchor.appendChild(indicator);
        }

        anchor.appendChild(document.createTextNode(link.label));
        return anchor;
    }

    function createLegacyNavLink(link, activeId) {
        var anchor = document.createElement('a');
        anchor.className = 'pc-nav__link' + (link.id === activeId ? ' pc-nav__link--active' : '');
        anchor.href = link.href;
        anchor.textContent = link.label;
        return anchor;
    }

    function normalizePortalNav() {
        var groups = document.querySelectorAll('.pc-portal-nav .pc-nav-group');
        if (!groups.length) {
            return;
        }

        var pathname = window.location.pathname || '/';
        var activeId = getActiveNavId(pathname);

        for (var i = 0; i < groups.length; i += 1) {
            var group = groups[i];
            var modeToggle = group.querySelector('[data-pc-mode-toggle]');
            var themeToggle = group.querySelector('[data-pc-theme-toggle]');
            var insertBefore = modeToggle || themeToggle || null;

            var existingLinks = group.querySelectorAll('.pc-nav-link');
            for (var j = 0; j < existingLinks.length; j += 1) {
                existingLinks[j].remove();
            }

            for (var k = 0; k < GLOBAL_NAV_LINKS.length; k += 1) {
                var navLink = createPortalNavLink(GLOBAL_NAV_LINKS[k], activeId);
                if (insertBefore) {
                    group.insertBefore(navLink, insertBefore);
                } else {
                    group.appendChild(navLink);
                }
            }
        }
    }

    function normalizeLegacyNav() {
        var legacyGroups = document.querySelectorAll('.pc-nav .pc-nav__links');
        if (!legacyGroups.length) {
            return;
        }

        var pathname = window.location.pathname || '/';
        var activeId = getActiveNavId(pathname);

        for (var i = 0; i < legacyGroups.length; i += 1) {
            var group = legacyGroups[i];
            group.innerHTML = '';
            for (var j = 0; j < GLOBAL_NAV_LINKS.length; j += 1) {
                group.appendChild(createLegacyNavLink(GLOBAL_NAV_LINKS[j], activeId));
            }
        }
    }

    function ensureTodayFooterLink() {
        var footerLinks = document.querySelectorAll('.pc-footer-links');
        for (var i = 0; i < footerLinks.length; i += 1) {
            var footer = footerLinks[i];
            if (hasTodayLink(footer)) {
                continue;
            }
            var todayLink = document.createElement('a');
            todayLink.href = '/today/';
            todayLink.textContent = 'Today';
            footer.appendChild(todayLink);
        }
    }

    function ensureTodayQuickLinks() {
        var strips = document.querySelectorAll('.pc-link-strip');
        for (var i = 0; i < strips.length; i += 1) {
            var strip = strips[i];
            if (hasTodayLink(strip)) {
                continue;
            }
            var chip = document.createElement('a');
            chip.className = 'pc-link-chip';
            chip.href = '/today/';
            chip.textContent = 'Today';
            strip.appendChild(chip);
        }
    }

    function appendGlobalQuickLinksIfMissing() {
        if (document.querySelector('[data-pc-global-quick-links]')) {
            return;
        }

        if (document.querySelector('.pc-link-strip') || document.querySelector('.pc-footer-links')) {
            return;
        }

        var main = document.querySelector('main');
        if (!main) {
            return;
        }

        var strip = document.createElement('div');
        strip.className = 'pc-link-strip';
        strip.setAttribute('data-pc-global-quick-links', 'true');
        strip.setAttribute('aria-label', 'Quick links');

        for (var i = 0; i < GLOBAL_NAV_LINKS.length; i += 1) {
            var link = document.createElement('a');
            link.className = 'pc-link-chip';
            link.href = GLOBAL_NAV_LINKS[i].href;
            link.textContent = GLOBAL_NAV_LINKS[i].label;
            strip.appendChild(link);
        }

        main.appendChild(strip);
    }

    function init() {
        normalizePortalNav();
        normalizeLegacyNav();
        ensureTodayFooterLink();
        ensureTodayQuickLinks();
        appendGlobalQuickLinksIfMissing();

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
