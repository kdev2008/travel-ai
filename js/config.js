/* Travel AI — configuration
   Edit only this file after deploying Apps Script. */

window.TRAVEL_CONFIG = {

  /* Country loaded when the page first opens (ISO alpha-2). */
  DEFAULT_COUNTRY: 'IN',

  /* REQUIRED after Apps Script deployment.
     Paste the SAME /exec URL into both. */
  API_URL: 'https://script.google.com/macros/s/AKfycby2v0jwaZiXVl-AoT-pXa8JlwAcjMhk5BU-0YZeEpEZ0JVUQqgqcroOOnScxscWQC4x4A/exec',
  ADMIN_URL: 'https://script.google.com/macros/s/AKfycby2v0jwaZiXVl-AoT-pXa8JlwAcjMhk5BU-0YZeEpEZ0JVUQqgqcroOOnScxscWQC4x4A/exec',

  /* Country facts come from js/countries.js, bundled with the site.
     There is no country API to go down, rate-limit or start charging. */

  /* Weather */
  OPEN_METEO_FORECAST: 'https://api.open-meteo.com/v1/forecast',
  GEOCODE_SEARCH: 'https://geocoding-api.open-meteo.com/v1/search',

  /* Exchange rates.
     PRIMARY covers ~160 currencies, no key required.
     FALLBACK covers ~30 major currencies (ECB) and is used only if PRIMARY fails. */
  FX_PRIMARY: 'https://open.er-api.com/v6/latest',
  FX_FALLBACK: 'https://api.frankfurter.dev/v1/latest',

  DEFAULT_PROFILE: {
    passportCountry: 'IN',
    homeCurrency: 'INR',
    travelStyle: 'Mid-range',
    interests: ['Culture', 'Nature', 'Food']
  },

  /* Ask the backend for a traveller snapshot automatically after each country loads. */
  AUTO_AI_SNAPSHOT: true,

  /* Show the full-screen scan animation on the very first page load.
     false = the default country loads quietly; the animation still runs on every
     search, map click and saved-trip open. */
  SCAN_ON_FIRST_LOAD: false,

  /* Give up on a backend request after this long (ms).
     Web search on the backend can legitimately take 20-40s. */
  REQUEST_TIMEOUT_MS: 60000,

  /* 'C' or 'F' */
  TEMPERATURE_UNIT: 'C'
};
