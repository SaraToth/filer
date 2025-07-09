const express = require("express");
const app = express();
require("dotenv").config();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const folderRouter = require("./routes/folderRouter");
const fileRouter = require("./routes/fileRouter");
const assetsPath = path.join(__dirname, "public");
const postToPatchOverride = require("./middleware/postToPatchOverride");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false}));
app.use(postToPatchOverride);

app.use("/files", fileRouter);
app.use("/folders", folderRouter);
app.use("/user", authRouter);
app.use("/", indexRouter);

 app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
 });

 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
    console.log("App is running");
 });