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
    if (article === null) {
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
    const relatedArticle = await articleModel.relatedArticle(req.params.id, article.BranchID, moment())
    console.log(relatedArticle[0])
    console.log(moment())
    res.render('../views/vwArticle/detail.hbs', {
        article,
        tags,
        comments,
    })
    await articleModel.increaseView(article.ArtID, article.Views + 1)
});

router.post('/comment/add', function(req, res) {
    res.json("Hello world")
})

module.exports = router;