const logger = require("../logger/logger");
const error = require("../middleware/routeError");
const userRouter = require("../routes/user");
const authRouter = require("../routes/auth");
const devInfoRouter = require("../routes/deviceInfo");
const ipConfigRouter = require("../routes/ipConfig");
const configFileRouter = require("../routes/configFile");
const deviceRouter = require("../routes/device");
const variableRouter = require("../routes/variable");
const calcElementRouter = require("../routes/calcElement");
const alertRouter = require("../routes/alert");
const elementRouter = require("../routes/element");
const valueRouter = require("../routes/value");
const activateRouter = require("../routes/activate");

//Method for initializing routes
module.exports = async function (app) {
  logger.info("initializing routes...");

  //#region ========== CUSTOM ROUTES ==========

  app.use("/api/devInfo", devInfoRouter);
  logger.info("Device info route initialized");

  app.use("/api/configFile", configFileRouter);
  logger.info("Config file route initialized");

  app.use("/api/device", deviceRouter);
  logger.info("Device route initialized");

  app.use("/api/variable", variableRouter);
  logger.info("Variable route initialized");

  app.use("/api/calcElement", calcElementRouter);
  logger.info("CalcElement route initialized");

  app.use("/api/alert", alertRouter);
  logger.info("Alert route initialized");

  app.use("/api/element", elementRouter);
  logger.info("Element route initialized");

  app.use("/api/value", valueRouter);
  logger.info("Value route initialized");

  app.use("/api/activate", activateRouter);
  logger.info("Device activate route initialized");

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
