const downloadFile = (req, res) => {
    const { fileId } = req.params;
    res.send("This is so we can download a file");
};

const deleteFile = (req, res) => {
    const { fileId } = req.params;
    res.send("This is how we delete a file");
};

const uploadFile = (req, res) => {
    res.send("This is how we upload a file");
};

module.exports = { downloadFile, deleteFile, uploadFile };