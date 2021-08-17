const express = require("express");
const router = express.Router();
const moment = require('moment');
const articleModel = require("../../models/article.model");
const Config = require("../../utils/config");

const setStatus = function(article) {
    switch (article.State) {
        case Config.ARTICLE_STATE.APPROVED:
            article.Status = "Đã duyệt";
            break;
        case Config.ARTICLE_STATE.DENIED:
            article.Status = "Đã từ chối";
            break;
        case Config.ARTICLE_STATE.PENDING:
            article.Status = "Đang chờ duyệt";
            break;
        case Config.ARTICLE_STATE.PUBLISHED:
            article.Status = "Đã xuất bản";
            break;
    }
} 

router.use(async function (req, res, next) {
    const adminManagement = res.locals.adminManagement;
    adminManagement.forEach(element => {
        if (element.link == "articles")
            element.isActive = true;
        else
            element.isActive = false;
    });
    next();
})

router.get("/", async function(req, res) {
    const articleList = await articleModel.allWithBranchName()
    articleList.forEach(article => {
        setStatus(article);
    });
    res.render("vwAdmin/articles/articles.hbs", {
        layout: "admin.hbs",
        articleList: articleList,
        empty: articleList.length == 0,
    })
});

router.get("/:ArtID", async function(req, res) {
    const article = await articleModel.detail(req.params.ArtID);
    if (article == null)
        res.redirect("../");
    const hasDateOfPublish = article.State == Config.ARTICLE_STATE.APPROVED || article.State == Config.ARTICLE_STATE.PUBLISHED;
    article.DateOfPublish = moment(article.DateOfPublish, 'YYYY-MM-DD').format('DD/MM/YYYY');
    setStatus(article);
    res.render("vwAdmin/articles/detail.hbs", {
    layout: "admin.hbs",
    hasDateOfPublish,
    isPublished: article.State == Config.ARTICLE_STATE.PUBLISHED,
    article
    })
});

router.get("/:ArtID/del", async function(req, res) {
    const article = await articleModel.del(req.params.ArtID);
    res.redirect('../');
});

router.get("/:ArtID/publish", async function(req, res) {
    const article = await articleModel.detail(req.params.ArtID);
    if (article == null)
        res.redirect("../");
    if (article.DateOfPublish == null)
        article.DateOfPublish = "";
    else
        article.DateOfPublish = moment(article.DateOfPublish, 'YYYY-MM-DD').format('DD/MM/YYYY');
    setStatus(article);
    res.render("vwAdmin/articles/publish.hbs", {
    layout: "admin.hbs",
    article
    });
});

router.post('/:ArtID/publish', async function (req, res) {
    const dateOfPublish = moment(req.body.DateOfPublish, 'DD/MM/YYYY hh:mm').format('YYYY-MM-DD hh:mm:ss');
    await articleModel.approve(req.params.ArtID, dateOfPublish);
    
    var listTags = req.body.tags.split(',')
    var tags = []
    listTags.forEach(element => {
        var obj = {}
        obj['ArticleID'] = req.params.ArtID
        obj['TagName'] = element
        tags.push(obj)
    })
    await tagModel.insert(tags)
})

router.post('/:ArtID/publishInstantly', async function (req, res) {
    const dateOfPublish = moment(Date.now()).toDate().format('YYYY-MM-DD hh:mm:ss');
    await articleModel.publishInstantly(req.params.ArtID, dateOfPublish);

    var listTags = req.body.tags.split(',')
    var tags = []
    listTags.forEach(element => {
        var obj = {}
        obj['ArticleID'] = req.params.ArtID
        obj['TagName'] = element
        tags.push(obj)
    })
    await tagModel.insert(tags)
    res.redirect('../');
})
// ------------- END Thêm branch-------------

module.exports = router;