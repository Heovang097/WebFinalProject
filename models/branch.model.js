const db = require('../utils/db');

module.exports = {
    all() {
        return db('branches').join('categories', 'branches.CatID', 'categories.CatID').select('BranchID', 'CatName', 'BranchName');
    },
};