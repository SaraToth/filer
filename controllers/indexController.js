const prisma = require("../prisma/client");

const getLandingPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    return res.render("landingPage");
};

const getDashboard = async (req, res) => {

    return res.render("dashboard", {user: req.user, currentFolder: req.currentFolder, folders: req.folders, files: req.files, errors: null});
};

module.exports = { getLandingPage, getDashboard };