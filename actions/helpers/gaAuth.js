const { google } = require("googleapis");
const { Core } = require('@adobe/aio-sdk')
const reporting = google.analyticsreporting("v4");
let scopes = ["https://www.googleapis.com/auth/analytics.readonly"];

const getReports = async (params) => {
    const jwt = new google.auth.JWT(
        params.client_email,
        null,
        params.private_key,
        scopes
      );

    const payLoad = params.gaPayLoad;

  try {
    await jwt.authorize();
    let request = {
      headers: { "Content-Type": "application/json" },
      auth: jwt,
      resource: payLoad,
    };
    return await reporting.reports.batchGet(request);
  } catch (error) {
    throw new Error("request to jwt auth failed with error " + error);
    logger.error(error);
  }
};

module.exports = {
    getReports,
  }
