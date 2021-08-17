const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const articleModel = require('../models/article.model')
const tagModel = require('../models/tag.model')
const auth = require('../middlewares/auth.mdw')

const moment = require('moment');
moment.locale("vi")

const router = express.Router()

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
                Premium: (req.body.Premium)? 1:0,
                State: 1,
                Views: 0,
                LastWeekViews: 0,
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
            res.redirect('/article/content/' + id)
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
        var Premium = false
        if (article.Premium === 1){
            Premium = true
        }
        res.render('../views/vwWriter/edit.hbs', {
            article,
            tags,
            Premium
        })
        return;
    }
    const url = req.headers.referer || '/'
    res.redirect(url)
})

router.post('/edit/:id', auth, async function(req, res) {
    const ArtID = req.params.id
    const article = await articleModel.detail(ArtID);
    const ImageLink = article.ImageLink
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
            await tagModel.delete(ArtID)
            const article = {
                ArtID: ArtID,
                UserID: req.session.authUser.UserID,
                BranchID: req.body.branch,
                Title: req.body.title,
                Abstract: req.body.abstract,
                Content: req.body.content,
                Premium: (req.body.Premium)? 1:0,
                State: 1,
                Views: 0,
                Reason: "",
            }
            if (req.file){
                try {
                    fs.unlinkSync(ImageLink)
                    article.ImageLink = req.file.path
                } catch(err) {
                    fs.unlinkSync(req.file.path)
                    console.error(err)
                }                  
            }
            await articleModel.patch(article)

            // save tags in data
            var listTags = req.body.tags.split(',')
            var tags = []
            listTags.forEach(element => {
                var obj = {}
                obj['ArticleID'] = ArtID
                obj['TagName'] = element
                tags.push(obj)
            })
            await tagModel.insert(tags)
            res.redirect('/writer/edit/' + ArtID)
        }
    })
})

router.get('/list', auth, async function(req,res){
    const articles = await articleModel.findByUserID(req.session.authUser.UserID);
    var published = []
    var pending = []
    var denied = []
    var approved = []
    articles.forEach(el => {
        el.DateOfPublish = capitalizeFirstLetter(moment(el.DateOfPublish).format('LLLL'));
        switch (el.State) {
            case 0:
                published.push(el);
                break;
            case 1:
                pending.push(el);
                break;
            case 2:
                denied.push(el);
                break;
            case 3:
                approved.push(el);
                break;
            default:
                break;
        }
    })
    res.render('../views/vwWriter/list.hbs', {
        published,
        pending,
        denied,
        approved
    })
})

module.exports = router