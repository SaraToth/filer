const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");
const { body, validationResult } = require("express-validator");
const alphaNumericSpaces = /^[a-zA-Z0-9 ]+$/;
const fs = require("fs");
const path = require("node:path");

const validateFolder = [
    body("folderName")
        .trim()
        .notEmpty().withMessage("Folder name cannot be blank.")
        .matches(alphaNumericSpaces).withMessage("Folder name can only contain letters, numbers and spaces.")
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

const validatePatchFolder = [
    body("newFolderName")
        .trim()
        .notEmpty().withMessage("Folder name cannot be blank.")
        .matches(alphaNumericSpaces).withMessage("Folder name can only contain letters, numbers and spaces."),
];

const postFolder = [
    validateFolder,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send("Some errors occured validating post folder");

        }
        const { folderName } = req.body; // from folder form
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).send("Unauthorized: User not logged in.");
            //return res.status(401).render(some kind of view);
        };

        const newFolder = await prisma.folder.create({
            data: {
                folderName: folderName,
                userId: userId,
            },
        });
        return res.redirect(`/dashboard/${newFolder.id}`);
    }),
];

const deleteFolder = asyncHandler(async (req, res) => {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user?.id;

    if (isNaN(folderId)) {
        return res.send("folderId must be a number");
        //return res.status(400).render(some view that displays the error?)
    }

    // Delete all files in that folder locally

    // Access the files
    const files = await prisma.file.findMany({
        where: {
            folderId: folderId,
            userId: userId,
        },
    });

    // Delete files from local directory
    files.forEach((file) => {
        const filePath = path.join(__dirname, "..", file.link); 
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error(`Failed to delete file at ${filePath}:`, err);
        }
    })

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
    
    // Send a success response to front end
    return res.status(200).json({ success: true })
});

const patchFolder = [
    validatePatchFolder,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send("Some errors occured validating patch folder");
            //return res.status(400).render(create folder view, {errors: errors.array(), data: req.body});
        }

        const folderId = parseInt(req.params.folderId);
        const folderName = req.body.newFolderName;
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

        // Send a success response to front end
        return res.status(200).json({ success: true })
    }),
]

module.exports = { postFolder, deleteFolder, patchFolder };