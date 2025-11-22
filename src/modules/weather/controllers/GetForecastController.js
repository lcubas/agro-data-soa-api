const { successResponse } = require('../../../utils/response');

class GetForecastController {
  constructor({ weatherService, logger }) {
    this.weatherService = weatherService;
    this.logger = logger;
  }

  async run(req, res, next) {
    try {
      const { lat, lon, days } = req.query;
      
      this.logger.info({
        requestId: req.requestId,
        action: 'get_forecast',
        params: { lat, lon, days }
      });

      const data = await this.weatherService.getForecast({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        days: parseInt(days, 10)
      });

      return res.json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GetForecastController;