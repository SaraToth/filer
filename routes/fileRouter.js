const { Router } = require("express");
const fileRouter = Router();
const { downloadFile, deleteFile, uploadFile } = require("../controllers/fileController");
const isAuthorized = require("../middleware/isAuthorized");
const multer = require("multer");

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({storage});

fileRouter.use("/", isAuthorized);
fileRouter.get("/:fileId/download", downloadFile);
fileRouter.delete("/:fileId", deleteFile);
fileRouter.post("/upload-file", upload.single("fileInput"), uploadFile);


module.exports = fileRouter;