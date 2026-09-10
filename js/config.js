/* Travel AI — configuration
   Edit only this file after deploying Apps Script. */

window.TRAVEL_CONFIG = {

  /* REQUIRED after Apps Script deployment: paste the /exec URL into API_URL.
     Leave ADMIN_URL empty. The admin link is private (run showAdminLink in Apps Script). */
  API_URL: 'https://script.google.com/macros/s/AKfycbwNKbb30E1SHJvlqebkwiC_vVP4kS4suxpcJl35WqX5_yLNkwl-kLv3gNephmggCgmmXQ/exec',
  ADMIN_URL: 'https://script.google.com/macros/s/AKfycbwNKbb30E1SHJvlqebkwiC_vVP4kS4suxpcJl35WqX5_yLNkwl-kLv3gNephmggCgmmXQ/exec',

  /* Build 4.4 instant layer: where the published country JSON lives, relative to
     index.html (must match "Path" in Admin → Instant static layer). */
  STATIC_DATA_URL: 'data/countries/',

  /* Country facts and the India boundary are embedded in js/app.js.
     There is no country API to go down, rate-limit or start charging. */

  /* Weather (free, no key) */
  OPEN_METEO_FORECAST: 'https://api.open-meteo.com/v1/forecast',
  GEOCODE_SEARCH: 'https://geocoding-api.open-meteo.com/v1/search',

  /* Exchange rates. PRIMARY covers ~160 currencies with no key;
     FALLBACK is ECB-based and covers ~30 majors. */
  FX_PRIMARY: 'https://open.er-api.com/v6/latest',
  FX_FALLBACK: 'https://api.frankfurter.dev/v1/latest',

  /* Give up on a backend request after this long (ms).
     Discovery and visa lookups run web searches and can take 30-60s. */
  REQUEST_TIMEOUT_MS: 75000,

  /* 'C' or 'F' */
  TEMPERATURE_UNIT: 'C'
};
