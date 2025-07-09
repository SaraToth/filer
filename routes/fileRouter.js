const { Router } = require("express");
const fileRouter = Router();
const { downloadFile, deleteFile, uploadFile } = require("../controllers/fileController");
const isAuthorized = require("../middleware/isAuthorized"); 

fileRouter.use("/", isAuthorized);
fileRouter.get("/:fileId/download", downloadFile);
fileRouter.delete("/:fileId", deleteFile);
fileRouter.post("/", uploadFile);

module.exports = fileRouter;