const express = require("express");
const app = express();
require("dotenv").config();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));

app.use("/user", authRouter);
app.use("/", indexRouter);

 app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
 });

 const PORT = process.env.PORT;
 app.listen(PORT || 3000, () => {
    console.log("App is running");
 });