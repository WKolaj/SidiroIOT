const logService = require("./services/logService");

let exec = async () => {
  await logService.init("logs", "info", "log");

  let content = await await logService.getLastLogFileContent();

  console.log(content);
};

exec();
