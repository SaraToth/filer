// Converts form method from POST to PATCH
// Requires this input in the form to work:
//<input type="hidden" name="_method" value="PATCH" />


const postToPatchOverride = (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method.toUpperCase();
        delete req.body._method; // Remove so it doesn't interfere later
    }
    next();
}

module.exports = postToPatchOverride;