const axios = require('axios');
const cache = require('./cache');

/**
 * Adaptador de pronóstico (Open-Meteo).
 * Variables: Tmin/Tmax, precipitación diaria y prob. máxima de precipitación.
 */
async function getForecast(lat, lon, days = 10) {
  const key = `wx:${lat.toFixed(3)},${lon.toFixed(3)}:d${days}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const url = 'https://api.open-meteo.com/v1/forecast';
  const params = {
    latitude: lat, longitude: lon,
    daily: [
      'temperature_2m_min',
      'temperature_2m_max',
      'precipitation_sum',
      'precipitation_probability_max'
    ].join(','),
    timezone: 'auto',
    forecast_days: Math.min(Math.max(days, 1), 16)
  };

  const { data } = await axios.get(url, { params });
  const daily = data.daily || {};
  const out = (daily.time || []).map((iso, i) => {
    const tmin = daily.temperature_2m_min?.[i];
    const tmax = daily.temperature_2m_max?.[i];
    const prcp = daily.precipitation_sum?.[i];
    const pprob = daily.precipitation_probability_max?.[i];

    // Heurística simple de helada: Tmin < 2°C (riesgo), < 0°C (alto)
    let frostRisk = 'bajo';
    if (tmin < 2) frostRisk = 'medio';
    if (tmin < 0) frostRisk = 'alto';

    return { date: iso, tmin, tmax, precip_mm: prcp, precip_prob: pprob, frost_risk: frostRisk };
  });

  const payload = { latitude: data.latitude, longitude: data.longitude, daily: out };
  cache.set(key, payload);
  return payload;
}

module.exports = { getForecast };
