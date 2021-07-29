const express = require("express");
const router = express.Router();
const moment = require('moment');
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
    res.render("vwAdmin/tags/tags.hbs", {
        tagList: tagList,
        layout: "admin.hbs"
    })
});

module.exports = router;