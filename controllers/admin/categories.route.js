const express = require("express");
const router = express.Router();
const moment = require('moment');
const branchModel = require("../../models/branch.model");
const categoryModel = require("../../models/category.model");
const StringUtils = require("../../utils/string.js");

router.use(async function (req, res, next) {
    const adminManagement = res.locals.adminManagement;
    adminManagement.forEach(element => {
        if (element.link == "categories")
            element.isActive = true;
        else
            element.isActive = false;
    });
    next();
})

router.get("/", async function (req, res) {
    res.render("vwAdmin/categories/categories", {
        layout: "admin.hbs"
    })
});

// ------------- BEGIN Thêm branch -------------
router.get('/:CatID/add', function (req, res) {
    const id = req.params.CatID; // CatID request
    const CatName = res.locals.lcCategories.find(element => element.CatID == id).CatName;
    res.render("vwAdmin/categories/branches/add", {
        CatID: id,
        CatName: CatName,
    });
})

router.post('/:CatID/add', async function (req, res) {
    const new_branch = {
        CatID: req.params.CatID,
        BranchName: req.body.BranchName,
        BranchLink: StringUtils.generateLinkFromName(req.body.BranchName),
    };

    // const rs = await categoryModel.add(new_category);
    // console.log(rs);
    await branchModel.add(new_branch);
    res.redirect('../');
})
// ------------- END Thêm branch-------------

router.get('/is-branch-available', async function (req, res) {
    const branchName = req.query.branchName;
    const branch = await branchModel.findByBranchName(branchName);
    if (branch === null) {
        return res.json(true);
    }
    res.json(false);
})
// ------------- BEGIN Chỉnh sửa branch-------------
router.get('/:CatID/edit/:BranchID', async function (req, res) {
    const CatID = req.params.CatID;
    const category = res.locals.lcCategories.find(element => element.CatID == CatID);
    const BranchID = req.params.BranchID;

    const branch = category.branchList.find(element => element.BranchID == BranchID);
    if (branch === null) {
        return res.redirect('/admin/categories');
    }

    res.render('vwAdmin/categories/branches/edit', {
        category: category,
        branch: branch
    });
});

// Chỉnh sửa
router.post('/:CatID/edit/:BranchID/patch', async function (req, res) {
    const branch = {
        BranchID: req.params.BranchID,
        BranchName: req.body.BranchName,
        BranchLink: StringUtils.generateLinkFromName(req.body.BranchName),
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

// ------------- BEGIN Thêm Category -------------
router.get("/add", function (req, res) {
    res.render("vwAdmin/categories/add");
})


router.post('/add', async function (req, res) {
    const new_category = {
        CatID: req.params.CatID,
        CatName: req.body.CatName,
        CatLink: StringUtils.generateLinkFromName(req.body.CatName),
    };

    console.log(new_category);
    await categoryModel.add(new_category);
    res.redirect('/admin/categories');
})
// ------------- END Thêm Category -------------

router.get('/is-category-available', async function (req, res) {
    const CatName = req.query.CatName;
    const category = res.locals.lcCategories.find(element => element.CatName === CatName);
    if (category == null) {
        return res.json(true);
    }
    res.json(false);
})

// ------------- BEGIN Chỉnh sửa Category-------------
router.get('/edit/:CatID', async function (req, res) {
    const CatID = req.params.CatID;
    const category = res.locals.lcCategories.find(element => element.CatID == CatID);

    res.render('vwAdmin/categories/edit', {
        category: category
    });
});

// Chỉnh sửa
router.post('/edit/:CatID/patch', async function (req, res) {
    const category = {
        CatID: req.params.CatID,
        CatName: req.body.CatName,
        CatLink: StringUtils.generateLinkFromName(req.body.CatName),
    }
    await categoryModel.patch(category);
    res.redirect('/admin/categories');
})

// Xóa
router.post('/edit/:CatID/del', async function (req, res) {
    await categoryModel.del(req.params.CatID);
    res.redirect('/admin/categories');
})
// ------------- END Chỉnh sửa branch-------------

module.exports = router;