const logger = require("../logger/logger");
const error = require("../middleware/routeError");
const userRouter = require("../routes/user");
const authRouter = require("../routes/auth");

//Method for initializing routes
module.exports = async function (app) {
  logger.info("initializing routes...");

  //#region ========== CUSTOM ROUTES ==========

  //TODO - HERE PUT ALL ROUTES THAT YOU IMPLEMENT
  //USE CODE app.use() - AS BELOW
  //IF APP IS HOSTED NOT ON MAIN URL - eg. sidiro.pl/sidiroAR instead of sidiro.pl PUT WHOLE PATH TO API - /sidiroAR/api/auth

  //#endregion ========== CUSTOM ROUTES ==========

  //#region ========== SERVER ROUTES ==========

  app.use("/api/auth", authRouter);
  logger.info("Auth route initialized");

  app.use("/api/user", userRouter);
  logger.info("User route initialized");

  //#endregion ========== SERVER ROUTES ==========

  logger.info("routes initialized");

  app.use(error);
};
