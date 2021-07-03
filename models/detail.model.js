const db = require("../utils/db");

module.exports = {
    all() {
        return db("articles")
    },
    getComment(a) {
        return db("comments")
    }
}