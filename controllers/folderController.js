const postFolder = (req, res) => {
    res.send("This will post a new folder");
};

const deleteFolder = (req, res) => {
    const { folderId } = req.params;
    res.send("This will delete a folder");
};

const patchFolder = (req, res) => {
    const { folderId } = req.params;
    res.send("This will update folder name");
};

module.exports = { postFolder, deleteFolder, patchFolder };