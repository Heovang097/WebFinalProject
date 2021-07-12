const express = require('express');
const articleModel = require('../models/article.model');
const moment = require('moment');

const router = express.Router();

router.get('/:id', async function(req, res) {
    const article = await articleModel.detail(req.params.id)
    console.log(article)
    if (article === null) {
        res.redirect('/404')
        return
    }
    res.render('../views/vwArticle/detail.hbs', {
        article,
    })
});

module.exports = router;