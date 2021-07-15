const db = require('../utils/db');

module.exports = {
    all() {
        return db('comments');
    },
    findCommentsByArticle(id) {
        return db('comments').where('ArtID', id)
            .join('users', 'comments.UserID', 'users.UserID')
            .select('avatar', 'Name', 'comments.UserID', 'CommentID', 'Content', 'Date');
    },
    insert(comment) {
        return db('comments').insert(comment);
    },
};