const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const toProperNoun = (rawName) => {
    return rawName
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

const validateSignup = [
    body("firstName")
        .trim()
        .isAlpha().withMessage("First name must only contain letters.")
        .isLength({min: 1, max: 50}).withMessage("First name must between 1 and 50 characters.")
        .customSanitizer(toProperNoun),
    body("lastName")
        .trim()
        .isAlpha().withMessage("Last name must only contain letters.")
        .isLength({min: 1, max: 50}).withMessage("Last name must between 1 and 50 characters.")
        .customSanitizer(toProperNoun),
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Must provide a valid email.")
        .custom(async (email) => {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });
            if (existingUser) {
                throw new Error("Email is already in use");
            }
        }),
    body("password")
        .trim()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/).withMessage("Password must contain at least one lower case letter")
        .matches(/[A-Z]/).withMessage("Password must contain at least one upper case letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Must type password a second time.")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];

const validateLogin = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Must provide a valid email address.")
        .custom(async (email) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });
            if (!user) {
                throw new Error("There is no account associated with that email address.");
            }
            return true;
        }),
    body("password")
        .trim()
        .notEmpty().withMessage("Must enter a password"),
];

const getLogin = (req, res) => {
    return res.render("login");
};

const getSignup = (req, res) => {
    return res.render("signup");
};

const postLogin = [
    validateLogin,

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("login", { errors: errors.array(), data: req.body});
        }
        next();
    }),
    
    (req, res) => {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/user/login?error=true"
        }) (req, res);
    },
];

const postSignup = [
    validateSignup,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("signup", { errors: errors.array(), data: req.body});
        }
        const { firstName, lastName, email, password } = req.body; // comes from signup form data
        const hashedPassword = await bcrypt.hash(password, 10);


        await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                folders: {
                    create: {
                        folderName: "My Files",
                    },
                },
            },
        })
        
        res.redirect("/user/login");
    }),
];

const getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

module.exports = { getLogin, getSignup, postLogin, postSignup, getLogout };