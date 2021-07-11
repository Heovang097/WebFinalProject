const branchModel = require('../models/branch.model');
const categoryModel = require('../models/category.model');

module.exports = function(app) {

    app.use(function(req, res, next) {
        if (typeof(req.session.auth) === 'undefined') {
            req.session.auth = false;
        }
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser;
        res.locals.writer = req.session.writer;
        next();
    })

    // Name Categories and Branches
    app.use(async function(req, res, next) {
        const list = await categoryModel.all();
        console.log(list.length);
        for (let i = 0; i < list.length; i++) {
            const branchList = await branchModel.findAllByCatId(list[i].CatID);
            list[i].branchList = branchList;
        }
        res.locals.lcCategories = list;

        const rows = await branchModel.withCategory();
        data = Object.values(JSON.parse(JSON.stringify(rows)));
        dict = data.reduce((p, c) => (p[c.CatName] ? p[c.CatName].push(c) : p[c.CatName] = [c], p), {});
        res.locals.category = Object.keys(dict).map(k => ({ CatName: k, branch: dict[k] }));
        next()
    })
}