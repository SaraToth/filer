const isAuthorized = (req, res, next) => {
    console.log("We checked if they are admin.");
    console.log("This function does nothing so far though");
    next();
}

module.exports = isAuthorized;