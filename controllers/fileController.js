const prisma = require("../prisma/client");

const downloadFile = (req, res) => {
    const { fileId } = req.params;
    res.send("This is so we can download a file");
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