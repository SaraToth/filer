const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const { body, validationResult } = require("express-validator");
const { use } = require("passport");

const validateFolder = [
    body("folderName")
        .trim()
        .notEmpty().withMessage("Folder name cannot be blank.")
        .isAlphanumeric().withMessage("Folder name can only contain letters or numbers")
        .custom(async (folderName, {req}) => {
            const userId = req.user?.id;

            // Skips further validation, will be caught as error in postFolder
            if (!userId) return true;

            const folder = await prisma.folder.findFirst({
                where: {
                    folderName,
                    userId,
                },
            });
            if (folder) {
                throw new Error("You already have a folder with that name.");
            }
            return true;
        }),
]

const postFolder = [
    validateFolder,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send("Some errors occured validating post folder");
            //return res.status(400).render(create folder view, {errors: errors.array(), data: req.body});
        }
        const { folderName } = req.body; // from folder form
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).send("Unauthorized: User not logged in.");
            //return res.status(401).render(some kind of view);
        };

        await prisma.folder.create({
            data: {
                folderName: folderName,
                userId: userId,
            },
        });
        return res.redirect("/dashboard");
    }),
];

const deleteFolder = asyncHandler(async (req, res) => {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user?.id;

    if (isNaN(folderId)) {
        return res.send("folderId must be a number");
        //return res.status(400).render(some view that displays the error?)
    }

    // delete all files with that folderId first
    await prisma.file.deleteMany({
        where: {
            folderId: folderId,
            userId: userId,
        },
    });

    // delete the folder
    await prisma.folder.deleteMany({
        where: {
            id: folderId,
            userId: userId,
        },
    });
    res.redirect("/dashboard");
});

const patchFolder = [
    validateFolder,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send("Some errors occured validating post folder");
            //return res.status(400).render(create folder view, {errors: errors.array(), data: req.body});
        }
        const folderId = parseInt(req.params.folderId);
        const { folderName } = req.body;
        const userId = req.user?.id;

        // check user owns that folder
        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId,
            },
        });
        if (!folder || folder.userId !== userId) {
            return res.status(403).send("Forbidden: You do not own this folder");
            //return res.status(403).render();
        }
        await prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                folderName: folderName,
            },
        });

        return res.redirect("/dashboard");
    }),
]

module.exports = { postFolder, deleteFolder, patchFolder };