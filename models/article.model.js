const db = require('../utils/db');

module.exports = {
    all() {
        return db('articles');
    },

    findById(id) {
        return db('articles').where('ArtID', id);
    },

    add(article) {
        return db('products').insert(article);
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
    mostViewArticles(){
        return db('articles').orderBy('Views', 'desc');
    },
    newestArticles(){
        return db('articles').orderBy('DateOfPublish', 'desc');
    },
    newestArticleByCat(){
        const sql = `
                SELECT * 
                from articles
                WHERE DateOfPublish = (SELECT MAX(DateOfPublish) FROM articles a WHERE a.ArtID = articles.artID)
            `;
        return db.raw(sql);
    }
};