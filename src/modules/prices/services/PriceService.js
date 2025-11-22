class PriceService {
  constructor({ dkanClient, csvPriceRepository, logger, env }) {
    this.dkanClient = dkanClient;
    this.csvPriceRepository = csvPriceRepository;
    this.logger = logger;
    this.env = env;
  }

  async getPriceSeries({ product, region, days = 60 }) {
    let series = [];

    if (this.env.PRICES_RESOURCE_ID) {
      try {
        series = await this.dkanClient.query({ product, region, days });
      } catch (e) {
        this.logger.warn({ message: 'DKAN fallback to CSV', error: e.message });
        series = await this.csvPriceRepository.query({ product, region, days });
      }
    } else {
      series = await this.csvPriceRepository.query({ product, region, days });
    }

    const payload = { series };    
    return payload;
  }
}

module.exports = PriceService;