const express = require("express");
const router = express.Router();
const moment = require('moment');

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
    res.render("vwAdmin/articles/articles.hbs", {
        layout: "admin.hbs"
    })
});

module.exports = router;