const { validate } = require('superstruct');
const ValidationError = require('../errors/ValidationError');

function requestValidationMiddleware(schema, source = 'query') {
  return (req, res, next) => {
    const data = req[source];
    const [error] = validate(data, schema);
    
    if (error) {
      return next(new ValidationError(error.message));
    }
    
    next();
  };
}

module.exports = requestValidationMiddleware;