const express = require('express')
const multer = require('multer')
const path = require('path')

const articleModel = require('../models/article.model')
const auth = require('../middlewares/auth.mdw')

const router = express.Router()

router.get('/publish', auth, function(req, res) {
    if (req.session.writer) {
        res.render('../views/vwWriter/publish.hbs')
        return
    }
    const url = req.headers.referer || '/'
    res.redirect(url)
})

router.post('/publish', auth, async function(req, res) {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/articles')
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            console.log(path.extname(file.originalname))
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })

    const upload = multer({
        storage
    })

    upload.single('cover')(req, res, function(err) {
        if (err) {
            console.log(err);
        } else {
            const article = {
                UserID: req.session.UserID,
                BranchID: req.body.branch,
                ImageLink: req.file.path,
                Title: req.body.title,
                Abstract: req.body.abstract,
                Content: req.body.content,
                IsPremium: req.body.premium === "on",
                State: 0,
            }
            const tags = req.body.tags.split(',')
            console.log(tags)
        }
    })
})

module.exports = router