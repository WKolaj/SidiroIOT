const express = require("express");
const router = express.Router();
const config = require("config");
const {
  exists,
  existsAndIsNotEmpty,
  readFileAsync,
  removeFileIfExistsAsync,
  statAsync,
} = require("../utilities/utilities");
const hasUser = require("../middleware/auth/hasUser");
const isAdmin = require("../middleware/auth/isAdmin");
const _ = require("lodash");
const logger = require("../logger/logger");
const projectService = require("../services/projectService");
const formidable = require("formidable");
const fs = require("fs");

//#region ========== POST ==========

//Route for uploading config file
//Only admin upload config file
router.post("/", [hasUser, isAdmin], async (req, res) => {
  //Setting up formidable
  let form = new formidable.IncomingForm();
  form.keepExtensions = false;
  //file size limit per model - 10 MB
  form.maxFileSize = config.get("maxProjectFileSize");

  form.parse(req, async (err, fields, files) => {
    try {
      if (exists(err)) throw err;

      if (!existsAndIsNotEmpty(files) && !existsAndIsNotEmpty(files.file))
        throw new Error("File content not exists or is empty!");

      //Moving file to model directory
      let tmpFilePath = files.file.path;

      if (!exists(tmpFilePath))
        throw new Error("File path is empty after upload!");

      let projectContent = JSON.parse(await readFileAsync(tmpFilePath, "utf8"));

      //removing tmp file
      await removeFileIfExistsAsync(tmpFilePath);

      //TODO - add test for project validation!

      //Validating project content
      let validationResult = projectService.validateProjectPayload(
        projectContent
      );
      //If validation was not successfull - return error
      if (validationResult !== null)
        return res
          .status(400)
          .set("Content-Type", "text/plain")
          .send(validationResult);

      //Save new content to project file
      await projectService.saveProjectContentToFile(projectContent);

      //Load project file to memory
      await projectService.loadProjectFile();

      logger.action(`User ${req.user.name} uploaded new project file`);

      //returning respone
      return res
        .status(200)
        .set("Content-Type", "text/plain")
        .send("project file successfully uploaded and loaded!");
    } catch (error) {
      logger.error(error.message, error);
      return res.status(500).send("Error during uploading file...");
    }
  });
});

//#endregion ========== POST ==========

//#region ========== GET ==========

//Route for returning config file
router.get("/", [hasUser, isAdmin], async (req, res) => {
  //Checking if file exists
  let fileExists = await projectService.checkIfProjFileExistsAndIsValid();
  if (!fileExists)
    return res
      .status(404)
      .send("Project file does not exists or is invalid...");

  let projectFilePath = await projectService.getProjectFilePath();

  //Checking size of project file
  let stat = await statAsync(projectFilePath);

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Length": stat.size,
  });

  logger.action(`User ${req.user.name} started downloading project file`);

  //Returning stream to this file
  let fileStream = fs.createReadStream(projectFilePath);
  fileStream.pipe(res);
});

//#endregion ========== GET ==========

module.exports = router;
