const prisma = require("../prisma/client");

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
        // If folderId provided is not an actual id number
        if (Number.isNaN(parseInt(req.params.folderId))) {
            return res.status(404).render("errorPage", {
                status: 404,
                message: "Page Not Found"
            })
        }

        const folderId = parseInt(req.params.folderId);
        currentFolder = await prisma.folder.findFirst({
            where: {
                userId: userId,
                id: folderId,
            },
        });

        // If folderId does not correspond to an existing folder
        if (!currentFolder) {
            return res.status(404).render("errorPage", {
                status: 404,
                message: "Page Not Found"
            });
        }
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

module.exports = getFolders;