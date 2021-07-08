const branchModel = require('../models/branch.model');
const categoryModel = require('../models/category.model');

module.exports = function(app) {

    app.use(function(req, res, next) {
        if (typeof(req.session.auth) === 'undefined') {
            req.session.auth = false;
        }

        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser;
        next();
    })

    app.use(async function(req, res, next) {
        const list = await categoryModel.all();
        console.log(list.length);
        for(let i = 0; i < list.length; i++) {
            const branchList = await branchModel.findAllByCatId(list[i].CatID);
            list[i].branchList = branchList;
        }
        res.locals.lcCategories = list;
        next();
    })
}