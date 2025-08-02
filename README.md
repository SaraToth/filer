# filer
A file storage system created in Node.js and Express


- Set up Post route for the new folder

# Working with Multer

Multer was used ase a way to manage file uploads in this project.

Multer creates a file object to the request object which can be accessed using req.file

The diskstorage engine gies full control over storage, where destination indicates the folder (uploads/ in this case) where the file will be stored and filename is how the file will be named.

```js
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({storage});
```

Then you can add the upload.single([form input name])

```js
fileRouter.post("/upload-file", upload.single("fileInput"), uploadFile);
```

Also make sure to include enctype="multipart/form-data" in your form

```html
<form action="/files/upload-file" method="POST"  enctype="multipart/form-data" >
    ...
</form>
```

Then once multer is setup you can access the file info using req.file and add it to your database based on the prisma schema you have setup
```js
const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        await prisma.file.create({
            data: {
                fileName: file.originalname,
                link: file.path,
                userId: req.user.id,
                folderId: parseInt(req.body.folderId),
            }
        });

        res.redirect("/dashboard");
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).send("Upload failed");
    }
};
```