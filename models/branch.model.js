const db = require('../utils/db');

module.exports = {
    all() {
        return db('branches');
    },

    findById(id) {
        return db('branches').where('BranchID', id);
    },

    findBranchByLink(link) {
        return db('branches').where('BranchLink', link);
    },

    add(article) {
        return db('branches').insert(article);
    },

    async findAllByCatId(id) {
        const rows = await db('branches').where('CatID', id);
        if (rows.length === 0)
            return null;
        return rows;
    },

    withCategory(id) {
        return db('branches').join('categories', 'branches.CatID', 'categories.CatID');
    }
};