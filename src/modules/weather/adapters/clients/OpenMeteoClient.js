class OpenMeteoClient {
  constructor({ httpClient }) {
    this.httpClient = httpClient;
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  async fetchForecast({ lat, lon, days }) {
    const params = {
      latitude: lat,
      longitude: lon,
      daily: [
        'temperature_2m_min',
        'temperature_2m_max',
        'precipitation_sum',
        'precipitation_probability_max'
      ].join(','),
      timezone: 'auto',
      forecast_days: Math.min(Math.max(days, 1), 16)
    };

    const { data } = await this.httpClient.get(this.baseUrl, { params });
    return this._transform(data);
  }

  _transform(data) {
    const daily = data.daily || {};
    const out = (daily.time || []).map((iso, i) => {
      const tmin = daily.temperature_2m_min?.[i];
      const tmax = daily.temperature_2m_max?.[i];
      const prcp = daily.precipitation_sum?.[i];
      const pprob = daily.precipitation_probability_max?.[i];

      let frostRisk = 'bajo';
      if (tmin < 2) frostRisk = 'medio';
      if (tmin < 0) frostRisk = 'alto';

      return {
        date: iso,
        tmin,
        tmax,
        precip_mm: prcp,
        precip_prob: pprob,
        frost_risk: frostRisk
      };
    });

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      daily: out
    };
  }
}

module.exports = OpenMeteoClient;
