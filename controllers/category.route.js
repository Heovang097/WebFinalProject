const express = require("express");
const categoriesModel = require("../models/category.model");
const userModel = require("../models/user.model");
const router = express.Router();

router.get('/user', async function(req,res) {
    const categoryList = await categoriesModel.all();
    const userID = req.query.id;
    const userInfo = await userModel.get(userID);
    console.log(userInfo);
    res.render("user",{
        categories: categoryList,
        empty: categoryList.length === 0
    })
})

router.get('/index', async function(req,res) {
    const categoryList = await categoriesModel.all();
    res.render("user",{
        categories: categoryList,
        empty: categoryList.length === 0
    })
})

router.post('/user', async function(req, res) {
    const userInfo = {
        userName: req.body.userName,
        penName: req.body.penName,
        emailAddress: req.body.emailAddress,
        dob: req.body.dob,
        password: req.body.password
    }
    await userModel.add(userInfo);
    const list = await categoriesModel.all();
    res.render("home",{
        categories: list,
        empty: list.length === 0,
    });
})

module.exports = router;

//common js
//es modules <=> import/export