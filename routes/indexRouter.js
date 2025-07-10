const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getDashboard, getFolders, getFiles } = require("../controllers/indexController");
const isAuthorized = require("../middleware/isAuthorized"); 

// (My files can't be deleted)
// Dashboard will open modals for new folder / file upload

indexRouter.get("/dashboard/:folderId", isAuthorized, getFolders, getFiles, getDashboard);
indexRouter.get("/dashboard", isAuthorized, getFolders, getFiles, getDashboard);
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;