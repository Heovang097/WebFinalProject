const express = require("express");
const categoriesModel = require("../models/category.model");
const router = express.Router();

router.get('/index/', async function(req,res) {
    const categoryList = await categoriesModel.all();
    const articleList = await articleModel.all();
    console.log(list);
    res.render("home",{
        categories: list,
        empty: list.length === 0,
    })
})

// router.post('/add/', async function(req, res) {
//     const category = {
//         CatName: req.body.txtCatName
//     }
//     await categoriesModel.add(category);
//     const list = await categoriesModel.all();
//     res.render("common",{
//         categories: list,
//         empty: list.length === 0,
//     });
// })

module.exports = router;

//common js
//es modules <=> import/export