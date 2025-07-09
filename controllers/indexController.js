const prisma = require("../prisma/client");

const getLandingPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    return res.render("landingPage");
};

const getDashboard = async (req, res) => {
    const userId = req.user?.id;

    // Need to get all the folders
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId
        },
    });

    // need to get all the files
    const files = await prisma.file.findMany({
        where: {
            userId: userId,
            folder: {
                folderName: "My Files"
            }
        }
    });

    return res.render("dashboard", {user: req.user, folders, files});
};

const getDashboardFolder = async (req, res) => {
    const userId = req.user?.id;
    const folderId = parseInt(req.params.folderId);

    // Need to get all the folders
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId
        },
    });

    // need to get all the files
    const files = await prisma.file.findMany({
        where: {
            userId: userId,
            folder: {
                id: folderId,
            },
        },
    });
    return res.render("dashboard", {user: req.user, folders, files});
}
module.exports = { getLandingPage, getDashboard, getDashboardFolder };