const express = require("express");
const articleModel = require("../models/article.model");
const router = express.Router();

router.get("/articles", function(req,res) {
    
    res.render("");
});