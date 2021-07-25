const express = require("express");
const articleModel = require("../models/article.model");
const moment = require('moment');
const categoryModel = require("../models/category.model");
 
const router = express.Router();

router.use("/categories", require("./admin/categories.route"));
router.use("/tags", require("./admin/tags.route.js"));
router.use("/articles", require("./admin/articles.route"));
router.use("/users", require("./admin/users.route"));
module.exports = router