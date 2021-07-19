const articleModel = require('../models/article.model')
const moment = require('moment')
module.exports = {
    updateState: async function() {
        await articleModel.updateState()
        console.log('Updated State at ', moment())
    },
}