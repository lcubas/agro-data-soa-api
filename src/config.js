module.exports = {
  dkand: {
    resourceId: process.env.PRICES_RESOURCE_ID || '',
    fields: {
      product: process.env.PRICES_PRODUCT_FIELD || 'producto',
      region:  process.env.PRICES_REGION_FIELD || 'region',
      date:    process.env.PRICES_DATE_FIELD || 'fecha',
      avg:     process.env.PRICES_AVG_FIELD || 'precio_prom',
      unit:    process.env.PRICES_UNIT_FIELD || 'unidad',
      market:  process.env.PRICES_MARKET_FIELD || 'mercado'
    }
  }
};
