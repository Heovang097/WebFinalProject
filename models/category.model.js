const db = require('../utils/db');

module.exports = {
    all() {
        return db('categories');
    },
    findCatByLink(link){
        return db('categories').where('CatLink', link);
    },
    add(category){
        return db('categories').insert(category);
    },
    patch(category) {
        const id = category.CatID;
        delete category.CatID;

        return db('categories')
            .where('CatID', id)
            .update(category);
    },
    del(CatID) {
        return db('categories')
            .where('CatID', CatID)
            .del();
    },
};