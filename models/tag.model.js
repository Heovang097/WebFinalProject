const db = require('../utils/db');

module.exports = {
    async all() {
        const query = "SELECT tags.*, articles.Title from tags, articles where tags.ArticleID = articles.ArtID"
        const rows = await db.raw(query);
        if (rows[0].length == 0)
            return null;
        return rows[0];
    },
    findTagsByArticle(id) {
        return db('tags').where('ArticleID', id).select('TagName');
    },
    insert(tags) {
        return db('tags').insert(tags);
    },
    delete(ArtID){
        return db('tags').where('ArticleID', ArtID).delete();
    },
    deleteTagName(TagName){
        return db('tags').where('TagName', TagName).delete();
    },
    name() {
        return db('tags').distinct('TagName').select('TagName')
    },
    patch(oldTagName, newTagName) {
        return db('tags')
        .where("TagName", oldTagName)
        .update("TagName", newTagName);
    }
};