# Filer
A file storage system created in Node.js and Express

Filer is a file storage system platform similar to Google drive. Users can signup or login and then upload files to customized folders for storage, download or delete files.

# Getting Started

First, go ahead and fork a clone and then you can run the following to download all dependencies

```
npm install
```

## Setting up a local database and .env

This project was created using Prisma. In order to get the project up and running locally you will have to make your own local database with psql and then load it into your .env file along with the secret you plan to use.

Once you have your environmental variables set up run the following in your terminal to set up the prisma database schema:
```
npx prisma migrate deploy
```

Then if you run node using the following the site should be up and running
```
node --watch app.js
```

# Working with Passport

Passport was used in order to set up user authentification. 

# Working with Multer

Multer was used ase a way to manage file uploads in this project.

Multer creates a file object to the request object which can be accessed using req.file

For multer to work the form must also be set to enctype="multipart/form-data" 

```html
<form action="/files/upload-file" method="POST"  enctype="multipart/form-data" >
    ...
</form>
```

The diskstorage engine gies full control over storage, where destination indicates the folder (uploads/ in this case) where the file will be stored and filename is how the file will be named.

```js
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({storage});
```


Then upload.single([form input name]) middleware will set the file info to the req.file object which can then be accessed through your controller function

```js
fileRouter.post("/upload-file", upload.single("fileInput"), uploadFile);
```

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

In order to protect files used to test locally, uploads folder was hidden via .gitignore If you are working with this program on your local environment you will need to first create an uploads folder in your root directory before getting started.

## Downloading and Deleting files with fs

Using fs, files can be accessed via the database, and then downloaded with the following logic where ".." is used to break out of the controller folder and access the root directory.

The file.link property from prisma schema stores the filepath from the perspective of the root directory. Simply just find the filePath and download.

```js
    const filePath = path.join(__dirname, "..", file.link); 
    res.download(filePath, file.fileName);
```

To delete a file with fs, you can use the same filePath and then use fs.unlinkSync() to delete it locally.
```js
    const filePath = path.join(__dirname, "..", file.link); 
    fs.unlinkSync(filePath);
```

When deleting a file, a success status must be sent to the front end, otherwise the front end script will catch an error.


# Upcoming Features

The following features have still yet to be developed:

- Allowing users to move a file location from folder to folder (branch: moveFile)
- Giving users an option when deleting a folder and it's files, to also delete thoses files from the main "My Files" folder (branch: massDelete)
- Styling the folder-links dropdown to look similar to that of the kebab dropdown menu (branch: dropdownStyle )
- Add responsive design features and ensure accessibility friendly (branch: responsiveDesign)
- Migrating file storage from local file system to a cloud service (branch: cloudStorage)

## Contributing Guidelines

If you would like to submit any changes, please fork a clone of this repository and then create a new branch.

Please only work on the features of ONE of the above listed features in your new branch. 

The branch you make should be named in accordance with the branch names provided next to the above features for easy understanding.

When finished send a pull request with details of your proposed changes.
