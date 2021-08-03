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

    add(branch) {
        return db('branches').insert(branch);
    },

    patch(branch) {
        const id = branch.BranchID;
        delete branch.BranchID;

        return db('branches')
            .where('BranchID', id)
            .update(branch);
    },

    del(BranchID) {
        return db('branches')
            .where('BranchID', BranchID)
            .del();
    },

    async findByBranchName(branchName) {
        const rows = await db('branches').where('BranchName', branchName);
        if (rows.length === 0)
            return null;
        return rows[0];
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