(function() {
  const input = document.getElementById('search-input');
  const resultsDiv = document.getElementById('search-results');

  if (!input || !resultsDiv || typeof searchIndex === 'undefined') return;

  input.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    resultsDiv.innerHTML = '';

    if (query.length < 2) return;

    const matches = searchIndex.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    const grouped = { case: [], game: [], profile: [] };
    matches.forEach(m => {
      if (grouped[m.type]) grouped[m.type].push(m);
    });

    let html = '';
    Object.keys(grouped).forEach(type => {
      if (grouped[type].length > 0) {
        html += `<h3>${type.charAt(0).toUpperCase() + type.slice(1)}s</h3>`;
        grouped[type].forEach(item => {
          html += `<div class="pc-result-item"><a href="${item.url}">${item.title}</a></div>`;
        });
      }
    });

    resultsDiv.innerHTML = html;
  });
})();
