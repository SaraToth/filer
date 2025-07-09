const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getDashboard} = require("../controllers/indexController");
const isAuthorized = require("../middleware/isAuthorized"); 

// (My files can't be deleted)
// Dashboard will open modals for new folder / file upload


indexRouter.get("/dashboard", isAuthorized, getDashboard);
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;