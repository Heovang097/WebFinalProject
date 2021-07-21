const express = require('express')

const router = express.Router();

router.get('/auth', function(req, res) {
    res.json(req.session.auth)
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log(fullUrl)
})

module.exports = router