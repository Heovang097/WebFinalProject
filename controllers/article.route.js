const express = require('express');
const articleModel = require('../models/article.model');

const router = express.Router();

router.get('/:cat/:branch/:id', async function(req, res) {
    const artID = req.params.id || 0;

    for (c of res.locals.lcCategories) {
        if (c.CatID === catId) {
            c.IsActive = true;
            break;
        }
    }

    const list = await productModel.findByCatID(catId);
    res.render('vwArticles/byCat', {
        products: list,
        empty: list.length === 0
    });
});

module.exports = router;