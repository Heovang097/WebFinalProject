const express = require("express")
const postModel = require("../models/detail.model")
const router = express.Router()

router.get('/post', async function(req, res) {
    const list = await postModel.all();
    console.log(list)
})

module.exports = router;