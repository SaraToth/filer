const prisma = require("../prisma/client");

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

module.exports = getFiles;