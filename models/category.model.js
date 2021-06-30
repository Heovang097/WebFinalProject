const db = require("../utils/db.js");

module.exports = {
    all() {
        return db("categories");
    },
}