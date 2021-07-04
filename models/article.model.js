const db = require("../utils/db.js");

module.exports = {
    all() {
        return db("articles");
    },
    mostViewArticles(){
        return db('articles').orderBy('view', 'desc');
    },
    newestArticles(){
        return db('articles').orderBy('date', 'desc');
    },
    newestArticleByCat(){
        const sql = `
                SELECT * 
                from articles
                WHERE date = (SELECT MAX(date) FROM articles a WHERE a.articleCat = articles.articleCat)
            `;
        return db.raw(sql);
    }
}