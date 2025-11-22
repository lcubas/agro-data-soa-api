const { successResponse } = require('../../../utils/response');

class GetHealthController {
  run(req, res, next) {
    try {
      const data = {
        ok: true,
        service: 'AgroData Peru Backend',
        time: new Date().toISOString()
      };
      
      return res.json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GetHealthController;