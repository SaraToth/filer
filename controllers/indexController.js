
const getLandingPage = (req, res) => {
    res.send("This is the landing page for unauthorized users");
};

const getDashboard = (req, res) => {
    res.send("This is the dashboard for authorized users");
};

module.exports = { getLandingPage, getDashboard };