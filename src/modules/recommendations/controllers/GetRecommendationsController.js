const { successResponse } = require('../../../utils/response');

class GetRecommendationsController {
  constructor({ recommendationService, logger }) {
    this.recommendationService = recommendationService;
    this.logger = logger;
  }

  async run(req, res, next) {
    try {
      const { crop, region, lat, lon } = req.body;

      this.logger.info({
        requestId: req.requestId,
        action: 'get_recommendations',
        params: { crop, region, lat, lon }
      });

      const data = await this.recommendationService.getRecommendations({
        crop,
        region,
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      });

      return res.json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GetRecommendationsController;
