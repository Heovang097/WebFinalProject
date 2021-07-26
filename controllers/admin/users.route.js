const express = require("express");
const router = express.Router();
const moment = require('moment');

router.get("/", async function(req, res) {
    res.render("vwAdmin/categories", {
        layout: "admin.hbs"
    })
});

module.exports = router;