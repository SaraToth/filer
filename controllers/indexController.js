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

const getErrorPage = async (req, res) => {
    const { message, status } = req.query;
    return res.render("errorPage", { message, status });
}

module.exports = { getLandingPage, getDashboard, getErrorPage };