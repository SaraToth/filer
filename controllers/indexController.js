const prisma = require("../prisma/client");

const getLandingPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    return res.render("landingPage");
};

const getFolders = async (req, res, next) => {
    const userId = req.user?.id;
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId
        },
    });
    req.folders = folders;
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
                folder: {
                    id: folderId,
                },
            },
        });
    }
    req.files = files;
    next();
};

const getDashboard = async (req, res) => {
    const userId = req.user?.id;

    return res.render("dashboard", {user: req.user, folders: req.folders, files: req.files});
};

const getDashboardFolder = async (req, res) => {
    const userId = req.user?.id;
    const folderId = parseInt(req.params.folderId);

    return res.render("dashboard", {user: req.user, folders: req.folders, files: req.files});
}
module.exports = { getLandingPage, getDashboard, getDashboardFolder, getFolders, getFiles };