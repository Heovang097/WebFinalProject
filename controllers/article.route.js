const express = require('express');
const fs = require('fs');
const PDF = require('handlebars-pdf')
const auth = require('../middlewares/auth.mdw')

const articleModel = require('../models/article.model');
const tagsModel = require('../models/tag.model');
const commentsModel = require('../models/comment.model');
const commentModel = require('../models/comment.model');
const userModel = require('../models/user.model')

const moment = require('moment');
moment.locale("vi")
const router = express.Router();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get('/:id', async function(req, res) {
    req.session.retUrl = req.originalUrl;
    //Article
    const article = await articleModel.detail(req.params.id);
    if (article.Premium === 1){

    }
    article.DateOfPublish = capitalizeFirstLetter(moment(article.DateOfPublish).format('LLLL'));
    const auth = req.session.auth
    if (article === null || article.State !== 0) {
        res.redirect('/404')
        return
    }
    res.locals.isPremium = null
    if (auth) {
        res.locals.isPremium = await userModel.isPremium(req.session.authUser.UserID)
    }
    //tags
    const tags = await tagsModel.findTagsByArticle(req.params.id)
        //comment
    comments = await commentModel.findCommentsByArticle(req.params.id)
    comments.forEach(element => {
        element.Date = capitalizeFirstLetter(moment(element.Date).format('LLLL'))
        element.MyComment = false
        if (req.session.auth === true) {
            element.MyComment = (element.UserID === req.session.authUser.UserID)
        }
    });
    const query = await articleModel.relatedArticle(req.params.id, article.BranchID, moment())
    const relatedArticle = query[0]
    relatedArticle.forEach(el => {
        el.Time = moment(el.DateOfPublish).fromNow();
    });
    res.render('../views/vwArticle/detail.hbs', {
        article,
        tags,
        comments,
        relatedArticle,
    })
    await articleModel.increaseView(article.ArtID, article.Views + 1)
});

router.get('/content/:id', auth, async function(req, res) {
    var article = await articleModel.detail(req.params.id);
    if (res.locals.isWriter && req.session.authUser.UserID===article.UserID){
        article.DateOfPublish = capitalizeFirstLetter(moment(article.DateOfPublish).format('LLLL'));
        res.render('../views/vwArticle/content.hbs', { article });
        return;
    }
    res.redirect('/404');
})

router.get('/download/:id', auth, async function(req, res) {
    //Kiem tra Premium
    const isPremium = await userModel.isPremium(req.session.authUser.UserID)
    if (!isPremium) {
        res.redirect('/404');
        return;
    }
    //Kiem tra bai viet ton tai
    const article = await articleModel.detail(req.params.id);
    if (article === null) {
        res.redirect('/404')
        return
    };
    const document = {
        template: '<h2>{{article.Title}}</h2>' +
            '<img style="width:100%; height:auto" src="' + req.protocol + '://' + req.get('host') + '/{{article.ImageLink}}" alt="">' +
            '{{{article.Content}}}' +
            '<h4 style="text-align: left">{{article.PenName}}</h4>',
        context: {
            article
        },
        path: "./local/pdf/" + article.Title + ".pdf",
    }
    try {
        if (fs.existsSync(document.path)) {
            res.download(document.path)
            return
        }
    } catch (error) {
        console.error(error)
    }
    PDF.create(document)
        .then(result => {
            res.download(result.filename)
        })
        .catch(error => {
            console.error(error)
        })
})

router.get('/test/:id', async function(req, res) {
    await userModel.extendPremium(req.params.id);
})

module.exports = router;