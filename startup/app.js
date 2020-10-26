const express = require("express");
const cors = require("cors");
const config = require("config");
const log = require("../logger/logger");
const app = express();
const path = require("path");
const helmet = require("helmet");

//Main method for initializing whole application
module.exports = async function (workingDirName) {
  //#region ========== INITIAL SETTINGS ==========

  //Setting working directory as a default dir name if it was not set
  if (!workingDirName) workingDirName = __dirname;

  //#endregion ========== INITIAL SETTINGS ==========

  //#region ========== INITIALIZING LOGGING ==========

  await require("./logs")();

  //#endregion ========== INITIALIZING LOGGING ==========

  //#region ========== INITIALIZING CONFIG ==========

  await require("./config")();

  //#endregion ========== INITIALIZING CONFIG ==========

  //#region ========== INITIALIZING USERS ==========

  await require("./users")();

  //#endregion ========== INITIALIZING USERS ==========

  //#region ========== INITIALIZING NETPLAN IPCONFIG ==========

  //Netplan service has to be initialized before project! - in order to set ipConfig based on projectFile content
  await require("./netplan")();

  //#endregion ========== INITIALIZING NETPLAN IPCONFIG ==========

  //#region ========== INITIALIZING VALIDATION ==========

  await require("./validation")();

  //#endregion ========== INITIALIZING VALIDATION ==========

  //#region ========== INITIALIZING PROJECT ==========

  await require("./project")();

  //#endregion ========== INITIALIZING PROJECT ==========

  //#region ========== INITIALIZING ROUTES ==========

  //Initializing proccess of automatically calling next when error occurs while request handling - in order to go to last middlware of logging error
  require("express-async-errors");

  //Turning on helmet - in order to apply basic security for express
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  log.info("Helmet initialized");

  //Turning on cors - in order to apply x-auth-token to acceptable as a header parameter
  let corsOptions = {
    exposedHeaders: [config.get("tokenHeader")],
  };

  app.use(cors(corsOptions));

  log.info("Cors initialized");

  //Static front-end files are stored under client/build dir
  app.use(express.static(path.join(workingDirName, "client/build")));

  log.info("Static files initilized");

  //Routes have to be initialized after initializing main middleware
  await require("./route")(app);

  //In order for react routing to work - implementing sending always for any not-recognized endpoints
  app.get("*", (req, res) => {
    res.sendFile(path.join(workingDirName, "/client/build/index.html"));
  });

  //#endregion ========== INITIALIZING ROUTES ==========

  //#region ========== SETTING UP SERVER ==========

  //Getting port from env variables or from config
  const port = process.env.PORT || config.get("port");

  //Starting express server
  return app.listen(port, () => {
    log.info(`Listening on port ${port}...`);
  });

  //#endregion ========== SETTING UP SERVER ==========
};
