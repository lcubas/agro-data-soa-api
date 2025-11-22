const { object, string, defaulted, refine, number } = require('superstruct');

const getForecastQuerySchema = object({
  lat: refine(string(), 'validLat', (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  }),
  lon: refine(string(), 'validLon', (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  }),
  days: defaulted(refine(string(), 'validDays', (value) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 1 && num <= 16;
  }), '10')
});

module.exports = { getForecastQuerySchema };
