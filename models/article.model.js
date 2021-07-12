const db = require('../utils/db');
const { findAllByCatId } = require('./branch.model');

module.exports = {
    all() {
        return db('articles');
    },

    findById(id) {
        return db('articles').where('ArtID', id);
    },

    async detail(id) {
        const rows = await db('articles')
            .where('ArtID', id)
            .join('branches', 'articles.BranchID', 'branches.BranchID')
            .join('categories', 'branches.CatID', 'categories.CatID')
            .join('users', 'articles.UserID', 'users.UserID')
            .select('ArtID', 'Username', 'CatName', 'CatLink', 'BranchName', 'BranchLink', 'Title', 'DateOfPublish', 'ImageLink', 'Abstract', 'Content', 'Premium', 'State')
        if (rows.length === 0)
            return null
        return rows[0]
    },

    insert(article) {
        return db('articles').insert(article);
    },

    async findByBranchId(id) {
        const rows = await db('products').where('BranchID', id);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    patch(article) {
        const id = article.ArtID;
        delete article.ArtID;

        return db('articles')
            .where('ArtID', id)
            .update(article);
    },

    del(id) {
        return db('articles')
            .where('ArtID', id)
            .del();
    },
    mostViewArticles() {
        // return db('articles').orderBy('Views', 'desc');
        const sql = `SELECT *
FROM articles a, branches b, categories c
WHERE a.BranchID = b.BranchID AND b.CatID = c.CatID
ORDER BY Views DESC`;
        return db.raw(sql);
    },
    newestArticles() {
        // return db('articles').orderBy('DateOfPublish', 'desc');
        const sql = `SELECT *
FROM articles a, branches b, categories c
WHERE a.BranchID = b.BranchID AND b.CatID = c.CatID
ORDER BY DateOfPublish DESC`;
        return db.raw(sql);
    },
    newestArticleByCat() {
        const sql = `SELECT * 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE DateOfPublish = (
        SELECT MAX(DateOfPublish)
        from (articles a INNER JOIN branches b on a.BranchID = b.BranchID)
        INNER JOIN categories c on b.CatID = c.CatID
         WHERE c1.CatID = c.CatID)
            `;
        return db.raw(sql);
    },
    allByCatID(CatID) {
        const sql = `SELECT * 
from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
INNER JOIN categories c1 on b1.CatID = c1.CatID
WHERE c1.CatID = ${CatID}`;
        return db.raw(sql);
    },
    allByBranchID(BranchID) {
        const sql = `SELECT * 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE b1.BranchID = ${BranchID}`;
        return db.raw(sql);
    },
    count() {
        return db('articles').count('ArtID as count');
    }
};