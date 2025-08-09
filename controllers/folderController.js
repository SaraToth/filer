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
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const { folderName } = req.body; // from folder form
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ 
                errors: errors.array()
            })
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

    if (Number.isNaN(folderId)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid Folder id: Sorry, something went wrong with attempting to delete the folder."
        })
    }



    // Escape the deletion process to avoid deleting the default folder
    if (req.defaultFolder) {
        return res.status(200).json({ success: true })
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
            // ISSUE: Better error handling needed
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
            return res.status(400).json({
                errors: errors.array(),
            })
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
            return res.status(403).json({
                status: 403,
                message: "Forbidden: You do not own this folder."
            });
        }

        // Escapes renaming logic to prevent renaming default folder
        if (req.defaultFolder) {
            return res.status(200).json({ success: true })
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

const checkDefaultFolder = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const folderId = parseInt(req.params.folderId);

    const defaultFolder = await prisma.folder.findFirst({
        where: {
            userId: userId,
            folderName: "My Files",
        }
    });

    if (defaultFolder.id === folderId) {
        req.defaultFolder = true;
    } else {
        req.defaultFolder = false;
    }
    next();
});

module.exports = { postFolder, deleteFolder, patchFolder, checkDefaultFolder };