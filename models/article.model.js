const db = require('../utils/db');
const { findAllByCatId } = require('./branch.model');
const Config = require('../utils/config');

module.exports = {
    all() {
        return db('articles');
    },

    findById(id) {
        return db('articles').where('ArtID', id);
    },

    relatedArticle(ArtID, BranchID) {
        const query = `select ArtID, Title, UserID, ImageLink, DateOfPublish, NOW(), Abstract, Views, Premium from articles
        where BranchID = ${BranchID} and ArtID != ${ArtID} and DateOfPublish <= NOW()
        order by rand()
        limit 5;`
        return db.raw(query)
    },

    async detail(id) {
        const rows = await db('articles')
            .where('ArtID', id)
            .join('branches', 'articles.BranchID', 'branches.BranchID')
            .join('categories', 'branches.CatID', 'categories.CatID')
            .join('users', 'articles.UserID', 'users.UserID')
            .select('ArtID', 'PenName', 'CatName', 'CatLink', 'articles.BranchID', 'BranchName', 'BranchLink', 'Title', 'DateOfPublish', 'ImageLink', 'Content', 'Premium', 'State', 'Views')
        if (rows.length === 0)
            return null
        return rows[0]
    },

    insert(article) {
        return db('articles').insert(article);
    },

    increaseView(id, views) {
        return db('articles').where('ArtID', id).update('Views', views)
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
    maxID() {
        return db('articles').max('ArtID as maxID');
    },
    async allByEditorID(EditorID) {
        Config
        const sql = `SELECT * 
        FROM branch_user as bu, articles as a 
        WHERE a.BranchID = bu.BranchID AND bu.EditorID = ${EditorID} AND a.State = ${Config.ARTICLE_STATE.PENDING}`
        const rows = await db.raw(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    deny(id, reason) {
        return db('articles')
        .where('ArtID', id)
        .update({
            "State": Config.ARTICLE_STATE.DENIED,
            "Reason": reason,
        });
    },
    approve(id, tag, dateOfPublish) {
        return db('articles')
        .where('ArtID', id)
        .update({
            "State": Config.ARTICLE_STATE.APPROVED,
            'Tag': tag,
            "DateOfPublish": dateOfPublish
        });
    }
};