const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const { body, validationResult } = require("express-validator");

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

    if (isNaN(folderId)) {
        return res.send("folderId must be a number");
        //return res.status(400).render(some view that displays the error?)
    }

    // delete all files with that folderId first
    await prisma.file.deleteMany({
        where: {
            folderId: folderId,
        },
    });

    // delete the folder
    await prisma.folder.delete({
        where: {
            id: folderId,
        },
    });
    res.redirect("/dashboard");
});

const patchFolder = (req, res) => {
    const { folderId } = req.params;
    res.send("This will update folder name");
};

module.exports = { postFolder, deleteFolder, patchFolder };