const express = require('express');
const cors = require('cors');
const { createRequestContainer } = require('./config/di');
const requestIdMiddleware = require('./middlewares/requestId.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const healthRoutes = require('./modules/health/routes/health.routes');
const weatherRoutes = require('./modules/weather/routes/weather.routes');
const pricesRoutes = require('./modules/prices/routes/prices.routes');
const recommendationsRoutes = require('./modules/recommendations/routes/recommendations.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);

const container = createRequestContainer();

app.use((req, res, next) => {
  req.container = container;
  next();
});

app.use('/v1/health', healthRoutes);
app.use('/v1/weather', weatherRoutes);
app.use('/v1/prices', pricesRoutes);
app.use('/v1/recommendations', recommendationsRoutes);

app.use(errorMiddleware);

module.exports = app;
