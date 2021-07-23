const express = require('express');
const articleModel = require('../models/article.model');
const tagsModel = require('../models/tag.model');
const commentsModel = require('../models/comment.model');
const moment = require('moment');
moment.locale("vi")
const commentModel = require('../models/comment.model');

const router = express.Router();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get('/:id', async function(req, res) {
    req.session.retUrl = req.originalUrl
        //Article
    const article = await articleModel.detail(req.params.id)
    article.DateOfPublish = capitalizeFirstLetter(moment(article.DateOfPublish).format('LLLL'))
    if (article === null || article.State !== 0) {
        res.redirect('/404')
        return
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
    })
    res.render('../views/vwArticle/detail.hbs', {
        article,
        tags,
        comments,
        relatedArticle,
    })
    await articleModel.increaseView(article.ArtID, article.Views + 1)
});

module.exports = router;