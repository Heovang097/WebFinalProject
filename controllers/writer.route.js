const express = require('express')
const multer = require('multer')
const path = require('path')

const articleModel = require('../models/article.model')
const tagModel = require('../models/tag.model')
const auth = require('../middlewares/auth.mdw')

const router = express.Router()

router.get('/test', async function(req, res) {
    const query = await tagModel.name()
    tagsname = []
    var count = 0
    query.forEach(el => {
        count = count + 1
        tagsname.push({
            id: count,
            name: el.TagName,
            value: el.TagName,
        })
    })
    res.json(tagsname)
})

router.get('/post', auth, function(req, res) {
    if (req.session.isWriter) {
        res.render('../views/vwWriter/post.hbs')
        return;
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
                UserID: req.session.authUser.UserID,
                BranchID: req.body.branch,
                ImageLink: req.file.path,
                Title: req.body.title,
                Abstract: req.body.abstract,
                Content: req.body.content,
                Premium: req.body.premium === "on",
                State: 1,
                Views: 0,
            }
            await articleModel.insert(article)

            // save tags in data
            var listTags = req.body.tags.split(',')
            var query = await articleModel.maxID()
            query = query[0]
            const id = query.maxID
            var tags = []
            listTags.forEach(element => {
                var obj = {}
                obj['ArticleID'] = id
                obj['TagName'] = element
                tags.push(obj)
            })
            await tagModel.insert(tags)
            res.redirect('/article/' + id)
        }
    })
})

router.get('/edit/:id', auth, async function(req, res) {
    const article = await articleModel.detail(req.params.id);
    if (article !== null && req.session.authUser.UserID === article.UserID && (article.State === 2 || article.State === 1)) {
        const query = await tagModel.findTagsByArticle(req.params.id);
        var tagsList = []
        query.forEach(el => {
            tagsList.push(el.TagName)
        })
        const tags = tagsList.join(',')
        console.log(tags)
        res.render('../views/vwWriter/edit.hbs', {
            article,
            tags
        })
        return;
    }
    const url = req.headers.referer || '/'
    res.redirect(url)
})

router.post('/edit/:id', auth, async function(req, res) {
    const article = await articleModel.detail(req.params.id);
    if (article === null || req.session.authUser.UserID !== article.UserID || article.State === 0 || article.State === 3) {
        res.redirect('/404')
        return
    }
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
            console.log(req.file)
        }
    })
})

module.exports = router