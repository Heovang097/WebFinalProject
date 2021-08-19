const express = require("express");
const articleModel = require("../models/article.model");
const moment = require('moment');
const tagModel = require("../models/tag.model");

const router = express.Router();

// ==== Check editor auth ====
router.use(async function (req, res, next) {
    // console.log("Admin check");
    if (req.session.auth == true && req.session.isEditor == true)
        next();
    else 
    {
        console.log("Error: Editor unauthorized");
        res.redirect("/404");
    }
    // next();
})

router.get("/list", async function(req, res) {
    const articleList = await articleModel.allByEditorID(req.session.authUser.UserID);
    // console.log(`====== Article List by Editor ID: ${req.session.authUser.UserID} ======`);
    console.log(articleList);
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
    const articleID = req.params.id;
    const branchID = req.body.BranchID;
    await articleModel.approve(articleID, branchID, dateOfPublish);
    
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
    res.redirect('../list');
})
module.exports = router