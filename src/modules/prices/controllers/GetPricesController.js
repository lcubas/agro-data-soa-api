const { successResponse } = require('../../../utils/response');

class GetPricesController {
  constructor({ priceService, logger }) {
    this.priceService = priceService;
    this.logger = logger;
  }

  async run(req, res, next) {
    try {
      const { product, region, days } = req.query;

      this.logger.info({
        requestId: req.requestId,
        action: 'get_prices',
        params: { product, region, days }
      });

      const data = await this.priceService.getPriceSeries({
        product,
        region,
        days: parseInt(days, 10)
      });

      return res.json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GetPricesController;