/* Travel AI — application logic
   V2.4 (repaired build) */

'use strict';

const CFG = window.TRAVEL_CONFIG || {};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ---------- STATE ---------- */

let selectedCode = CFG.DEFAULT_COUNTRY || 'IN';
let selectedCountry = null;
let currentIntelAction = 'travel';
let countryLoadToken = 0;
let scanTimer = null;
let scanFailSafe = null;
let mapReady = false;

let profile = readJSON('travel_ai_profile', null) ||
  Object.assign({ passportCountry: 'IN', homeCurrency: 'INR', travelStyle: 'Mid-range', interests: [] }, CFG.DEFAULT_PROFILE || {});
let savedTrips = readJSON('travel_ai_saved', []) || [];
if (!Array.isArray(savedTrips)) savedTrips = [];

const countryCache = new Map();

/* ---------- ALIASES ---------- */

const aliases = {
  'usa': 'US', 'u.s.': 'US', 'u.s.a.': 'US', 'us': 'US', 'america': 'US',
  'united states': 'US', 'united states of america': 'US', 'states': 'US',
  'uk': 'GB', 'u.k.': 'GB', 'britain': 'GB', 'great britain': 'GB',
  'england': 'GB', 'scotland': 'GB', 'wales': 'GB', 'northern ireland': 'GB',
  'uae': 'AE', 'u.a.e.': 'AE', 'emirates': 'AE', 'dubai': 'AE', 'abu dhabi': 'AE',
  'south korea': 'KR', 'korea': 'KR', 'republic of korea': 'KR', 's korea': 'KR',
  'north korea': 'KP', 'dprk': 'KP',
  'russia': 'RU', 'russian federation': 'RU',
  'vietnam': 'VN', 'viet nam': 'VN',
  'czech republic': 'CZ', 'czechia': 'CZ',
  'holland': 'NL', 'the netherlands': 'NL', 'netherlands': 'NL',
  'turkey': 'TR', 'turkiye': 'TR', 'türkiye': 'TR',
  'burma': 'MM', 'myanmar': 'MM',
  'ivory coast': 'CI', "cote d'ivoire": 'CI',
  'cape verde': 'CV', 'cabo verde': 'CV',
  'swaziland': 'SZ', 'eswatini': 'SZ',
  'macedonia': 'MK', 'north macedonia': 'MK',
  'east timor': 'TL', 'timor leste': 'TL',
  'laos': 'LA', 'lao pdr': 'LA',
  'syria': 'SY', 'iran': 'IR',
  'bolivia': 'BO', 'venezuela': 'VE', 'tanzania': 'TZ',
  'congo': 'CD', 'drc': 'CD', 'dr congo': 'CD',
  'bosnia': 'BA', 'herzegovina': 'BA',
  'taiwan': 'TW', 'hong kong': 'HK', 'macau': 'MO', 'macao': 'MO',
  'palestine': 'PS', 'vatican': 'VA', 'vatican city': 'VA',
  'saudi': 'SA', 'saudi arabia': 'SA',
  'sri lanka': 'LK', 'ceylon': 'LK',
  'new zealand': 'NZ', 'nz': 'NZ',
  'south africa': 'ZA', 'ksa': 'SA',
  'ireland': 'IE', 'eire': 'IE',
  'india': 'IN', 'bharat': 'IN'
};

/* ---------- LOCAL GUIDES (optional editorial overrides) ---------- */

const guides = {
  IN: {
    tagline: 'Incredible diversity. Timeless experiences.',
    intro: 'India rewards focused travel: choose one or two regions rather than trying to see everything in one trip.',
    places: [
      ['Taj Mahal', 'Agra', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80'],
      ['Jaipur', 'Rajasthan', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80'],
      ['Kerala Backwaters', 'Kerala', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80'],
      ['Varanasi', 'Uttar Pradesh', 'https://images.unsplash.com/photo-1561361058-c24e02d6e8d9?auto=format&fit=crop&w=700&q=80'],
      ['Ladakh', 'Himalayas', 'https://images.unsplash.com/photo-1626014303757-6366ef55c4ab?auto=format&fit=crop&w=700&q=80'],
      ['Goa', 'Coast', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80']
    ]
  },
  JP: {
    tagline: 'Ancient traditions. Future-forward cities.',
    intro: 'Japan is easy to navigate and works especially well for city, food, culture and rail-based travel.',
    places: [
      ['Tokyo', 'Kanto', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=700&q=80'],
      ['Kyoto', 'Kansai', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80'],
      ['Osaka', 'Kansai', 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=700&q=80'],
      ['Mount Fuji', 'Honshu', 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=700&q=80']
    ]
  }
};

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85';

/* ---------- SMALL HELPERS ---------- */

function readJSON(key, dflt) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : dflt; }
  catch (e) { return dflt; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage disabled */ }
}
function esc(s) {
  return String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}
function flagEmoji(code) {
  const c = String(code || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return '🌍';
  return c.replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}
function compactPopulation(n) {
  n = Number(n) || 0;
  if (!n) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' Billion';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + ' Million';
  return n.toLocaleString();
}
function firstCurrency(c) {
  const e = Object.entries((c && c.currencies) || {});
  return e.length ? Object.assign({ code: e[0][0] }, e[0][1]) : { code: 'USD', name: 'US Dollar', symbol: '$' };
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function normalizeQuery(q) { return String(q || '').trim().replace(/\s+/g, ' '); }
function setText(sel, value) { const el = $(sel); if (el) el.textContent = value; }
function setHTML(sel, value) { const el = $(sel); if (el) el.innerHTML = value; }

/* Only http/https links are ever rendered. */
function safeUrl(u) {
  try {
    const parsed = new URL(String(u));
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? parsed.href : '';
  } catch (e) { return ''; }
}

function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 20000);
  return fetch(url, Object.assign({ signal: ctrl.signal }, opts || {}))
    .finally(() => clearTimeout(t));
}

/* ---------- BRIEF RENDERER ---------- */

function renderBriefText(text) {
  const lines = String(text || '').split(/\n/).map(x => x.trim()).filter(Boolean);
  if (!lines.length) return '<div class="brief-empty">Nothing came back for this request. Try Refresh.</div>';

  const headings = new Set([
    'QUICK ANSWER', 'KEY POINTS', 'CHECK BEFORE YOU GO',
    'VISA STATUS', 'BASIC REQUIREMENTS', 'BEFORE BOOKING',
    'SAFETY LEVEL', 'WATCH FOR', 'SMART PRECAUTION',
    'TRAVEL BASICS', 'BEST FOR', 'PRACTICAL TIPS',
    'TRIP STYLE', 'ROUTE', 'DAY PLAN', 'BUDGET NOTE', 'BOOK FIRST',
    'ESTIMATED TOTAL', 'BASIC BREAKDOWN', 'SAVE MONEY',
    'QUICK COMPARISON', 'RECOMMENDATION'
  ]);

  let html = '', inList = false;
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };

  for (const raw of lines) {
    const line = raw.replace(/\*\*/g, '').replace(/^#{1,6}\s*/, '').trim();
    if (!line) continue;
    const upper = line.replace(/[:：]\s*$/, '').toUpperCase();

    if (headings.has(upper)) {
      closeList();
      html += '<div class="brief-section-title">' + esc(line.replace(/[:：]\s*$/, '')) + '</div>';
      continue;
    }

    if (/^(•|[-*+])\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      if (!inList) { html += '<ul class="brief-list">'; inList = true; }
      html += '<li>' + esc(line.replace(/^(•|[-*+])\s+/, '').replace(/^\d+[.)]\s+/, '')) + '</li>';
      continue;
    }

    closeList();

    if (/^Day\s+\d+\s*:/i.test(line)) html += '<div class="brief-day">' + esc(line) + '</div>';
    else if (/^[A-Za-z][A-Za-z /&-]{1,24}:\s+/.test(line)) html += '<div class="brief-fact">' + esc(line) + '</div>';
    else html += '<p class="brief-copy">' + esc(line) + '</p>';
  }

  closeList();
  return html;
}

/* ---------- BACKEND ---------- */

function api(action, params) {
  if (!CFG.API_URL) {
    return Promise.reject(new Error('The AI backend is not connected yet. Add your Apps Script /exec URL to js/config.js as API_URL.'));
  }

  let u;
  try { u = new URL(CFG.API_URL); }
  catch (e) { return Promise.reject(new Error('API_URL in js/config.js is not a valid URL.')); }

  u.searchParams.set('action', action);
  Object.entries(params || {}).forEach(([k, v]) => u.searchParams.set(k, String(v ?? '')));

  return fetchWithTimeout(u.toString(), { cache: 'no-store', redirect: 'follow' }, CFG.REQUEST_TIMEOUT_MS || 60000)
    .then(async r => {
      const body = await r.text();
      let j;
      try { j = JSON.parse(body); }
      catch (e) {
        throw new Error('The backend returned a page instead of data. Re-deploy the Apps Script web app with access set to "Anyone", then copy the new /exec URL.');
      }
      if (!j.ok) throw new Error(j.error || 'The backend rejected that request.');
      return j;
    })
    .catch(err => {
      if (err && err.name === 'AbortError') throw new Error('The backend took too long to answer. Try again.');
      if (err instanceof TypeError) throw new Error('Could not reach the backend. Check API_URL and that the web app is deployed to "Anyone".');
      throw err;
    });
}

function renderSources(selector, sources) {
  const el = $(selector);
  if (!el) return;
  const seen = new Set();
  const unique = [];
  (sources || []).forEach(s => {
    const url = safeUrl(s && s.url);
    if (!url || seen.has(url)) return;
    seen.add(url);
    unique.push({ url, name: (s && s.name) || '' });
  });
  el.innerHTML = unique.slice(0, 6).map((s, i) =>
    '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(s.url) + '">' +
    esc(s.name || ('Source ' + (i + 1))) + '</a>'
  ).join('');
}

/* ---------- SCAN OVERLAY ---------- */

function scanReset() {
  ['scanGeo', 'scanFx', 'scanWx', 'scanAi'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('ok');
  });
}
function scanMark(id) { const el = document.getElementById(id); if (el) el.classList.add('ok'); }

function setScan(percent, text) {
  const bar = $('#scanProgress');
  if (bar) bar.style.width = Math.max(0, Math.min(100, percent)) + '%';
  setText('#scanStep', text || '');
}

function openScan(name, code) {
  clearTimeout(scanTimer);
  clearTimeout(scanFailSafe);
  scanReset();
  setText('#scanCountry', name || 'Synchronizing destination');
  setText('#scanFlag', code ? flagEmoji(code) : '🌍');
  setScan(4, 'Acquiring geographic target...');
  const ov = $('#scanOverlay');
  if (ov) { ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('scan-open');
  /* Nothing may leave the overlay stuck on screen. */
  scanFailSafe = setTimeout(hideScan, 25000);
}

function closeScan(message) {
  setScan(100, message || 'Destination intelligence synchronized.');
  clearTimeout(scanTimer);
  scanTimer = setTimeout(hideScan, 450);
}

function hideScan() {
  clearTimeout(scanFailSafe);
  const ov = $('#scanOverlay');
  if (ov) { ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true'); }
  document.body.classList.remove('scan-open');
}

/* ---------- COUNTRY RESOLUTION (local dataset) ---------- */

const COUNTRIES = Array.isArray(window.TRAVEL_COUNTRIES) ? window.TRAVEL_COUNTRIES : [];
const BY_CODE = new Map();
COUNTRIES.forEach(c => {
  if (c.cca2) BY_CODE.set(c.cca2.toUpperCase(), c);
  if (c.cca3) BY_CODE.set(c.cca3.toUpperCase(), c);
});

const DATASET_MISSING = 'Country data did not load. Check that js/countries.js is uploaded next to js/app.js.';

function fetchCountryByCode(code) {
  return new Promise((resolve, reject) => {
    if (!COUNTRIES.length) return reject(new Error(DATASET_MISSING));
    const c = BY_CODE.get(String(code || '').toUpperCase());
    if (!c) return reject(new Error('No country uses the code "' + code + '".'));
    resolve(c);
  });
}

/* Score a country against a query. Higher is better; 0 means no match. */
function matchScore(c, low) {
  const common = String(c.name.common || '').toLowerCase();
  const official = String(c.name.official || '').toLowerCase();

  if (c.cca2.toLowerCase() === low) return 100;
  if (String(c.cca3 || '').toLowerCase() === low) return 98;
  if (common === low) return 96;
  if (official === low) return 92;

  for (const alt of c.altSpellings || []) {
    if (String(alt).toLowerCase() === low) return 88;
  }

  // Two-letter input is a country code, not a fragment. Do not fuzzy-match it.
  if (low.length < 3) return 0;

  if (common.indexOf(low) === 0) return 80 - Math.min(common.length, 30) * 0.1;
  if (official.indexOf(low) === 0) return 70;

  // Match the start of any word: "guinea" finds "Papua New Guinea".
  if (new RegExp('\\b' + low.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(common)) return 60;
  if (common.indexOf(low) > -1) return 50;
  if (official.indexOf(low) > -1) return 40;

  for (const alt of c.altSpellings || []) {
    if (String(alt).toLowerCase().indexOf(low) > -1) return 30;
  }

  const cap = ((c.capital || [])[0] || '').toLowerCase();
  if (cap && cap.indexOf(low) === 0) return 25;

  return 0;
}

function rankCountries(q, limit) {
  const low = normalizeQuery(q).toLowerCase();
  if (!low) return [];

  const aliasCode = aliases[low];
  const scored = [];

  for (const c of COUNTRIES) {
    let score = matchScore(c, low);
    if (aliasCode && c.cca2 === aliasCode) score = Math.max(score, 99);
    if (score > 0) scored.push({ c, score });
  }

  scored.sort((a, b) => b.score - a.score ||
    String(a.c.name.common).length - String(b.c.name.common).length);

  return scored.slice(0, limit || 6).map(x => x.c);
}

function resolveCountry(input) {
  return new Promise((resolve, reject) => {
    const q = normalizeQuery(input);
    if (!q) return reject(new Error('Type a country name to begin.'));
    if (!COUNTRIES.length) return reject(new Error(DATASET_MISSING));

    const low = q.toLowerCase();
    if (aliases[low] && BY_CODE.has(aliases[low])) return resolve(aliases[low]);

    const best = rankCountries(q, 1)[0];
    if (!best) return reject(new Error('No country matches "' + q + '".'));
    resolve(best.cca2);
  });
}

/* ---------- COUNTRY SELECTION ---------- */

async function selectCountry(input, source, silent) {
  const token = ++countryLoadToken;
  const raw = normalizeQuery(input);
  const looksLikeCode = /^[A-Za-z]{2}$/.test(raw);

  if (!silent) openScan(looksLikeCode ? '' : raw, looksLikeCode ? raw.toUpperCase() : '');

  try {
    if (!silent) setScan(12, source === 'map' ? 'Locking map coordinates...' : 'Resolving destination identity...');
    const code = looksLikeCode ? raw.toUpperCase() : await resolveCountry(raw);
    if (token !== countryLoadToken) return;

    if (!silent) { scanMark('scanGeo'); setScan(28, 'Loading country intelligence...'); }
    const country = await fetchCountryByCode(code);
    if (token !== countryLoadToken) return;

    selectedCountry = country;
    selectedCode = country.cca2;

    if (!silent) {
      setText('#scanCountry', (country.name && country.name.common) || country.cca2);
      setText('#scanFlag', country.flag || flagEmoji(country.cca2));
      setScan(43, 'Rendering destination profile...');
    }

    renderCountry();
    if (!silent) await wait(120);

    if (!silent) setScan(60, 'Synchronizing exchange rate and weather...');
    const fx = loadRate().then(() => scanMark('scanFx'));
    const wx = loadWeather().then(() => scanMark('scanWx'));
    await Promise.allSettled([fx, wx]);
    if (token !== countryLoadToken) return;

    if (!silent) {
      setScan(86, 'Preparing traveller context...');
      closeScan();
      if (source !== 'initial') {
        setTimeout(() => {
          const sec = $('#countrySection');
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 520);
      }
    }

    if (CFG.AUTO_AI_SNAPSHOT !== false) {
      generateSnapshot(country).finally(() => scanMark('scanAi'));
    }
  } catch (e) {
    if (token !== countryLoadToken) return;
    if (silent) {
      setHTML('#countryAiText', '<div class="brief-empty">' + esc(e.message) + '</div>');
    } else {
      setText('#scanCountry', 'Destination not found');
      setScan(100, e.message || 'That destination could not be loaded.');
      setTimeout(hideScan, 1400);
    }
  } finally {
    /* Guarantees the overlay can never trap the page. */
    if (!silent) setTimeout(() => {
      const ov = $('#scanOverlay');
      if (ov && ov.classList.contains('open') && token === countryLoadToken) hideScan();
    }, 6000);
  }
}

/* ---------- SEARCH / AUTOCOMPLETE ---------- */

function searchCountries(q) {
  q = normalizeQuery(q);
  if (q.length < 2) return [];
  return rankCountries(q, 6);
}

function bindCountrySearch(inputSelector, resultSelector, buttonSelector) {
  const input = $(inputSelector);
  const box = $(resultSelector);
  if (!input) return;

  let active = -1;
  let items = [];

  function close() {
    if (box) { box.classList.remove('open'); box.innerHTML = ''; }
    input.setAttribute('aria-expanded', 'false');
    active = -1;
    items = [];
  }

  function highlight(i) {
    const nodes = box ? [...box.querySelectorAll('.search-result')] : [];
    nodes.forEach(n => n.classList.remove('active'));
    if (i >= 0 && nodes[i]) {
      nodes[i].classList.add('active');
      nodes[i].scrollIntoView({ block: 'nearest' });
    }
    active = i;
  }

  function choose(i) {
    const c = items[i];
    if (!c) return;
    input.value = (c.name && c.name.common) || c.cca2;
    close();
    selectCountry(c.cca2, 'search');
  }

  function render(list) {
    if (!box) return;
    items = list;
    active = -1;
    if (!list.length) {
      box.innerHTML = '<div class="search-empty">No country matches that. Try the full name or a 2-letter code.</div>';
      box.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
      return;
    }
    box.innerHTML = list.map((c, i) =>
      '<div class="search-result" role="option" data-index="' + i + '">' +
      '<span><b>' + esc(c.flag || flagEmoji(c.cca2)) + ' ' + esc((c.name && c.name.common) || '') + '</b>' +
      '<small>' + esc(c.region || '') + '</small></span>' +
      '<small>' + esc(c.cca2 || '') + '</small></div>'
    ).join('');
    box.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
    box.querySelectorAll('.search-result').forEach(el => {
      el.addEventListener('mousedown', ev => { ev.preventDefault(); choose(Number(el.dataset.index)); });
    });
  }

  input.addEventListener('input', () => {
    const q = input.value;
    if (normalizeQuery(q).length < 2) { close(); return; }
    render(searchCountries(q));
  });

  input.addEventListener('keydown', e => {
    const open = box && box.classList.contains('open') && items.length;
    if (e.key === 'ArrowDown' && open) { e.preventDefault(); highlight(Math.min(active + 1, items.length - 1)); return; }
    if (e.key === 'ArrowUp' && open) { e.preventDefault(); highlight(Math.max(active - 1, 0)); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (open && active >= 0) { choose(active); return; }
      close();
      selectCountry(input.value, 'search');
      return;
    }
    if (e.key === 'Escape') close();
  });

  input.addEventListener('blur', () => setTimeout(close, 120));

  if (buttonSelector) {
    const btn = $(buttonSelector);
    if (btn) btn.addEventListener('click', () => {
      close();
      selectCountry(input.value, 'search');
    });
  }
}

document.addEventListener('click', e => {
  if (!e.target.closest('.search-shell')) {
    $$('.search-results').forEach(x => { x.classList.remove('open'); });
  }
});

/* ---------- RENDERING ---------- */

function renderProfile() {
  setText('#profilePassport', 'Passport: ' + profile.passportCountry + ' ' + flagEmoji(profile.passportCountry));
  setText('#profileCurrency', 'Home currency: ' + profile.homeCurrency);
}

function renderCountry() {
  const c = selectedCountry;
  if (!c) return;
  const g = guides[c.cca2] || {};
  const cur = firstCurrency(c);

  setText('#countryFlag', c.flag || flagEmoji(c.cca2));
  setText('#countryName', (c.name && c.name.common) || 'Country');
  setText('#countryTagline', g.tagline || 'Explore the essentials before you go.');
  setText('#countryRegionBadge', c.region || '—');
  setText('#countrySubregionBadge', c.subregion || c.region || '—');

  setText('#capital', (c.capital || ['—'])[0]);
  setText('#currency', cur.name ? (cur.name + ' (' + cur.code + ')') : cur.code);
  setText('#languages', Object.values(c.languages || {}).slice(0, 3).join(', ') || '—');
  setText('#population', compactPopulation(c.population));
  const zones = c.timezones || [];
  setText('#timezone', (zones[0] || '—') + (zones.length > 1 ? '  (' + zones.length + ' zones)' : ''));
  setText('#callingCode', c.callingCode || ((c.idd && c.idd.root) || '—'));
  setText('#drivingSide', (c.car && c.car.side) ? (c.car.side + ' side') : '—');

  setText('#countryIntro', g.intro ||
    ((c.name && c.name.common) + ' is in ' + (c.subregion || c.region || 'the world') +
     '. Check the facts below, then open a tab for a short AI brief and official links.'));

  renderFacts(c, cur);
  renderPlaces(c, g);

  const photo = $('#countryPhoto');
  if (photo) {
    const p = (g.places || [])[0];
    const src = p ? p[2] : FALLBACK_PHOTO;
    photo.style.backgroundImage = "linear-gradient(to top,#05131dc9,#05131d10),url('" + src + "')";
  }

  syncSaveButton();
  showOverview();
}

function renderFacts(c, cur) {
  const facts = [
    ['Continent', (c.continents || [])[0] || c.region || '—'],
    ['Region', c.subregion || c.region || '—'],
    ['Capital', (c.capital || ['—'])[0]],
    ['Area', c.area ? Number(c.area).toLocaleString() + ' km²' : '—'],
    ['Population', compactPopulation(c.population)],
    ['Language', Object.values(c.languages || {})[0] || '—'],
    ['Currency', cur.code],
    ['Time zone', (c.timezones || ['—'])[0]],
    ['Calling code', c.callingCode || '—'],
    ['Driving', (c.car && c.car.side) || '—']
  ];
  setHTML('#quickFacts', facts.map(x =>
    '<div class="fact-row"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>'
  ).join(''));
}

function renderPlaces(c, g) {
  const cap = (c.capital || ['The capital'])[0];
  const generic = [
    [cap + ' highlights', cap, FALLBACK_PHOTO],
    ['Historic district', 'Heritage', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80'],
    ['Nature escape', 'Scenic region', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'],
    ['Local market', 'City experience', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=700&q=80']
  ];
  const list = (g.places && g.places.length ? g.places : generic).slice(0, 6);
  setHTML('#placesGrid', list.map(p =>
    '<article class="place-card">' +
    '<img src="' + esc(safeUrl(p[2]) || FALLBACK_PHOTO) + '" alt="" loading="lazy" ' +
    'onerror="this.onerror=null;this.src=\'' + FALLBACK_PHOTO + '\'">' +
    '<div class="place-body"><b>' + esc(p[0]) + '</b><small>' + esc(p[1]) + '</small></div>' +
    '</article>'
  ).join(''));
}

/* ---------- EXCHANGE RATE ---------- */

async function getRate(from, to) {
  from = String(from || '').toUpperCase();
  to = String(to || '').toUpperCase();
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) throw new Error('Use 3-letter currency codes.');
  if (from === to) return { rate: 1, date: 'Same currency' };

  const cacheKey = 'fx_' + from + '_' + to;
  try {
    const hit = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
    if (hit && Date.now() - hit.t < 30 * 60 * 1000) return { rate: hit.rate, date: hit.date };
  } catch (e) { /* ignore */ }

  let out = null;

  /* Primary: open.er-api.com — broad currency coverage, no key. */
  try {
    const r = await fetchWithTimeout((CFG.FX_PRIMARY || '') + '/' + from, { cache: 'no-store' }, 12000);
    if (r.ok) {
      const j = await r.json();
      const rate = j && j.rates && Number(j.rates[to]);
      if (rate) out = { rate, date: (j.time_last_update_utc || '').slice(5, 16) || 'Reference rate' };
    }
  } catch (e) { /* try fallback */ }

  /* Fallback: Frankfurter (ECB) — major currencies only. */
  if (!out) {
    try {
      const url = (CFG.FX_FALLBACK || '') + '?base=' + encodeURIComponent(from) + '&symbols=' + encodeURIComponent(to);
      const r = await fetchWithTimeout(url, { cache: 'no-store' }, 12000);
      if (r.ok) {
        const j = await r.json();
        const rate = j && j.rates && Number(j.rates[to]);
        if (rate) out = { rate, date: j.date || 'Reference rate' };
      }
    } catch (e) { /* fall through */ }
  }

  if (!out) throw new Error('No published rate for ' + from + ' to ' + to + '.');

  try { sessionStorage.setItem(cacheKey, JSON.stringify({ rate: out.rate, date: out.date, t: Date.now() })); }
  catch (e) { /* ignore */ }

  return out;
}

function formatRate(n) {
  if (n >= 1000) return n.toFixed(0);
  if (n >= 100) return n.toFixed(1);
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toPrecision(3);
}

async function loadRate() {
  if (!selectedCountry) return;
  const cur = firstCurrency(selectedCountry);
  const from = String(profile.homeCurrency || 'INR').toUpperCase();

  setText('#exchangeRate', 'Loading...');
  setText('#rateTime', '');

  try {
    const { rate, date } = await getRate(from, cur.code);
    if (from === cur.code) {
      setText('#exchangeRate', '1 ' + from + ' = 1 ' + cur.code);
      setText('#rateTime', 'Same currency');
      return;
    }
    setText('#exchangeRate', '1 ' + from + ' = ' + (cur.symbol || '') + formatRate(rate) + ' ' + cur.code);
    setText('#rateTime', 'Ref. ' + date);
  } catch (e) {
    setText('#exchangeRate', 'Rate unavailable');
    setText('#rateTime', e.message || '');
  }
}

/* ---------- WEATHER ---------- */

function weatherLabel(code) {
  const map = {
    0: ['Clear', '☀'], 1: ['Mostly clear', '◔'], 2: ['Partly cloudy', '☁'], 3: ['Overcast', '☁'],
    45: ['Fog', '≋'], 48: ['Freezing fog', '≋'],
    51: ['Light drizzle', '☂'], 53: ['Drizzle', '☂'], 55: ['Heavy drizzle', '☂'],
    56: ['Freezing drizzle', '☂'], 57: ['Freezing drizzle', '☂'],
    61: ['Light rain', '☂'], 63: ['Rain', '☂'], 65: ['Heavy rain', '☂'],
    66: ['Freezing rain', '☂'], 67: ['Freezing rain', '☂'],
    71: ['Light snow', '❄'], 73: ['Snow', '❄'], 75: ['Heavy snow', '❄'], 77: ['Snow grains', '❄'],
    80: ['Showers', '☂'], 81: ['Showers', '☂'], 82: ['Heavy showers', '☂'],
    85: ['Snow showers', '❄'], 86: ['Snow showers', '❄'],
    95: ['Thunderstorm', 'ϟ'], 96: ['Thunderstorm', 'ϟ'], 99: ['Severe thunderstorm', 'ϟ']
  };
  return map[code] || ['Weather', '◌'];
}

async function geocodeCapital(city, country) {
  const key = 'geo_' + country + '_' + city;
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (hit) return hit;
  } catch (e) { /* ignore */ }

  const url = (CFG.GEOCODE_SEARCH || 'https://geocoding-api.open-meteo.com/v1/search') +
    '?name=' + encodeURIComponent(city) + '&count=10&language=en&format=json';

  const r = await fetchWithTimeout(url, { cache: 'no-store' }, 10000);
  if (!r.ok) throw new Error('geocode failed');
  const j = await r.json();
  const results = j.results || [];
  if (!results.length) throw new Error('no match');

  // Prefer a hit inside the right country.
  const hit = results.find(x => String(x.country_code || '').toUpperCase() === String(country).toUpperCase()) || results[0];
  const coords = { lat: hit.latitude, lon: hit.longitude };

  try { sessionStorage.setItem(key, JSON.stringify(coords)); } catch (e) { /* ignore */ }
  return coords;
}

async function loadWeather() {
  if (!selectedCountry) return;

  const fahrenheit = String(CFG.TEMPERATURE_UNIT || 'C').toUpperCase() === 'F';
  const fail = msg => {
    setText('#weatherTemp', '--°');
    setText('#weatherText', msg);
    setText('#weatherIcon', '◌');
  };

  const capital = (selectedCountry.capital || [])[0];
  const centre = selectedCountry.latlng || [];
  let lat = centre[0];
  let lon = centre[1];
  let label = 'Country weather';

  if (capital) {
    try {
      const c = await geocodeCapital(capital, selectedCountry.cca2);
      lat = c.lat; lon = c.lon; label = '';
    } catch (e) { /* fall back to the country centroid */ }
  }

  if (lat == null || lon == null) { fail('No coordinates available'); return; }

  try {
    const url = (CFG.OPEN_METEO_FORECAST || '') +
      '?latitude=' + encodeURIComponent(lat) +
      '&longitude=' + encodeURIComponent(lon) +
      '&current=temperature_2m,weather_code&timezone=auto' +
      (fahrenheit ? '&temperature_unit=fahrenheit' : '');

    const r = await fetchWithTimeout(url, { cache: 'no-store' }, 12000);
    if (!r.ok) throw new Error('bad response');
    const j = await r.json();
    const cur = j.current || {};
    if (cur.temperature_2m == null) throw new Error('no reading');

    const w = weatherLabel(cur.weather_code);
    setText('#weatherTemp', Math.round(cur.temperature_2m) + '°' + (fahrenheit ? 'F' : 'C'));
    setText('#weatherText', label ? (w[0] + ' · ' + label) : w[0]);
    setText('#weatherIcon', w[1]);
  } catch (e) {
    fail('Weather unavailable');
  }
}

/* ---------- AI PANELS ---------- */

async function generateSnapshot(c) {
  const box = $('#countryAiText');
  const status = $('#briefStatus');
  setHTML('#countryAiSources', '');

  if (!CFG.API_URL) {
    if (status) status.textContent = 'Backend not connected';
    if (box) box.innerHTML = '<div class="brief-empty">Country facts are live. Add your Apps Script /exec URL as API_URL in js/config.js to turn on the AI traveller snapshot.</div>';
    return;
  }

  if (status) status.textContent = 'Generating...';
  if (box) box.innerHTML = '<span class="loading-pulse">Preparing a short traveller brief...</span>';

  try {
    const r = await api('askTravel', {
      question: 'Give the essential traveller snapshot only: who this destination suits, 3 basic travel points, and one thing to verify before travel.',
      country: (c.name && c.name.common) || '',
      countryCode: c.cca2,
      passport: profile.passportCountry,
      homeCurrency: profile.homeCurrency,
      style: profile.travelStyle
    });

    if (box) box.innerHTML = renderBriefText(r.answer);
    renderSources('#countryAiSources', r.sources);
    if (status) status.textContent = 'Live';

    setHTML('#aiResponse', renderBriefText(r.answer));
    renderSources('#aiSources', r.sources);
  } catch (e) {
    if (status) status.textContent = 'Unavailable';
    if (box) box.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

function showOverview() {
  const ov = $('#tabOverview'), dy = $('#tabDynamic');
  if (ov) ov.classList.add('active');
  if (dy) dy.classList.remove('active');
  $$('#countryTabs button').forEach(b => {
    const on = b.dataset.tab === 'overview';
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
}

async function showIntel(action) {
  if (!selectedCountry) { alert('Choose a country first.'); return; }

  if (action === 'itinerary') { openTool('planner'); return; }
  if (action === 'costs') { openTool('budget'); return; }

  currentIntelAction = action;

  const ov = $('#tabOverview'), dy = $('#tabDynamic');
  if (ov) ov.classList.remove('active');
  if (dy) dy.classList.add('active');
  $$('#countryTabs button').forEach(b => {
    const on = b.dataset.tab === action;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });

  const titles = {
    travel: 'Travel basics',
    places: 'Places to visit',
    visa: 'Visa and entry',
    safety: 'Safety',
    culture: 'Culture and etiquette',
    faq: 'Traveller FAQ'
  };
  setText('#dynamicTitle', titles[action] || 'Travel information');
  setHTML('#dynamicContent', '<span class="loading-pulse">Checking current travel information...</span>');
  setHTML('#dynamicSources', '');

  try {
    let apiAction = 'askTravel', question = '';

    if (action === 'visa') apiAction = 'visaInfo';
    else if (action === 'safety') apiAction = 'safetyInfo';
    else if (action === 'places') question = 'Give 5 best places to visit and who each is best for. Keep it very short.';
    else if (action === 'culture') question = 'Give only the essential culture and etiquette points a visitor should know.';
    else if (action === 'faq') question = 'Give a short traveller FAQ: money, SIM, transport, cards, water, tipping and emergencies.';
    else question = 'Give only the basic travel information: money, SIM, transport, payments, best season and one practical tip.';

    const r = await api(apiAction, {
      country: (selectedCountry.name && selectedCountry.name.common) || '',
      countryCode: selectedCode,
      passport: profile.passportCountry,
      homeCurrency: profile.homeCurrency,
      style: profile.travelStyle,
      question
    });

    setHTML('#dynamicContent', renderBriefText(r.answer));
    renderSources('#dynamicSources', r.sources);
  } catch (e) {
    setHTML('#dynamicContent', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

async function askAI(q) {
  q = normalizeQuery(q);
  if (!q) return;
  if (!selectedCountry) {
    setHTML('#aiResponse', '<div class="brief-empty">Choose a country first, then ask.</div>');
    return;
  }

  setHTML('#aiResponse', '<span class="loading-pulse">Thinking...</span>');
  setHTML('#aiSources', '');

  try {
    const r = await api('askTravel', {
      question: q,
      country: (selectedCountry.name && selectedCountry.name.common) || '',
      countryCode: selectedCode,
      passport: profile.passportCountry,
      homeCurrency: profile.homeCurrency,
      style: profile.travelStyle
    });
    setHTML('#aiResponse', renderBriefText(r.answer));
    renderSources('#aiSources', r.sources);
  } catch (e) {
    setHTML('#aiResponse', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

/* ---------- MAP ---------- */

function mapFallback(message) {
  const el = $('#chartdiv');
  if (el) el.innerHTML = '<div class="map-fallback">' + esc(message) + '</div>';
}

function initMap() {
  if (typeof am5 === 'undefined' || typeof am5map === 'undefined' || typeof am5geodata_worldLow === 'undefined') {
    mapFallback('The map library did not load. Search for a country instead.');
    return;
  }

  try {
    am5.ready(() => {
      try {
        const root = am5.Root.new('chartdiv');
        if (root._logo) root._logo.dispose();
        if (typeof am5themes_Animated !== 'undefined') root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(am5map.MapChart.new(root, {
          panX: 'rotateX',
          panY: 'rotateY',
          projection: am5map.geoNaturalEarth1(),
          wheelY: 'zoom',
          wheelSensitivity: 0.8
        }));

        const series = chart.series.push(am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ['AQ']
        }));

        series.mapPolygons.template.setAll({
          tooltipText: '{name}',
          interactive: true,
          fill: am5.color(0x17684b),
          stroke: am5.color(0x58d7af),
          strokeWidth: 0.65,
          cursorOverStyle: 'pointer'
        });

        series.mapPolygons.template.states.create('hover', {
          fill: am5.color(0x1aa494),
          stroke: am5.color(0x58eaff),
          strokeWidth: 1.5
        });

        function polygonCode(target) {
          const di = target.dataItem;
          if (!di) return '';
          let id = '';
          try { id = di.get('id') || ''; } catch (e) { id = ''; }
          if (!id) {
            const dc = di.dataContext || {};
            id = dc.id || (dc.properties && dc.properties.id) || '';
          }
          id = String(id).toUpperCase();
          return /^[A-Z]{2}$/.test(id) ? id : '';
        }

        series.mapPolygons.template.events.on('click', ev => {
          const code = polygonCode(ev.target);
          if (code) selectCountry(code, 'map');
        });

        series.mapPolygons.template.events.on('pointerover', ev => {
          const dc = (ev.target.dataItem && ev.target.dataItem.dataContext) || {};
          const code = polygonCode(ev.target);
          const tt = $('#countryTooltip');
          if (!tt) return;
          tt.innerHTML = '<b>' + esc(flagEmoji(code)) + ' ' + esc(dc.name || '') + '</b><small>Click to load this destination</small>';
          tt.style.display = 'block';
        });

        series.mapPolygons.template.events.on('pointerout', () => {
          const tt = $('#countryTooltip');
          if (tt) tt.style.display = 'none';
        });

        chart.appear(800, 100);
        mapReady = true;
      } catch (inner) {
        mapFallback('The map could not be drawn. Search for a country instead.');
      }
    });
  } catch (e) {
    mapFallback('The map could not be drawn. Search for a country instead.');
  }
}

/* ---------- MODALS ---------- */

function openModal(html) {
  setHTML('#modalBody', html);
  const back = $('#modalBackdrop'), modal = $('#toolModal');
  if (back) back.classList.add('open');
  if (modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('modal-open');
  const focusable = modal && modal.querySelector('input,select,textarea,button:not(.modal-x)');
  if (focusable) setTimeout(() => focusable.focus(), 60);
}

function closeModal() {
  const back = $('#modalBackdrop'), modal = $('#toolModal');
  if (back) back.classList.remove('open');
  if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
  document.body.classList.remove('modal-open');
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const modal = $('#toolModal');
  if (modal && modal.classList.contains('open')) closeModal();
});

function openTool(action) {
  if (action === 'profile') { renderProfileModal(); return; }
  if (action === 'saved') { renderSavedModal(); return; }

  if (action === 'checklist') {
    const items = ['Passport', 'Visa or entry documents', 'Travel insurance', 'Flights', 'Hotels', 'Cards and cash', 'SIM or eSIM', 'Medicines', 'Adapter', 'Emergency contacts'];
    const state = readJSON('travel_ai_checklist', {}) || {};
    openModal('<h2>Travel checklist</h2><div class="check-list">' +
      items.map((x, i) =>
        '<label class="check-item"><input type="checkbox" data-check="' + i + '" ' + (state[i] ? 'checked' : '') + '> ' + esc(x) + '</label>'
      ).join('') + '</div>');
    $$('[data-check]').forEach(x => {
      x.onchange = () => { state[x.dataset.check] = x.checked; writeJSON('travel_ai_checklist', state); };
    });
    return;
  }

  if (!selectedCountry) { alert('Choose a country first.'); return; }

  const country = (selectedCountry.name && selectedCountry.name.common) || 'Selected country';
  const cur = firstCurrency(selectedCountry);

  if (action === 'currency') {
    openModal('<h2>Currency converter</h2>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="mFrom">From</label><input id="mFrom" maxlength="3" value="' + esc(profile.homeCurrency) + '"></div>' +
      '<div class="field"><label for="mTo">To</label><input id="mTo" maxlength="3" value="' + esc(cur.code) + '"></div>' +
      '<div class="field"><label for="mAmount">Amount</label><input id="mAmount" type="number" min="0" value="10000"></div>' +
      '</div>' +
      '<button class="primary-btn" id="mConvert">Convert</button>' +
      '<div class="result-box" id="mResult">Enter an amount and convert.</div>');
    const run = () => convertModal();
    $('#mConvert').onclick = run;
    ['#mFrom', '#mTo', '#mAmount'].forEach(s => {
      const el = $(s);
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    });
    return;
  }

  if (action === 'planner' || action === 'budget') {
    openModal('<h2>' + (action === 'planner' ? 'Trip planner' : 'Budget estimate') + '</h2>' +
      '<p class="brief-copy">' + esc(country) + '</p>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="pDays">Days</label><input id="pDays" type="number" min="1" max="60" value="7"></div>' +
      '<div class="field"><label for="pTrav">Travellers</label><input id="pTrav" type="number" min="1" max="20" value="1"></div>' +
      '<div class="field"><label for="pStyle">Style</label><select id="pStyle"><option>Budget</option><option>Mid-range</option><option>Comfort</option><option>Luxury</option></select></div>' +
      '<div class="field"><label for="pCur">Currency</label><input id="pCur" maxlength="3" value="' + esc(profile.homeCurrency) + '"></div>' +
      '</div>' +
      '<div class="field"><label for="pInt">Interests</label><textarea id="pInt" rows="3">' + esc((profile.interests || []).join(', ')) + '</textarea></div>' +
      '<button class="primary-btn" id="pRun">' + (action === 'planner' ? 'Build itinerary' : 'Estimate budget') + '</button>' +
      '<div class="result-box brief-render" id="pResult">Set your options, then run it.</div>' +
      '<div class="source-list" id="pSources"></div>');
    $('#pStyle').value = profile.travelStyle || 'Mid-range';
    $('#pRun').onclick = () => runPlanner(action);
    return;
  }

  if (action === 'compare') {
    openModal('<h2>Compare countries</h2>' +
      '<div class="compare-grid">' +
      '<div class="field"><label for="cmpA">Country A</label><input id="cmpA" value="' + esc(country) + '"></div>' +
      '<div class="field"><label for="cmpB">Country B</label><input id="cmpB" placeholder="e.g. Vietnam"></div>' +
      '</div>' +
      '<button class="primary-btn" id="cmpRun">Compare</button>' +
      '<div class="result-box brief-render" id="cmpResult">Name a second country to compare.</div>' +
      '<div class="source-list" id="cmpSources"></div>');
    $('#cmpRun').onclick = runCompare;
    return;
  }

  const jump = { visa: 'visa', safety: 'safety', tips: 'travel' };
  if (jump[action]) {
    showIntel(jump[action]);
    const sec = $('#countrySection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  }
}

async function convertModal() {
  const from = ($('#mFrom').value || '').trim().toUpperCase();
  const to = ($('#mTo').value || '').trim().toUpperCase();
  const amount = Number($('#mAmount').value || 0);
  const out = $('#mResult');
  out.innerHTML = '<span class="loading-pulse">Loading rate...</span>';

  try {
    const { rate, date } = await getRate(from, to);
    const value = amount * rate;
    out.textContent = amount.toLocaleString() + ' ' + from + ' = ' +
      value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + to +
      (date && date !== 'Same currency' ? '  (ref. ' + date + ')' : '');
  } catch (e) {
    out.textContent = e.message || 'Rate unavailable.';
  }
}

async function runPlanner(mode) {
  setHTML('#pResult', '<span class="loading-pulse">Generating...</span>');
  setHTML('#pSources', '');
  try {
    const r = await api(mode === 'planner' ? 'planTrip' : 'budgetTrip', {
      country: (selectedCountry.name && selectedCountry.name.common) || '',
      countryCode: selectedCode,
      passport: profile.passportCountry,
      days: $('#pDays').value,
      travellers: $('#pTrav').value,
      style: $('#pStyle').value,
      currency: ($('#pCur').value || '').toUpperCase(),
      interests: $('#pInt').value
    });
    setHTML('#pResult', renderBriefText(r.answer));
    renderSources('#pSources', r.sources);
  } catch (e) {
    setHTML('#pResult', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

async function runCompare() {
  const b = normalizeQuery($('#cmpB').value);
  if (!b) { setHTML('#cmpResult', '<div class="brief-empty">Name a second country to compare.</div>'); return; }
  setHTML('#cmpResult', '<span class="loading-pulse">Comparing...</span>');
  setHTML('#cmpSources', '');
  try {
    const r = await api('compareCountries', {
      a: $('#cmpA').value,
      b: b,
      passport: profile.passportCountry,
      currency: profile.homeCurrency,
      style: profile.travelStyle,
      interests: (profile.interests || []).join(', ')
    });
    setHTML('#cmpResult', renderBriefText(r.answer));
    renderSources('#cmpSources', r.sources);
  } catch (e) {
    setHTML('#cmpResult', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

function renderProfileModal() {
  openModal('<h2>Traveller profile</h2>' +
    '<div class="profile-grid">' +
    '<div class="field"><label for="prPass">Passport country code</label><input id="prPass" maxlength="2" value="' + esc(profile.passportCountry) + '"></div>' +
    '<div class="field"><label for="prCur">Home currency</label><input id="prCur" maxlength="3" value="' + esc(profile.homeCurrency) + '"></div>' +
    '<div class="field"><label for="prStyle">Travel style</label><select id="prStyle"><option>Budget</option><option>Mid-range</option><option>Comfort</option><option>Luxury</option></select></div>' +
    '<div class="field"><label for="prInt">Interests</label><input id="prInt" value="' + esc((profile.interests || []).join(', ')) + '"></div>' +
    '</div>' +
    '<div class="field-error" id="prError"></div>' +
    '<button class="primary-btn" id="prSave">Save profile</button>');

  $('#prStyle').value = profile.travelStyle || 'Mid-range';

  $('#prSave').onclick = () => {
    const pass = ($('#prPass').value || '').trim().toUpperCase();
    const curr = ($('#prCur').value || '').trim().toUpperCase();
    const err = $('#prError');

    if (!/^[A-Z]{2}$/.test(pass)) { err.textContent = 'Passport country needs a 2-letter code, such as IN or US.'; return; }
    if (!/^[A-Z]{3}$/.test(curr)) { err.textContent = 'Home currency needs a 3-letter code, such as INR or USD.'; return; }

    profile = {
      passportCountry: pass,
      homeCurrency: curr,
      travelStyle: $('#prStyle').value,
      interests: $('#prInt').value.split(',').map(x => x.trim()).filter(Boolean)
    };
    writeJSON('travel_ai_profile', profile);
    renderProfile();
    loadRate();
    closeModal();
  };
}

function renderSavedModal() {
  openModal('<h2>My trips</h2><div class="saved-list">' +
    (savedTrips.length
      ? savedTrips.map(x =>
          '<div class="saved-item"><span>' + esc(x.flag) + ' <b>' + esc(x.name) + '</b></span>' +
          '<div><button class="secondary-btn" data-open="' + esc(x.code) + '">Open</button> ' +
          '<button class="secondary-btn" data-remove="' + esc(x.code) + '">Remove</button></div></div>'
        ).join('')
      : '<div class="brief-empty">Nothing saved yet. Open a country and use “Add to my trips”.</div>') +
    '</div>');

  $$('[data-open]').forEach(b => b.onclick = () => { closeModal(); selectCountry(b.dataset.open, 'saved'); });
  $$('[data-remove]').forEach(b => b.onclick = () => {
    savedTrips = savedTrips.filter(x => x.code !== b.dataset.remove);
    writeJSON('travel_ai_saved', savedTrips);
    renderSavedModal();
    syncSaveButton();
  });
}

function saveCurrent() {
  if (!selectedCountry) { alert('Choose a country first.'); return; }
  if (savedTrips.some(x => x.code === selectedCode)) {
    savedTrips = savedTrips.filter(x => x.code !== selectedCode);
  } else {
    savedTrips.push({
      code: selectedCode,
      name: (selectedCountry.name && selectedCountry.name.common) || selectedCode,
      flag: selectedCountry.flag || flagEmoji(selectedCode)
    });
  }
  writeJSON('travel_ai_saved', savedTrips);
  syncSaveButton();
}

function syncSaveButton() {
  const btn = $('#saveCountryBtn');
  if (!btn) return;
  const on = savedTrips.some(x => x.code === selectedCode);
  btn.textContent = on ? '✓ Saved to my trips' : '＋ Add to my trips';
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

/* ---------- EVENTS ---------- */

function on(selector, handler) { const el = $(selector); if (el) el.onclick = handler; }

bindCountrySearch('#countrySearch', '#countryResults', '#countrySearchBtn');
bindCountrySearch('#globalSearch', '#globalResults');

$$('[data-prompt]').forEach(b => b.onclick = () => {
  const input = $('#aiInput');
  if (input) input.value = b.dataset.prompt;
  askAI(b.dataset.prompt);
});

on('#aiSend', () => askAI($('#aiInput') ? $('#aiInput').value : ''));
const aiInput = $('#aiInput');
if (aiInput) aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); askAI(e.target.value); }
});

$$('[data-action]').forEach(x => x.onclick = () => openTool(x.dataset.action));

on('#editProfileBtn', () => openTool('profile'));
on('#savedTopBtn', () => openTool('saved'));
on('#saveCountryBtn', saveCurrent);
on('#viewPlacesBtn', () => {
  showIntel('places');
  const sec = $('#countrySection');
  if (sec) sec.scrollIntoView({ behavior: 'smooth' });
});
on('#dynamicRefresh', () => showIntel(currentIntelAction));
on('#modalClose', closeModal);
on('#modalBackdrop', closeModal);
on('#themeBtn', () => {
  const low = document.body.classList.toggle('low-glow');
  try { localStorage.setItem('travel_ai_lowglow', low ? '1' : '0'); } catch (e) { /* ignore */ }
});
on('#adminBtn', () => {
  if (CFG.ADMIN_URL) window.open(CFG.ADMIN_URL, '_blank', 'noopener');
  else alert('Set ADMIN_URL in js/config.js after deploying the Apps Script web app.');
});

$$('#countryTabs button').forEach(b => b.onclick = () => {
  if (b.dataset.tab === 'overview') showOverview();
  else showIntel(b.dataset.tab);
});

$$('[data-scroll]').forEach(a => a.onclick = () => {
  const t = document.getElementById(a.dataset.scroll);
  if (t) t.scrollIntoView({ behavior: 'smooth' });
});

/* Elements styled as buttons but built from <a>/<article> still respond to keys. */
$$('[role="button"]').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
  });
});

/* ---------- INIT ---------- */

try { if (localStorage.getItem('travel_ai_lowglow') === '1') document.body.classList.add('low-glow'); }
catch (e) { /* ignore */ }

renderProfile();
initMap();
selectCountry(selectedCode, 'initial', CFG.SCAN_ON_FIRST_LOAD !== true);
