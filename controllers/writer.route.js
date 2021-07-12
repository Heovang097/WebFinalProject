const express = require('express')
const multer = require('multer')
const path = require('path')

const articleModel = require('../models/article.model')
const auth = require('../middlewares/auth.mdw')

const router = express.Router()

router.get('/test', function(req, res) {
    res.json(res.locals.lcCategories)
})

router.get('/post', auth, function(req, res) {
    if (req.session.isWriter) {
        res.render('../views/vwWriter/post.hbs')
        return
    }
    const url = req.headers.referer || '/'
    res.redirect(url)
})

router.post('/post', auth, async function(req, res) {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/articles')
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })

    const upload = multer({
        storage
    })

    upload.single('cover')(req, res, async function(err) {
        if (err) {
            console.log(err);
        } else {
            // save article in database
            const article = {
                UserID: req.session.UserID,
                BranchID: req.body.branch,
                ImageLink: req.file.path,
                Title: req.body.title,
                Abstract: req.body.abstract,
                Content: req.body.content,
                Premium: req.body.premium === "on",
                State: 0,
            }
            await articleModel.insert(article)

            // save tags in data
            var listTags = req.body.tags.split(',')
            var query = await articleModel.count()
            query = query[0]
            const id = query.count + 1
            var tags = []
            listTags.forEach(element => {
                var obj = {}
                obj['ArticleID'] = id
                obj['TagName'] = element
                tags.push(obj)
            })
            await articleModel.insert(tags)
        }
    })
})

module.exports = router