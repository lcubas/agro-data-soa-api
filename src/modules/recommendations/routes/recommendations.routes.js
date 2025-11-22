const express = require('express');
const GetRecommendationsController = require('../controllers/GetRecommendationsController');
const requestValidationMiddleware = require('../../../middlewares/requestValidation.middleware');
const { getRecommendationsBodySchema } = require('../validators/getRecommendations.validator');

const router = express.Router();

router.post(
  '/',
  requestValidationMiddleware(getRecommendationsBodySchema, 'body'),
  (req, res, next) => {
    const recommendationService = req.container.resolve('recommendationService');
    const logger = req.container.resolve('logger');
    const controller = new GetRecommendationsController({ recommendationService, logger });
    controller.run(req, res, next);
  }
);

module.exports = router;
