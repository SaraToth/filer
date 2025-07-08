const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getDashboard} = require("../controllers/indexController");


// GET /
// GET /dashboard (automatically views "my files")
// (My files can't be deleted)
// Dashboard will open modals for new folder / file upload

indexRouter.get("/dashboard", getDashboard);
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;