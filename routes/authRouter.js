const { Router } = require("express");
const authRouter = Router();
const { getLogin, getSignup, postLogin, postSignup } = require("../controllers/authController");

authRouter.get("/login", getLogin);
authRouter.get("/signup", getSignup);
authRouter.post("/login", postLogin);
authRouter.post("/signup", postSignup);

module.exports = authRouter;