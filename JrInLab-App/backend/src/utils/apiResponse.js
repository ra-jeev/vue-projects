exports.sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': process.env.ALLOWED_HEADERS,
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS,
      'Access-Control-Allow-Methods': process.env.ALLOWED_METHODS,
    },
  };

  return response;
};
