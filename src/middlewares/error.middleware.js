const AppError = require('../errors/AppError');
const { errorResponse } = require('../utils/response');

function errorMiddleware(err, req, res, next) {
  const logger = req.container?.resolve('logger') || console;
  
  logger.error({
    requestId: req.requestId,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    }
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message));
  }

  return res.status(500).json(errorResponse('Error interno del servidor'));
}

module.exports = errorMiddleware;