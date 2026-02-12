(function () {
  var input = document.getElementById('search-input');
  var resultsDiv = document.getElementById('search-results');
  var summary = document.getElementById('pc-search-summary');

  if (!input || !resultsDiv || typeof searchIndex === 'undefined') {
    return;
  }

  function renderResults(matches) {
    if (!matches.length) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      if (summary) {
        summary.textContent = 'No results found for your keyword.';
      }
      return;
    }

    var grouped = { case: [], game: [], profile: [], resource: [] };
    for (var i = 0; i < matches.length; i += 1) {
      var item = matches[i];
      if (grouped[item.type]) {
        grouped[item.type].push(item);
      }
    }

    var labels = {
      case: 'Cases',
      game: 'Games',
      profile: 'Profiles',
      resource: 'Resources'
    };

    var html = '';
    var keys = Object.keys(grouped);
    for (var j = 0; j < keys.length; j += 1) {
      var type = keys[j];
      var items = grouped[type];
      if (!items.length) {
        continue;
      }

      html += '<section class="pc-search-group">';
      html += '<h3>' + labels[type] + '</h3>';

      for (var k = 0; k < items.length; k += 1) {
        html += '<div class="pc-result-item"><a href="' + items[k].url + '">' + items[k].title + '</a></div>';
      }

      html += '</section>';
    }

    resultsDiv.innerHTML = html;
    if (summary) {
      summary.textContent = matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' found.';
    }
  }

  input.addEventListener('input', function () {
    var query = input.value.toLowerCase().trim();
    resultsDiv.innerHTML = '';

    if (query.length < 2) {
      if (summary) {
        summary.textContent = 'Type at least 2 characters to search.';
      }
      return;
    }

    var matches = searchIndex.filter(function (item) {
      return item.title.toLowerCase().indexOf(query) !== -1 || item.keywords.toLowerCase().indexOf(query) !== -1;
    });

    renderResults(matches);
  });
})();
