const express = require('express')
const articleModel = require('../models/article.model')
const auth = require('../middlewares/auth.mdw')

const router = express.Router()

router.get('/editor', auth, async function(req, res) {
    const user = req.session.authUser
    if (user.PenName != null) {
        res.render('../views/vwWriter/editor.hbs')
        return
    }
    const url = req.headers.referer || '/'
    res.redirect(url)
})

router.post('/publish', auth)

module.exports = router