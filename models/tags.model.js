const db = require('../utils/db');

module.exports = {
    all() {
        return db('tags');
    },
    findTagsByArticle(id) {
        return db('tags').where('ArticleID', id);
    }
    insertTags(tags) {
        return db('tags').insert(tags);
    }
};