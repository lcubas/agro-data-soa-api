const axios = require('axios');
const ExternalServiceError = require('../errors/ExternalServiceError');

function createHttpClient({ env, logger }) {
  const instance = axios.create({
    timeout: env.HTTP_TIMEOUT
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || error.message || 'External service error';
      const statusCode = error.response?.status || 502;
      
      logger.error({
        message: 'HTTP client error',
        error: message,
        statusCode
      });

      throw new ExternalServiceError(message, statusCode);
    }
  );

  return instance;
}

module.exports = { createHttpClient };