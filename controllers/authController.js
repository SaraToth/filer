const getLogin = (req, res) => {
    res.send("This will load the login page");
};

const getSignup = (req, res) => {
    res.send("This will load the signup page");
};

const postLogin = (req, res) => {
    res.send("This will post the login");
};

const postSignup = (req, res) => {
    res.send("This will post the sign up");
};

module.exports = { getLogin, getSignup, postLogin, postSignup };