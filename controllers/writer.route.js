const express = require('express')
const articleModel = require('../models/article.model')
const auth = require('../middlewares/auth.mdw')

const router = express.Router()

router.get('/editor', auth, function(req, res) {
    if (req.session.writer) {
        res.render('../views/vwWriter/editor.hbs')
        return
    }
    const url = req.headers.referer || '/'
    res.redirect(url)
})

router.post('/editor', auth, async function(req, res) {
    console.log(req.body);
    return
    const article = {
        UserID: req.session.UserID,
        BranchID: req.body.branch,
        ImageLink: image,
        Title: req.body.title,
        Abstract: req.body.abstract,
        Content: req.body.content,
        IsPremium: req.body.premium === "on",
        State: 0,
    }
    res.destroy()
})

module.exports = router