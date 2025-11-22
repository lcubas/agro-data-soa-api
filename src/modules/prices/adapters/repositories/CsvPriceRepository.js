const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

class CsvPriceRepository {
  constructor() {
    this.csvPath = path.join(__dirname, '../../../../data/sample-prices.csv');
  }

  async query({ product, region, days }) {
    const rows = await this._loadCSV();
    const end = new Date();
    const start = new Date(end.getTime() - days * 86400000);

    const recs = rows.map(r => ({
      date: this._toISO(r.fecha),
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

  async _loadCSV() {
    const content = fs.readFileSync(this.csvPath, 'utf8');
    return new Promise((resolve, reject) => {
      parse(content, { columns: true, skip_empty_lines: true, trim: true }, (err, recs) => {
        if (err) reject(err);
        else resolve(recs);
      });
    });
  }

  _toISO(d) {
    const x = new Date(d);
    if (isNaN(x)) return null;
    return x.toISOString().slice(0, 10);
  }
}

module.exports = CsvPriceRepository;