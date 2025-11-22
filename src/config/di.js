const { createContainer, asClass, asValue, asFunction } = require('awilix');
const logger = require('./logger');
const { env } = require('./env');
const { createHttpClient } = require('../utils/httpClient');

const OpenMeteoClient = require('../modules/weather/adapters/clients/OpenMeteoClient');
const WeatherService = require('../modules/weather/services/WeatherService');

const DkanClient = require('../modules/prices/adapters/clients/DkanClient');
const CsvPriceRepository = require('../modules/prices/adapters/repositories/CsvPriceRepository');
const PriceService = require('../modules/prices/services/PriceService');

const RecommendationService = require('../modules/recommendations/services/RecommendationService');

function createRequestContainer() {
  const container = createContainer();

  container.register({
    logger: asValue(logger),
    env: asValue(env),
    httpClient: asFunction(createHttpClient).singleton(),

    openMeteoClient: asClass(OpenMeteoClient).singleton(),
    weatherService: asClass(WeatherService).singleton(),

    dkanClient: asClass(DkanClient).singleton(),
    csvPriceRepository: asClass(CsvPriceRepository).singleton(),
    priceService: asClass(PriceService).singleton(),

    recommendationService: asClass(RecommendationService).singleton()
  });

  return container;
}

module.exports = { createRequestContainer };