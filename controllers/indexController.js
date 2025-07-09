
const getLandingPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    return res.render("landingPage");
};

const getDashboard = (req, res) => {
    return res.render("dashboard");
};

module.exports = { getLandingPage, getDashboard };