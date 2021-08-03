const express = require('express')
const auth = require('../middlewares/auth.mdw');
const commentModel = require('../models/comment.model');
const moment = require('moment')

const router = express.Router()

router.post('/add/:id', auth, async function(req, res) {
    const comment = {
        ArtID: parseInt(req.params.id),
        UserID: req.session.authUser.UserID,
        Content: req.body.comment,
        Date: moment().format(),
    }
    await commentModel.insert(comment)
    res.redirect(`/article/${req.params.id}#comment`)
})

router.post('/delete/:id', auth, async function(req, res) {
    const ArtID = await commentModel.findArticle(req.params.id)
    await commentModel.delete(req.session.authUser.UserID, req.params.id)
    res.json(true)
})

module.exports = router