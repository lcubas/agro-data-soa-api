const express = require("express");
const cors = require("cors");
const { getForecast } = require("./services/weatherService");
const { getPriceSeries } = require("./services/priceService");
const { getRecommendations } = require("./services/recomendationService");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "AgroData Peru Backend",
    time: new Date().toISOString(),
  });
});

app.get("/weather", async (req, res) => {
  try {
    const { lat, lon, days = 10 } = req.query;
    if (!lat || !lon)
      return res.status(400).json({ error: "lat y lon son requeridos" });
    const data = await getForecast(
      parseFloat(lat),
      parseFloat(lon),
      parseInt(days, 10)
    );
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener pronóstico" });
  }
});

app.get("/prices", async (req, res) => {
  try {
    const { product, region, days = 60 } = req.query;
    if (!product)
      return res.status(400).json({ error: "product es requerido" });
    const data = await getPriceSeries({
      product,
      region,
      days: parseInt(days, 10),
    });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener precios" });
  }
});

app.post("/recommendations", async (req, res) => {
  try {
    const { crop, region, lat, lon } = req.body || {};
    if (!crop || !lat || !lon) {
      return res.status(400).json({ error: "crop, lat y lon son requeridos" });
    }
    const rec = await getRecommendations({
      crop,
      region,
      lat: +lat,
      lon: +lon,
    });
    res.json(rec);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al calcular recomendaciones" });
  }
});

module.exports = app;
