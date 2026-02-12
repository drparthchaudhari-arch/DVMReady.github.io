(function () {
    function normalize(text) {
        return String(text || '').toLowerCase().trim();
    }

    function itemMatches(item, query) {
        if (!query) {
            return false;
        }

        var haystack = [item.title, item.description].join(' ').toLowerCase();
        var keywords = (item.keywords || []).join(' ').toLowerCase();
        return haystack.indexOf(query) !== -1 || keywords.indexOf(query) !== -1;
    }

    function groupByCategory(items) {
        var groups = {};
        for (var i = 0; i < items.length; i += 1) {
            var category = items[i].category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(items[i]);
        }
        return groups;
    }

    function createResultItem(item) {
        var wrapper = document.createElement('article');
        wrapper.className = 'pc-result-item';

        var title = document.createElement('h4');
        var link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        title.appendChild(link);

        var desc = document.createElement('p');
        desc.textContent = item.description;

        var keywords = document.createElement('p');
        keywords.className = 'pc-result-keywords';
        keywords.textContent = 'Keywords: ' + (item.keywords || []).join(', ');

        wrapper.appendChild(title);
        wrapper.appendChild(desc);
        wrapper.appendChild(keywords);
        return wrapper;
    }

    function renderResults(results, resultsRoot, summaryRoot, query) {
        resultsRoot.innerHTML = '';

        if (!query) {
            summaryRoot.textContent = 'Type a keyword to search cases, games, and resources.';
            return;
        }

        if (!results.length) {
            summaryRoot.textContent = 'No results found for "' + query + '".';
            return;
        }

        summaryRoot.textContent = results.length + ' result(s) for "' + query + '".';

        var groups = groupByCategory(results);
        var order = ['Case Studies', 'Games', 'Resources', 'Other'];

        for (var i = 0; i < order.length; i += 1) {
            var category = order[i];
            if (!groups[category] || !groups[category].length) {
                continue;
            }

            var section = document.createElement('section');
            section.className = 'pc-search-group';

            var heading = document.createElement('h3');
            heading.textContent = category;
            section.appendChild(heading);

            for (var j = 0; j < groups[category].length; j += 1) {
                section.appendChild(createResultItem(groups[category][j]));
            }

            resultsRoot.appendChild(section);
        }
    }

    function updateQueryInUrl(query) {
        var url = new URL(window.location.href);
        if (query) {
            url.searchParams.set('q', query);
        } else {
            url.searchParams.delete('q');
        }
        window.history.replaceState({}, '', url.toString());
    }

    function initSearch() {
        var data = window.PC_SEARCH_INDEX || [];
        var form = document.getElementById('pc-search-form');
        var input = document.getElementById('pc-search-input');
        var resultsRoot = document.getElementById('pc-search-results');
        var summaryRoot = document.getElementById('pc-search-summary');

        if (!form || !input || !resultsRoot || !summaryRoot) {
            return;
        }

        var initialQuery = normalize(new URLSearchParams(window.location.search).get('q'));
        if (initialQuery) {
            input.value = initialQuery;
        }

        function runSearch(rawValue) {
            var query = normalize(rawValue);
            var results = [];

            for (var i = 0; i < data.length; i += 1) {
                if (itemMatches(data[i], query)) {
                    results.push(data[i]);
                }
            }

            renderResults(results, resultsRoot, summaryRoot, query);
            updateQueryInUrl(query);
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            runSearch(input.value);
        });

        input.addEventListener('input', function () {
            runSearch(input.value);
        });

        runSearch(initialQuery);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch, { once: true });
    } else {
        initSearch();
    }
})();
