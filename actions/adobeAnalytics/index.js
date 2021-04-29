const { Core, Analytics } = require("@adobe/aio-sdk");
const {
  errorResponse,
  getBearerToken,
  stringParameters,
  checkMissingRequestInputs,
} = require("../utils");

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });

  try {
    // check for missing request input parameters and headers
    const requiredParams = ["apiKey", "companyId"];
    const requiredHeaders = ["Authorization"];
    const errorMessage = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    );
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params);

    // initialize the sdk
    const analyticsClient = await Analytics.init(
      params.companyId,
      params.apiKey,
      token
    );

    const payLoad = params.aaPayLoad;
    // get collections from analytics API
    const report = await analyticsClient.getReport(payLoad.query);
    const response = {
      statusCode: 200,
      body: report.data,
    };
    //logger.debug("collections = " + JSON.stringify(report.data, null, 2));

    // log the response status code
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
