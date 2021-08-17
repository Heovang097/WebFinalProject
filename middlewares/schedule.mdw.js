const articleModel = require('../models/article.model')
const moment = require('moment')
var schedule = require('node-schedule');

async function updateState() {
    await articleModel.updateState()
    console.log('Updated State at ', moment())
}

module.exports = {
    run(){
        setInterval(updateState, 60000);
        let cronWeek = '0 0 0 * * MON';
        var updateLastWeekViews = schedule.scheduleJob(cronWeek, async function(){
            await articleModel.updateLastWeekViews();
            console.log("Updated Last Week Views at ", moment());
        })
    }
}