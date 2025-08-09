const { Router } = require("express");
const folderRouter = Router();
const { postFolder, deleteFolder, patchFolder, checkDefaultFolder } = require("../controllers/folderController");
const isAuthorized = require("../middleware/isAuthorized"); 

folderRouter.use("/", isAuthorized);

folderRouter.post("/", postFolder);
folderRouter.delete("/:folderId/delete", checkDefaultFolder, deleteFolder);
folderRouter.patch("/:folderId/rename", checkDefaultFolder, patchFolder);

module.exports = folderRouter;