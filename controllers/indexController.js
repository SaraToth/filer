
const getLandingPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    res.send("This is the landing page for unauthorized users");
    //return res.render("landingPage");
};

const getDashboard = (req, res) => {
    res.send("This is the dashboard for authorized users");
    // return res.render("dashboard");
};

module.exports = { getLandingPage, getDashboard };