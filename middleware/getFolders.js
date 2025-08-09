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

module.exports = getFolders;