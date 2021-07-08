const branchModel = require('../models/branch.model');

function groupBy(key, array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var added = false;
        for (var j = 0; j < result.length; j++) {
            if (result[j][key] == array[i][key]) {
                result[j].items.push(array[i]);
                added = true;
                break;
            }
        }
        if (!added) {
            var entry = { items: [] };
            entry[key] = array[i][key];
            entry.items.push(array[i]);
            result.push(entry);
        }
    }
    return result;
}

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
        const rows = await branchModel.all();
        data = Object.values(JSON.parse(JSON.stringify(rows)));
        dict = data.reduce((p, c) => (p[c.CatName] ? p[c.CatName].push(c) : p[c.CatName] = [c], p), {});
        res.locals.category = Object.keys(dict).map(k => ({ CatName: k, branch: dict[k] }));
        next()
    })
}