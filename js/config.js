window.TRAVEL_CONFIG = {
  DEFAULT_COUNTRY: 'IN',

  // REQUIRED after Apps Script deployment:
  API_URL: '',
  ADMIN_URL: '',

  REST_COUNTRIES_BASE: 'https://restcountries.com/v3.1',
  OPEN_METEO_FORECAST: 'https://api.open-meteo.com/v1/forecast',
  FX_RATE_BASE: 'https://api.frankfurter.dev/v2/rate',

  DEFAULT_PROFILE: {
    passportCountry: 'IN',
    homeCurrency: 'INR',
    travelStyle: 'Mid-range',
    interests: ['Culture','Nature','Food']
  },

  AUTO_AI_SNAPSHOT: true
};