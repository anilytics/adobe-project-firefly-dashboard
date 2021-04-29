const fetch = require("node-fetch");
const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
} = require("../utils");
const { getReports } = require("../helpers/gaAuth");

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });

  try {
    // 'info' is the default level if not set
    logger.info("Calling the main action");

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));
    const res = await getReports(params);
    const reports = await res.data.reports;
    const response = {
      statusCode: 200,
      body: reports,
    };
    //logger.info(`${response.statusCode}: successful request`);
    return response;
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, "server error", logger);
  }
}

exports.main = main;
