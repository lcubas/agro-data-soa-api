const { object, string, defaulted } = require('superstruct');

const getPricesQuerySchema = object({
  product: string(),
  region: defaulted(string(), ''),
  days: defaulted(string(), '60')
});

module.exports = { getPricesQuerySchema };