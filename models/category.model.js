const db = require('../utils/db');

module.exports = {
    all() {
        return db('categories');
    },
    findCatByLink(link){
        return db('categories').where('CatLink', link);
    }
};