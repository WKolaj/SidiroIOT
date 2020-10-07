const logger = require("../logger/logger");
const error = require("../middleware/routeError");
const userRouter = require("../routes/user");
const authRouter = require("../routes/auth");
const devInfoRouter = require("../routes/deviceInfo");
const ipConfigRouter = require("../routes/ipConfig");
const configFileRouter = require("../routes/configFile");

//Method for initializing routes
module.exports = async function (app) {
  logger.info("initializing routes...");

  //#region ========== CUSTOM ROUTES ==========

  app.use("/api/devInfo", devInfoRouter);
  logger.info("Device info route initialized");

  app.use("/api/configFile", configFileRouter);
  logger.info("Config file route initialized");

  //#endregion ========== CUSTOM ROUTES ==========

  //#region ========== SERVER ROUTES ==========

  app.use("/api/auth", authRouter);
  logger.info("Auth route initialized");

  app.use("/api/user", userRouter);
  logger.info("User route initialized");

  app.use("/api/ipConfig", ipConfigRouter);
  logger.info("ipConfig route initialized");

  //#endregion ========== SERVER ROUTES ==========

  logger.info("routes initialized");

  app.use(error);
};
