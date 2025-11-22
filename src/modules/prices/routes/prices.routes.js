const express = require('express');
const GetPricesController = require('../controllers/GetPricesController');
const requestValidationMiddleware = require('../../../middlewares/requestValidation.middleware');
const { getPricesQuerySchema } = require('../validators/getPrices.validator');

const router = express.Router();

router.get(
  '/',
  requestValidationMiddleware(getPricesQuerySchema, 'query'),
  (req, res, next) => {
    const priceService = req.container.resolve('priceService');
    const logger = req.container.resolve('logger');
    const controller = new GetPricesController({ priceService, logger });
    controller.run(req, res, next);
  }
);

module.exports = router;