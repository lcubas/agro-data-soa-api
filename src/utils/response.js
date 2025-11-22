function successResponse(data, httpCode = 200) {
  return {
    data,
    httpCode,
    success: true,
  };
}

function errorResponse(data, httpCode = 500) {
  return {
    data,
    httpCode,
    success: false,
  };
}

module.exports = { successResponse, errorResponse };