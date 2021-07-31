const express = require("express");
const articleModel = require("../models/article.model");
const moment = require('moment');
const categoryModel = require("../models/category.model");
const { newestArticleByCat } = require("../models/article.model");
 
const router = express.Router();

// ==== Check admin auth ====
router.use(async function (req, res, next) {
    // console.log("Admin check");
    // if (req.session.auth == true && req.session.isAdmin == true)
    //     next();
    // else 
    // {
    //     console.log("Error: Admin unauthorized");
    //     res.redirect("/404");
    // }
    next();
})

// ====== Get admin management type ======
router.use(async function (req, res, next) {
    res.locals.adminManagement = [
        {
            isActive: false,
            name: "Quản lý chuyên mục",
            link: 'categories'
        },
        {
            isActive: false,
            name: "Quản lý nhãn",
            link: 'tags'
        },
        {
            isActive: false,
            name: "Quản lý bài viết",
            link: 'articles'
        },
        {
            isActive: false,
            name: "Quản lý người dùng",
            link: 'users'
        },
    ];
    next();
})

router.use("/categories", require("./admin/categories.route"));
router.use("/tags", require("./admin/tags.route.js"));
router.use("/articles", require("./admin/articles.route"));
router.use("/users", require("./admin/users.route"));
module.exports = router