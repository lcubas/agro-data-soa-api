const express = require('express');
const GetHealthController = require('../controllers/GetHealthController');

const router = express.Router();

router.get('/', (req, res, next) => {
  const controller = new GetHealthController();
  controller.run(req, res, next);
});

module.exports = router;