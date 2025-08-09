const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getDashboard, getErrorPage } = require("../controllers/indexController");
const isAuthorized = require("../middleware/isAuthorized"); 
const getFolders = require("../middleware/getFolders");
const getFiles = require("../middleware/getFiles");

// (My files can't be deleted)
// Dashboard will open modals for new folder / file upload

indexRouter.get("/error", isAuthorized, getErrorPage);
indexRouter.get("/dashboard/:folderId", isAuthorized, getFolders, getFiles, getDashboard);
indexRouter.get("/dashboard", isAuthorized, getFolders, getFiles, getDashboard);
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;