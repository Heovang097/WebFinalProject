const db = require('../utils/db');

module.exports = {
    all() {
        return db('tags');
    },
    findTagsByArticle(id) {
        return db('tags').where('ArticleID', id);
    },
    insert(tags) {
        return db('tags').insert(tags);
    },
    name() {
        return db('tags').distinct('TagName').select('TagName')
    }
};