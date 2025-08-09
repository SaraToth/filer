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
        return res.status(404).render("errorPage", {
            status: 404,
            message: "Page Not Found"
        })
    };

    // __dirname will result in root/controller/
    // .. Resolves to  /root/uploads/files
    const filePath = path.join(__dirname, "..", file.link); 
    res.download(filePath, file.fileName);
     
};

const deleteFile = async (req, res) => {
    const fileId = Number(req.params.fileId);
    const userId = req.user?.id;

    // Double check user authentification
    if (!userId) {
        return res.status(401).render("errorPage", {
            status: 401,
            message: "Unauthorized: User not logged in"
        });
    };

    // Access file information
    const file = await prisma.file.findUnique({
        where: {
            id: fileId,
            userId: userId,
        },
    });

    // Delete file from local directory
    const filePath = path.join(__dirname, "..", file.link); 
    fs.unlinkSync(filePath);

    // Delete file information from database
    await prisma.file.delete({
        where: {
            id: fileId,
            userId: userId,
        }
    });

    // Send a success response to front end
    res.status(204).send();
};

const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        // Add the file to current folder
        await prisma.file.create({
            data: {
                fileName: file.originalname,
                link: file.path,
                userId: req.user.id,
                folderId: parseInt(req.body.folderId),
            }
        });

        // Get the current folder information from database
        const currentFolder = await prisma.folder.findFirst({
            where: {
                id: parseInt(req.body.folderId),
                userId: req.user.id,
            }
        });

        // If current folder is not "My Files" add the file to the My Files folder too
        if (currentFolder.folderName === "My Files") {
            return res.redirect(`/dashboard/${req.body.folderId}`);
        } else {
            const myFiles = await prisma.folder.findFirst({
                where: {
                    userId: req.user.id,
                    folderName: "My Files",
                }
            });

            await prisma.file.create({
                data: {
                    fileName: file.originalname,
                    link: file.path,
                    userId: req.user.id,
                    folderId: myFiles.id,
                }
            })
        }
        return res.redirect(`/dashboard/${req.body.folderId}`);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).render("errorPage", {
            status: 500,
            message: "Upload failed"
        });
    }
};

module.exports = { downloadFile, deleteFile, uploadFile };