const prisma = require("../prisma/client");

const getLandingPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    return res.render("landingPage");
};

const getFolders = async (req, res, next) => {
    const userId = req.user?.id;

    // Current folder defaults to My Files
    let currentFolder = await prisma.folder.findFirst({
        where: {
            userId: userId,
            folderName: "My Files",
        },
    });

    // Update current folder to user selected folder
    if (req.params.folderId) {
        const folderId = parseInt(req.params.folderId);
        currentFolder = await prisma.folder.findUnique({
            where: {
                id: folderId,
            },
        });
    };

    const folders = await prisma.folder.findMany({
        where: {
            userId: userId
        },
    });
    req.folders = folders;
    req.currentFolder = currentFolder;
    next();
};

const getFiles = async (req, res, next) => {
    const userId = req.user?.id;

    // Default folder is My Files
    let files = await prisma.file.findMany({
        where: {
            userId: userId,
            folder: {
                folderName: "My Files"
            }
        }
    });

    // If user clicks a different folder:
    if (req.params.folderId) {
        const folderId = parseInt(req.params.folderId);

        files = await prisma.file.findMany({
            where: {
                userId: userId,
                folderId: folderId
            },
        });
    }
    req.files = files;
    next();
};

const getDashboard = async (req, res) => {

    return res.render("dashboard", {user: req.user, currentFolder: req.currentFolder, folders: req.folders, files: req.files});
};

module.exports = { getLandingPage, getDashboard, getFolders, getFiles };