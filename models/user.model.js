const db = require("../utils/db.js");

module.exports = {
    all() {
        return db("user");
    },
    add(userInfo) {
        return db("user").insert(userInfo);
    },
    edit(userInfo){

    },
    get(id) {
        return db("user").where({
            "userID": id
        });
    }
}