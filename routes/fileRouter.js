const { Router } = require("express");
const fileRouter = Router();
const { downloadFile, deleteFile, uploadFile } = require("../controllers/fileController");

fileRouter.get("/:fileId/download", downloadFile);
fileRouter.delete("/:fileId", deleteFile);
fileRouter.post("/", uploadFile);

module.exports = fileRouter;