const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getDashboard, getDashboardFolder, getFolders } = require("../controllers/indexController");
const isAuthorized = require("../middleware/isAuthorized"); 

// (My files can't be deleted)
// Dashboard will open modals for new folder / file upload

//Create a middleware to override the folder used to display files in getDashboard
// If that file exists -> render its files, if not default to "My Files"
indexRouter.get("/dashboard/folder/:folderId", isAuthorized, getFolders, getDashboardFolder)

indexRouter.get("/dashboard", isAuthorized, getFolders, getDashboard);
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;