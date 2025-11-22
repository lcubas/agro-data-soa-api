const express = require('express');
const GetForecastController = require('../controllers/GetForecastController');
const requestValidationMiddleware = require('../../../middlewares/requestValidation.middleware');
const { getForecastQuerySchema } = require('../validators/getForecast.validator');

const router = express.Router();

router.get(
  '/',
  requestValidationMiddleware(getForecastQuerySchema, 'query'),
  (req, res, next) => {
    const weatherService = req.container.resolve('weatherService');
    const logger = req.container.resolve('logger');
    const controller = new GetForecastController({ weatherService, logger });
    controller.run(req, res, next);
  }
);

module.exports = router;