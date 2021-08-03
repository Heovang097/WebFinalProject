const express = require('express')

const router = express.Router();

router.get('/auth', function(req, res) {
    res.json(req.session.auth)
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log(fullUrl)
})

router.get('/userid', function(req, res) {
    if (req.session.auth)
        res.json(req.session.authUser)
    else
        res.json(null)
})

module.exports = router