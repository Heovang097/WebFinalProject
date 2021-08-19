const express = require("express");
const router = express.Router();
const moment = require('moment');
const articleModel = require("../../models/article.model");
const tagModel = require("../../models/tag.model");

router.use(async function (req, res, next) {
    const adminManagement = res.locals.adminManagement;
    adminManagement.forEach(element => {
        if (element.link == "tags")
            element.isActive = true;
        else
            element.isActive = false;
    });
    next();
})

router.get("/", async function(req, res) {
    const tagList = await tagModel.all(); 
    if (tagList == null)
        tagList = [];
    res.render("vwAdmin/tags/tags.hbs", {
        tagList: tagList,
        isEmpty: tagList.length == 0,
        layout: "admin.hbs"
    })
});

router.post('/save', async function (req, res) {
    const tagName = req.body.tagName;
    const oldTagName = req.body.tagName;
    await tagModel.patch(oldTagName, tagName);

    res.redirect('./');
})
// ------------- END Thêm branch-------------

router.post('/del', async function (req, res) {
    const tagName = req.body.TagName;
    
    await tagModel.deleteTagName(tagName);
    res.redirect('./');
})
// ------------- END Thêm branch-------------


router.get("/add", async function(req, res) {
    const articleList = await articleModel.allWithBranchName();
    res.render("vwAdmin/tags/add.hbs", {
        layout: "admin.hbs",
        articleList: articleList,
        empty: articleList.length == 0,
    })
});

router.post("/add", async function(req, res) {
    const articles = req.body.articles;
    if (articles == null)
        return res.redirect("../");
    const tags = [];
    articles.forEach(elementArtID => {
        const newTag = {};
        newTag.TagName = req.body.TagName;
        newTag.ArticleID = elementArtID;
        tags.push(newTag);
    });
    if (tags.length !== 0)
        await tagModel.insertMultiple(tags);
    return res.redirect("../");
});

module.exports = router;