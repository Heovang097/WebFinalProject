const express = require("express");
const router = express.Router();
const moment = require('moment');
const branchModel = require("../../models/branch.model");
const StringUtils = require("../../utils/string.js");

router.get("/", async function (req, res) {
    res.render("vwAdmin/categories/categories", {
        layout: "admin.hbs"
    })
});

// ------------- BEGIN Thêm branch -------------
router.get('/:CatID/add', function (req, res) {
    const id = req.params.CatID; // CatID request
    const CatName = res.locals.lcCategories.find(element => element.CatID == id).CatName;
    res.render("vwAdmin/categories/add",{
        CatID: id,
        CatName: CatName,
    });
})

router.post('/:CatID/add', async function (req, res) {
    let BranchLink = StringUtils.nonAccentVietnamese(req.body.BranchName);
    BranchLink = BranchLink.replace(/ /g,'-');
    const new_branch = {
        CatID: req.params.CatID,
        BranchName: req.body.BranchName,
        BranchLink: BranchLink,
    };

    // const rs = await categoryModel.add(new_category);
    // console.log(rs);
    await branchModel.add(new_branch);
    res.redirect('../');
})
// ------------- END Thêm branch-------------

router.get('/is-branch-available', async function(req, res) {
    const branchName = req.query.branchName;
    const user = await branchModel.findByBranchName(branchName);
    if (user === null) {
        return res.json(true);
    }
    res.json(false);
})
// ------------- END Chỉnh sửa branch-------------
router.get('/:CatID/edit/:BranchID', async function (req, res) {
    const CatID =  req.params.CatID;
    const category = res.locals.lcCategories.find(element => element.CatID == CatID);
    const BranchID = req.params.BranchID;
    
    const branch = category.branchList.find(element => element.BranchID == BranchID);
    if (branch === null) {
        return res.redirect('/admin/categories');
    }

    res.render('vwAdmin/categories/edit', {
        category: category,
        branch: branch
    });
});

// Chỉnh sửa
router.post('/:CatID/edit/:BranchID/patch', async function (req, res) {
    const branch = {
        BranchID: req.params.BranchID,
        BranchName: req.body.BranchName,
        BranchLink: StringUtils.nonAccentVietnamese(req.body.BranchName),
    }
    await branchModel.patch(branch);
    res.redirect('/admin/categories');
})

// Xóa
router.post('/:CatID/edit/:BranchID/del', async function (req, res) {
    await branchModel.del(req.params.BranchID);
    res.redirect('/admin/categories');
})
// ------------- END Chỉnh sửa branch-------------

module.exports = router;