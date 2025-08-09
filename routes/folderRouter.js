const { Router } = require("express");
const folderRouter = Router();
const { postFolder, deleteFolder, patchFolder } = require("../controllers/folderController");
const isAuthorized = require("../middleware/isAuthorized"); 

folderRouter.use("/", isAuthorized);

folderRouter.post("/", postFolder);
folderRouter.delete("/:folderId/delete", deleteFolder);
folderRouter.patch("/:folderId/rename", patchFolder);

module.exports = folderRouter;