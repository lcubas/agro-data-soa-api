const { object, string, number, defaulted } = require('superstruct');

const envSchema = object({
  PRICES_RESOURCE_ID: defaulted(string(), ''),
  HTTP_TIMEOUT: defaulted(number(), 10000),
});

const rawEnv = {
  PRICES_RESOURCE_ID: process.env.PRICES_RESOURCE_ID || '',
  HTTP_TIMEOUT: parseInt(process.env.HTTP_TIMEOUT || '10000', 10),
};

let env;
try {
  env = envSchema.create(rawEnv);
} catch (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

module.exports = { env };