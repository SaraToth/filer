const prisma = require("../prisma/client");

const isValidFolderId = async (req, res, next) => {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user?.id;

    if (Number.isNaN(folderId)) {
        return res.status(404).render("errorPage", {
            status: 404,
            message: "Page Not Found"
        });
    }
    
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId,
            userId: userId
        }
    });

    if (!folder) {
        return res.status(404).render("errorPage", {
            status: 404,
            message: "Page Not Found"
        });
    } else {
        next();
    }
};

module.exports = isValidFolderId;