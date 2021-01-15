module.exports = function () {

    return function cacheImages(req, res, next) {

        // Check if download file:
        if (req.originalUrl.includes('/api/Containers/') && req.originalUrl.includes('/download/')) {
            console.log("Here at the middle ware");

            console.log(req.originalUrl);

            res.set('Cache-Control', 'max-age=315360000');
        }

        next();
    }
}