class WeatherService {
  constructor({ openMeteoClient }) {
    this.openMeteoClient = openMeteoClient;
  }

  async getForecast({ lat, lon, days = 10 }) {
    const data = await this.openMeteoClient.fetchForecast({ lat, lon, days });
    return data;
  }
}

module.exports = WeatherService;
