const axios = require('axios');
const cache = require('./cache');
const { dkand } = require('../config');
const { loadCSVRows } = require('../utils/csvLoader');

function toISO(d) {
  const x = new Date(d);
  if (isNaN(x)) return null;
  return x.toISOString().slice(0, 10);
}

async function queryDKAN({ product, region, days }) {
  // API DKAN genérica (Datos Abiertos Perú)
  // Ejemplo de uso y formato: ver página del DataStore API de DKAN. :contentReference[oaicite:0]{index=0}
  const resourceId = dkand.resourceId;
  const fields = dkand.fields;
  const base = 'https://datosabiertos.gob.pe/api/action/datastore/search.json';

  const end = new Date();
  const start = new Date(end.getTime() - days * 86400000);

  // En DKAN se puede usar 'q' o 'filters' (depende del recurso).
  // Aquí usamos 'q' textual y limit alto. Ajusta según tu esquema real.
  const q = [product, region].filter(Boolean).join(' ');
  const params = {
    resource_id: resourceId,
    limit: 5000,
    q
  };

  const { data } = await axios.get(base, { params });
  if (!data?.result?.records) return [];

  // Normaliza campos según variables .env
  const recs = data.result.records.map(r => ({
    date: toISO(r[fields.date]),
    region: r[fields.region],
    product: r[fields.product],
    price_avg: parseFloat(r[fields.avg]),
    unit: r[fields.unit] || '',
    market: r[fields.market] || ''
  })).filter(r => r.date);

  // Filtra por ventana y región/producto si están definidos
  return recs.filter(r => {
    const dt = new Date(r.date);
    return dt >= start && dt <= end &&
      (!region || (r.region || '').toLowerCase().includes(region.toLowerCase())) &&
      (!product || (r.product || '').toLowerCase().includes(product.toLowerCase()));
  }).sort((a, b) => a.date.localeCompare(b.date));
}

async function querySampleCSV({ product, region, days }) {
  const rows = await loadCSVRows();
  const end = new Date();
  const start = new Date(end.getTime() - days * 86400000);
  const recs = rows.map(r => ({
    date: toISO(r.fecha),
    region: r.region,
    product: r.producto,
    price_avg: parseFloat(r.precio_prom),
    unit: r.unidad,
    market: r.mercado
  })).filter(r => {
    const dt = new Date(r.date);
    return dt >= start && dt <= end &&
      (!region || r.region.toLowerCase().includes(region.toLowerCase())) &&
      (!product || r.product.toLowerCase().includes(product.toLowerCase()));
  }).sort((a, b) => a.date.localeCompare(b.date));
  return recs;
}

async function getPriceSeries({ product, region, days = 60 }) {
  const key = `px:${product}:${region || 'ALL'}:${days}`;
  const cached = cache.get(key);
  if (cached) return cached;

  let series = [];
  if (dkand.resourceId) {
    try {
      series = await queryDKAN({ product, region, days });
    } catch (e) {
      console.warn('Fallo DKAN, usando CSV de muestra', e.message);
      series = await querySampleCSV({ product, region, days });
    }
  } else {
    series = await querySampleCSV({ product, region, days });
  }

  const payload = { series };
  cache.set(key, payload);
  return payload;
}

module.exports = { getPriceSeries };
