const axios = require("axios");
const { mapAxiosError } = require("../utils/errors");

function createServiceClient(baseURL, internalToken, timeout) {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      "X-Internal-Token": internalToken
    }
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(mapAxiosError(error))
  );

  return instance;
}

module.exports = { createServiceClient };
