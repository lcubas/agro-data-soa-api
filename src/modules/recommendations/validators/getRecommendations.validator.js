const { object, string, number } = require('superstruct');

const getRecommendationsBodySchema = object({
  crop: string(),
  region: string(),
  lat: number(),
  lon: number()
});

module.exports = { getRecommendationsBodySchema };