const express = require("express");
const router = express.Router();
const logService = require("../services/logService");
const { exists } = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isAdmin = require("../middleware/auth/isAdmin");

//#region ========== GET ==========

//Route for getting logs of last log file
//Only admins can get logs
router.get("/", [hasUser, isAdmin], async (req, res) => {
  let fileContent = await logService.getLastLogFileContent();
  if (!exists(fileContent)) return res.status(200).send("");

  return res.status(200).send(fileContent);
});

//#endregion ========== GET ==========

module.exports = router;

//TODO - test this route
