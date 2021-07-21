const express = require("express");
const articleModel = require("../models/article.model");
 

const router = express.Router();

router.get("/list", async function(req, res) {
    const articleList = await articleModel.allByEditorID(req.session.authUser.UserID);
    // console.log(`====== Article List by Editor ID: ${req.session.authUser.UserID} ======`);
    // console.log(articleList);
    // console.log(`================================`);
    res.render("vwEditor/list", {
        articleList: articleList,
        categories: res.locals.lcCategories,
    })
});

router.post("/deny/:id", async function(req, res) {
    const articleID = req.params.id;
    const reason = req.body.Reason;
    await articleModel.deny(articleID, reason);
    res.redirect('../list');
})

router.post("/approve/:id", async function(req, res) {
    const articleID = req.params.id;
    await articleModel.approve(articleID);
    res.redirect('../list');
})
module.exports = router