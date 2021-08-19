const branchModel = require('../models/branch.model');
const categoryModel = require('../models/category.model');

function groupCat(data) {
    list = []
    data.forEach(element => {
        found = list.some(el => el.CatID === element.CatID)
        if (!found) {
            list.push({
                CatID: element.CatID,
                CatName: element.CatName,
                CatLink: element.CatLink,
                branchList: [],
            })
        }
        branchList = list.find((o, i) => {
            if (o.CatID === element.CatID) {
                list[i].branchList.push({
                    BranchID: element.BranchID,
                    CatID: element.CatID,
                    BranchName: element.BranchName,
                    BranchLink: element.BranchLink,
                })
            }
        });
    });

    for (let i = 0; i < list.length; i++) {
        list[i].isEmpty = list[i].branchList.length === 0;
    }

    return list
}

module.exports = function(app) {
    app.use(function(req, res, next) {
        if (typeof(req.session.auth) === 'undefined') {
            req.session.auth = false;
        }
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser;
        res.locals.isWriter = req.session.isWriter;
        res.locals.isEditor = req.session.isEditor;
        res.locals.isAdmin = req.session.isAdmin;
        next();
    })

    // Name Categories and Branches
    app.use(async function(req, res, next) {
        const rows = await branchModel.withCategory();
        const data = Object.values(JSON.parse(JSON.stringify(rows)));
        const list = groupCat(data)
        res.locals.lcCategories = list;
        next()
    })
}