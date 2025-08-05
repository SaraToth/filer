const prisma = require("../prisma/client");
const path = require("path");
const fs = require("fs");

const downloadFile = async (req, res) => {
    const fileId  = Number(req.params.fileId);
    const userId = req.user?.id;

    // Double check user authentification
    if (!userId) {
        return res.status(401).send("Unauthorized: User not logged in.");
    };

    // Get file info to download from database
    const file = await prisma.file.findUnique({
        where: {
            id: fileId,
            userId: userId,
        }
    });


    if (!file) {
        return res.status(404).send("File not found");
    };

    // __dirname will result in root/controller/
    // .. Resolves to  /root/uploads/files
    const filePath = path.join(__dirname, "..", file.link); 
    res.download(filePath, file.fileName);
     
};

const deleteFile = (req, res) => {
    const { fileId } = req.params;
    res.send("This is how we delete a file");
};

const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        await prisma.file.create({
            data: {
                fileName: file.originalname,
                link: file.path,
                userId: req.user.id,
                folderId: parseInt(req.body.folderId),
            }
        });

        res.redirect("/dashboard");
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).send("Upload failed");
    }
};

module.exports = { downloadFile, deleteFile, uploadFile };