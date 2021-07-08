const db = require('../utils/db');

module.exports = {
    all() {
        return db('branches');
    },

    findById(id) {
        return db('branches').where('BranchID', id);
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
};