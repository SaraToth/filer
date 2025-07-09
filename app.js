const express = require("express");
const app = express();
require("dotenv").config();
const expressSession = require("express-session");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");
const prisma = require("./prisma/client");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const folderRouter = require("./routes/folderRouter");
const fileRouter = require("./routes/fileRouter");
const assetsPath = path.join(__dirname, "public");
const postToPatchOverride = require("./middleware/postToPatchOverride");
const passport = require("passport");
require("./config/passport");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false}));
app.use(postToPatchOverride);

app.use(
   expressSession({
      cookie: {
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
         secure: process.env.NODE_ENV === "production",
         httpOnly: true,
         sameSite: "lax",
      },
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(
         prisma,
         {
            checkPeriod: 2 * 6 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
         }
      )
   })
)
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/files", fileRouter);
app.use("/folders", folderRouter);
app.use("/user", authRouter);
app.use("/", indexRouter);

// Error Handler
app.use((err, req, res, next) => {
   console.error(err);
   res.status(500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log("App is running");
});