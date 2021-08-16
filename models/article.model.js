const db = require('../utils/db');
const { findAllByCatId } = require('./branch.model');
const Config = require('../utils/config');
const { default: knex } = require('knex');

const groupArticleByState = function(articlesList) {
    const approved = [];
    const denied = [];
    const pending = [];
    const published = [];
    for (let i = 0; i < articlesList.length; i++) {
        switch (articlesList[i].State) {
            case Config.ARTICLE_STATE.APPROVED:
                approved.push(articlesList[i]);
                break;
            case Config.ARTICLE_STATE.DENIED:
                denied.push(articlesList[i]);
                break;
            case Config.ARTICLE_STATE.PENDING:
                pending.push(articlesList[i]);
                break;
            case Config.ARTICLE_STATE.PUBLISHED:
                published.push(articlesList[i]);
                break;
        }
    }
    return {
        approved: {
            list: approved,
            empty: approved.length === 0,
        },
        denied: {
            list: denied,
            empty: denied.length === 0,
        },
        pending: {
            list: pending,
            empty: pending.length === 0,
        },
        published: {
            list: published,
            empty: published.length === 0,
        },
    }

}

module.exports = {
    all() {
        return db('articles');
    },

    findById(id) {
        return db('articles').where('ArtID', id);
    },

    // Update State
    updateState() {
        const query = `Update articles
        SET State = 0
        where DateOfPublish <= NOW()`
        return db.raw(query)
    },

    updateLastWeekViews(){
        const query = `Update articles
        Set LastWeekViews = Views`
        return db.raw(query);
    },

    findByUserID(UserID){
        return db('articles').where('UserID', UserID).select('Title', 'ImageLink', 'Abstract', 'Views', 'State', 'DateOfPublish', 'Reason', 'ArtID');    
    },

    // Bai viet lien quan
    relatedArticle(ArtID, BranchID) {
        const query = `select ArtID, Title, ImageLink, DateOfPublish from articles
        where BranchID = ${BranchID} and ArtID != ${ArtID} and State = 0
        order by rand()
        limit 5;`
        return db.raw(query)
    },

    // Chi tiet bai viet
    async detail(id) {
        const rows = await db('articles')
            .where('ArtID', id)
            .join('branches', 'articles.BranchID', 'branches.BranchID')
            .join('categories', 'branches.CatID', 'categories.CatID')
            .join('users', 'articles.UserID', 'users.UserID')
            .select('ArtID', 'articles.UserID', 'PenName', 'CatName', 'CatLink', 'articles.BranchID', 'BranchName', 'BranchLink', 'Title', 'Abstract',
                'DateOfPublish', 'ImageLink', 'Content', 'Premium', 'State', 'Views')
        if (rows.length === 0)
            return null
        return rows[0]
    },

    // Them bai viet
    insert(article) {
        return db('articles').insert(article);
    },

    // Dem view
    increaseView(id, views) {
        return db('articles').where('ArtID', id).update('Views', views)
    },

    // update bai viet
    patch(article) {
        const id = article.ArtID;
        delete article.ArtID;
        return db('articles')
            .where('ArtID', id)
            .update(article);
    },

    //Xoa bai viet
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
    mostViewPublishedArticles() {
        // return db('articles').orderBy('Views', 'desc');
        const sql = `SELECT *
FROM articles a, branches b, categories c
WHERE a.BranchID = b.BranchID AND b.CatID = c.CatID AND a.State = 0
ORDER BY Views DESC
limit 10`;
        return db.raw(sql);
    },
    newestArticles() {
        // return db('articles').orderBy('DateOfPublish', 'desc');
        const sql = `SELECT *
FROM articles a, branches b, categories c
WHERE a.BranchID = b.BranchID AND b.CatID = c.CatID
ORDER BY DateOfPublish DESC
limit 10`;
        return db.raw(sql);
    },
    newestPublishedArticles() {
        // return db('articles').orderBy('DateOfPublish', 'desc');
        const sql = `SELECT *
FROM articles a, branches b, categories c
WHERE a.BranchID = b.BranchID AND b.CatID = c.CatID and a.State = 0
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
        newestPublishedArticleByCat() {
        const sql = `SELECT * 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE a1.State = 0 AND DateOfPublish = (
        SELECT MAX(DateOfPublish)
        from (articles a INNER JOIN branches b on a.BranchID = b.BranchID)
        INNER JOIN categories c on b.CatID = c.CatID
         WHERE c1.CatID = c.CatID AND a.State = 0)
         limit 10
            `;
        return db.raw(sql);
    },
        publishedByCatID(CatID, offset) {
        const sql = `SELECT * 
from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
INNER JOIN categories c1 on b1.CatID = c1.CatID
WHERE c1.CatID = ${CatID} AND a1.State = 0
ORDER BY Premium DESC
limit 6 offset ${offset}`;
        return db.raw(sql);
    },
        publishedByBranchID(BranchID, offset) {
        const sql = `SELECT * 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE a1.State = 0 AND b1.BranchID = ${BranchID} 
        ORDER BY Premium DESC
        limit 6 offset ${offset}`;
        return db.raw(sql);
    },
        async countByPublishedCatID(CatID){
        const sql = `SELECT COUNT(*) as count 
from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
INNER JOIN categories c1 on b1.CatID = c1.CatID
WHERE a1.State = 0 AND c1.CatID = ${CatID}`;

        const rows = await db.raw(sql);
        return rows[0][0].count;
    }, 
        async countByPublishedBranchID(BranchID) {
        const sql = `SELECT COUNT(*) as count 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE a1.State = 0 AND b1.BranchID = ${BranchID}`;
        const rows = await db.raw(sql);
        return rows[0][0].count;

    },
        async publishedByTag(tag){
        const sql = `SELECT * 
FROM tags, articles
WHERE tags.ArticleID = articles.ArtID AND articles.State = 0 AND tags.TagName = '${tag}'`;
        const rows = await db.raw(sql);
        return rows[0];
    },
        async countByPublishedTag(tag){
        // const rows = await db('tags').where('TagName', tag);
        const sql = `SELECT COUNT(*) as count
FROM tags, articles
WHERE tags.ArticleID = articles.ArtID AND articles.State = 0 AND tags.TagName = '${tag}'`;
        const rows = await db.raw(sql);
        return rows[0][0].count;
    },
    allByCatID(CatID) {
        const sql = `SELECT * 
from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
INNER JOIN categories c1 on b1.CatID = c1.CatID
WHERE c1.CatID = ${CatID}`;
        return db.raw(sql);
    },
    allByCatID(CatID, offset) {
        const sql = `SELECT * 
from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
INNER JOIN categories c1 on b1.CatID = c1.CatID
WHERE c1.CatID = ${CatID} limit 6 offset ${offset}`;
        return db.raw(sql);
    },
    allByBranchID(BranchID) {
        const sql = `SELECT * 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE b1.BranchID = ${BranchID}`;
        return db.raw(sql);
    },
    allByBranchID(BranchID, offset) {
        const sql = `SELECT * 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE b1.BranchID = ${BranchID} limit 6 offset ${offset}`;
        return db.raw(sql);
    },

    async countByCatID(CatID) {
        const sql = `SELECT COUNT(*) as count 
from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
INNER JOIN categories c1 on b1.CatID = c1.CatID
WHERE c1.CatID = ${CatID}`;

        const rows = await db.raw(sql);
        return rows[0][0].count;
    },
    async countByBranchID(BranchID) {
        const sql = `SELECT COUNT(*) as count 
        from (articles a1 INNER JOIN branches b1 on a1.BranchID = b1.BranchID)
        INNER JOIN categories c1 on b1.CatID = c1.CatID
        WHERE b1.BranchID = ${BranchID}`;
        const rows = await db.raw(sql);
        return rows[0][0].count;

    },


    maxID() {
        return db('articles').max('ArtID as maxID');
    },
    async allByEditorID(EditorID) {
        Config
        const sql = `SELECT * 
        FROM branch_user as bu, articles as a LEFT JOIN tags t on a.ArtID = t.ArticleID
        WHERE a.BranchID = bu.BranchID AND bu.EditorID = ${EditorID} AND t.ArticleID = a.ArtID`
        const rows = await db.raw(sql);
        if (rows[0].length === 0)
            return null;
        const articlesList = rows[0];
        return groupArticleByState(articlesList);
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
        db('articles').insert({
            "ArticleID": id,
            "TagName": tag,
        });
        return db('articles')
            .where('ArtID', id)
            .update({
                "State": Config.ARTICLE_STATE.APPROVED,
                "DateOfPublish": dateOfPublish
            });
    },
    async allByTag(tag) {
        const sql = `SELECT * 
FROM tags, articles
WHERE tags.ArticleID = articles.ArtID AND tags.TagName = '${tag}'`;
        const rows = await db.raw(sql);
        return rows[0];
    },
    async countByTag(tag) {
        const rows = await db('tags').where('TagName', tag);
        return rows.length;
    },
    async searchByTitle(title){
        const sql = `SELECT *
        FROM articles
        WHERE MATCH(Title) AGAINST('${title}')`
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByTitleOffset(title, offset){
        const sql = `SELECT *
        FROM articles
        WHERE MATCH(Title) AGAINST('${title}') limit 6 offset ${offset}`;
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByAbstract(title){
        const sql = `SELECT *
        FROM articles
        WHERE MATCH(Abstract) AGAINST('${title}') `
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByContent(title){
        const sql = `SELECT *
        FROM articles
        WHERE MATCH(Content) AGAINST('${title}') `
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByAbstractOffset(title, offset){
        const sql = `SELECT *
        FROM articles
        WHERE MATCH(Abstract) AGAINST('${title}') limit 6 offset ${offset}`
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByContentOffset(title, offset){
        const sql = `SELECT *
        FROM articles
        WHERE MATCH(Content) AGAINST('${title}') limit 6 offset ${offset}`
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByContentOffsetPremium(title, offset){
        const sql = `SELECT *, MATCH(Content) AGAINST('${title}') as score
        FROM articles
        WHERE MATCH(Content) AGAINST('${title}') 
        ORDER BY Premium DESC, score DESC
        limit 6 offset ${offset}`
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByTitleOffsetPremium(title, offset){
        const sql = `SELECT *, MATCH(Title) AGAINST('${title}') as score
        FROM articles
        WHERE MATCH(Title) AGAINST('${title}') 
        ORDER BY Premium DESC, score DESC
        limit 6 offset ${offset}`
        const rows = await db.raw(sql);
        return rows[0];
    },
    async searchByAbstractOffsetPremium(title, offset){
        const sql = `SELECT *, MATCH(Abstract) AGAINST('${title}') as score
        FROM articles
        WHERE MATCH(Abstract) AGAINST('${title}') 
        ORDER BY Premium DESC, score DESC
        limit 6 offset ${offset}`
        const rows = await db.raw(sql);
        return rows[0];
    },
};