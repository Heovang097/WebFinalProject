const db = require('../utils/db');

module.exports = {
    all() {
        return db('tags');
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
    name() {
        return db('tags').distinct('TagName').select('TagName')
    }
};