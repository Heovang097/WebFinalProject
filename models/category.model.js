const db = require("../utils/db.js");

module.exports = {
    all() {
        return db("categories");
    },
    async getArticlesByCat(catlink){
        console.log(catlink);
        const articleCat = await db('categories').where('CatLink', catlink);
        console.log('articleCat:', articleCat);
        if (articleCat.length === 0) return [];
        return db('articles').where('articleCat', articleCat[0].CatName);
    }
}