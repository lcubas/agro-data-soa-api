class DkanClient {
  constructor({ httpClient, env }) {
    this.httpClient = httpClient;
    this.env = env;
    this.baseUrl = 'https://datosabiertos.gob.pe/api/action/datastore/search.json';
  }

  async query({ product, region, days }) {
    const end = new Date();
    const start = new Date(end.getTime() - days * 86400000);

    const q = [product, region].filter(Boolean).join(' ');
    const params = {
      resource_id: this.env.PRICES_RESOURCE_ID,
      limit: 5000,
      q
    };

    const { data } = await this.httpClient.get(this.baseUrl, { params });

    if (!data?.result?.records) {
      return [];
    }

    return this._transform(data.result.records, { product, region, start, end });
  }

  _transform(records, { product, region, start, end }) {
    const fields = {
      product: this.env.PRICES_PRODUCT_FIELD,
      region: this.env.PRICES_REGION_FIELD,
      date: this.env.PRICES_DATE_FIELD,
      avg: this.env.PRICES_AVG_FIELD,
      unit: this.env.PRICES_UNIT_FIELD,
      market: this.env.PRICES_MARKET_FIELD
    };

    const recs = records.map(r => ({
      date: this._toISO(r[fields.date]),
      region: r[fields.region],
      product: r[fields.product],
      price_avg: parseFloat(r[fields.avg]),
      unit: r[fields.unit] || '',
      market: r[fields.market] || ''
    })).filter(r => r.date);

    return recs.filter(r => {
      const dt = new Date(r.date);
      return dt >= start && dt <= end &&
        (!region || (r.region || '').toLowerCase().includes(region.toLowerCase())) &&
        (!product || (r.product || '').toLowerCase().includes(product.toLowerCase()));
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  _toISO(d) {
    const x = new Date(d);
    if (isNaN(x)) return null;
    return x.toISOString().slice(0, 10);
  }
}

module.exports = DkanClient;