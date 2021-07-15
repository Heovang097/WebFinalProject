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
    findArticle(CommentID) {
        return db('comments').where('CommentID', CommentID).select('ArtID');
    },
    insert(comment) {
        return db('comments').insert(comment);
    },
    delete(UserID, CommentID) {
        return db('comments').where('UserID', UserID).where('CommentID', CommentID).delete()
    }
};