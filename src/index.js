const dotenv = require("dotenv");
const { onRequest } = require("firebase-functions/v2/https");
const app = require("./app");

dotenv.config();

exports.api = onRequest({ cors: true }, app);

