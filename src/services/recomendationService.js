const { getForecast } = require('./weatherService');
const { getPriceSeries } = require('./priceService');

/**
 * Orquestación: combina clima + precios -> recomendaciones prácticas
 */
async function getRecommendations({ crop, region, lat, lon }) {
  const [wx, px] = await Promise.all([
    getForecast(lat, lon, 10),
    getPriceSeries({ product: crop, region, days: 90 })
  ]);

  const days = wx.daily || [];

  // Sugerencia simple de siembra:
  // - evitar heladas (tmin >= 4°C preferible)
  // - buscar ventana con precipitación moderada (5–25 mm/sum)
  // (Heurística educativa, ajusta por cultivo en producción real)
  let windowStart = null;
  for (let i = 0; i < days.length; i++) {
    const okTemp = days[i].tmin >= 4;
    const okRain = (days[i].precip_mm ?? 0) >= 2 && (days[i].precip_mm ?? 0) <= 25;
    if (okTemp && okRain) { windowStart = days[i].date; break; }
  }

  // Riesgos próximos
  const frostNext = days.filter(d => d.frost_risk !== 'bajo').map(d => d.date);
  const wetNext   = days.filter(d => (d.precip_prob ?? 0) >= 60).map(d => d.date);

  // Mercados/Regiones con mejor precio promedio (últimos 90 días)
  const byMarket = {};
  for (const r of px.series) {
    const key = (r.market || r.region || 'N/A').trim();
    if (!byMarket[key]) byMarket[key] = { key, sum: 0, n: 0, unit: r.unit || '' };
    if (!isNaN(r.price_avg)) { byMarket[key].sum += r.price_avg; byMarket[key].n++; }
  }
  const ranking = Object.values(byMarket)
    .filter(x => x.n >= 3)
    .map(x => ({ market: x.key, avg: x.sum / x.n, unit: x.unit }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  return {
    crop,
    location: { lat, lon, region: region || null },
    suggested_sowing_start: windowStart, // ISO string o null si no hay ventana clara
    risks_next_10d: {
      frost_dates: frostNext,
      high_rain_probability_dates: wetNext
    },
    price_ranking: ranking,
    debug: {
      used_weather_days: days.length,
      used_price_points: px.series.length
    }
  };
}

module.exports = { getRecommendations };
