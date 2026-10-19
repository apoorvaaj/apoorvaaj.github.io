/*
  Blog series navigator.
  Adds a "Part X of Y" panel under the byline and previous/next links at the end
  of every article that belongs to a series.

  HOW TO ADD A NEW POST TO A SERIES
  1. Add its file name and title to the right series below, in reading order.
  2. Add <script src="series.js" defer></script> before </body> in the new post.
  To start a new series, add a new entry to SERIES.
*/
(function () {
  var SERIES = [
    {
      name: 'Feedback Without Fear',
      parts: [
        ['feedback-without-fear.html', 'Feedback Without Fear'],
        ['building-quaestio.html', 'Building Quaestio'],
        ['what-does-a-question-cost.html', 'What Does a Question Cost?'],
        ['who-taught-it-what-to-ask.html', 'Who Taught It What to Ask?']
      ]
    },
    {
      name: 'Vibe Coding, Deliberately',
      parts: [
        ['vibe-coding.html', 'Agile, Waterfall and the Vibe'],
        ['spontaneous-vs-deliberate.html', 'Spontaneous vs Deliberate']
      ]
    }
  ];

  var CSS =
    '.series-nav{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);padding:1.1rem 1.3rem 0.5rem;margin:0 0 2.4rem}' +
    '.series-nav .sn-label{font-size:0.64rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);font-weight:bold;margin-bottom:0.8rem}' +
    '.series-nav .sn-label span{color:var(--text-dimmer);font-weight:normal}' +
    '.series-nav ol{margin:0 0 0.5rem}' +
    '.series-nav li{font-size:0.86rem;line-height:1.6;margin-bottom:0.55rem}' +
    '.series-nav li a{text-decoration:none}' +
    '.series-nav li a:hover{text-decoration:underline}' +
    '.series-nav li[aria-current]{color:var(--text);font-weight:bold}' +
    '.series-nav li[aria-current]::before{background:var(--accent);color:#fff}' +
    '.series-pager{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:2.8rem 0 0}' +
    '.series-pager a{display:block;padding:1rem 1.2rem;border:1px solid var(--border);background:var(--surface);text-decoration:none;transition:border-color 0.2s}' +
    '.series-pager a:hover{border-color:var(--accent)}' +
    '.series-pager small{display:block;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-dimmer);margin-bottom:0.3rem}' +
    '.series-pager b{font-family:var(--serif);font-weight:500;font-size:1.05rem;line-height:1.35;color:var(--text)}' +
    '.series-pager .next{grid-column:2;text-align:right}' +
    '@media (max-width:768px){.series-pager{grid-template-columns:1fr}.series-pager .next{grid-column:auto}}' +
    '@media print{.series-pager{display:none}}';

  var file = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  var series = null, idx = -1;
  for (var s = 0; s < SERIES.length && !series; s++) {
    for (var p = 0; p < SERIES[s].parts.length; p++) {
      if (SERIES[s].parts[p][0] === file) { series = SERIES[s]; idx = p; break; }
    }
  }
  if (!series) return;

  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  var words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  var total = series.parts.length;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // Panel under the byline
  // An <aside>, not a <nav>: every page styles the bare <nav> element as the sticky site header
  var nav = document.createElement('aside');
  nav.className = 'series-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', series.name + ' series');
  var items = series.parts.map(function (part, i) {
    return i === idx
      ? '<li aria-current="page">' + esc(part[1]) + '</li>'
      : '<li><a href="' + part[0] + '">' + esc(part[1]) + '</a></li>';
  }).join('');
  nav.innerHTML = '<div class="sn-label">' + esc(series.name) + ' <span>· Part ' + (words[idx] || idx + 1) +
    ' of ' + (words[total - 1] || total) + '</span></div><ol>' + items + '</ol>';
  var byline = document.querySelector('article .byline');
  if (byline) byline.insertAdjacentElement('afterend', nav);

  // Previous / next at the end of the article
  var pager = document.createElement('div');
  pager.className = 'series-pager';
  var html = '';
  if (idx > 0) {
    var prev = series.parts[idx - 1];
    html += '<a class="prev" href="' + prev[0] + '"><small>← Part ' + idx + '</small><b>' + esc(prev[1]) + '</b></a>';
  }
  if (idx < total - 1) {
    var next = series.parts[idx + 1];
    html += '<a class="next" href="' + next[0] + '"><small>Part ' + (idx + 2) + ' →</small><b>' + esc(next[1]) + '</b></a>';
  }
  pager.innerHTML = html;
  var cta = document.querySelector('article .cta');
  var article = document.querySelector('article');
  if (cta) cta.insertAdjacentElement('beforebegin', pager);
  else if (article) article.appendChild(pager);
})();
