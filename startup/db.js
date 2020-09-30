const logger = require("../logger/logger");
const mongoose = require("mongoose");
const config = require("config");

//Method for initializing database connection
module.exports = async function () {
  logger.info("database initializing database...");

  //getting connection string from config
  //For production it is stored in enviroment variables
  const connectionString = config.get("dbConnectionString");

  //Connecting to mongoDB
  //Payload object (second argument) should be given - according to mongoDB documenation
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  logger.info("database initialized");
};
