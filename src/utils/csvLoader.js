const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const CSV_PATH = path.join(__dirname, "..", "data", "sample-prices.csv");

async function loadCSVRows() {
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  return new Promise((resolve, reject) => {
    const rows = [];
    parse(content, { columns: true, skip_empty_lines: true, trim: true }, (err, recs) => {
      if (err) reject(err);
      else resolve(recs);
    });
  });
}

module.exports = { loadCSVRows };
