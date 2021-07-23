const express = require("express");
const articleModel = require("../models/article.model");
const moment = require('moment');
 

const router = express.Router();

router.get("/tags", async function(req, res) {
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
    console.log("Editor approve request: " + req.body);
    const dateOfPublish = moment(req.body.DateOfPublish, 'DD/MM/YYYY hh:mm').format('YYYY-MM-DD hh:mm:ss');
    const tag = req.body.Tag
    const articleID = req.params.id;
    await articleModel.approve(articleID, tag, dateOfPublish);
    res.redirect('../list');
})
module.exports = router