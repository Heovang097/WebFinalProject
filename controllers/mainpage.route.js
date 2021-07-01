const express = require('express');

const router = express.Router();

router.get('/', function(req, res){
	const data = [
		{ArticleID: 1, ArticleName: 'abc', Active: true},
		{ArticleID: 2, ArticleName: 'Ten thu 2', Active: false}
	];
	res.render('vwMainpage/mainpage', {
		mostViewArticles: data,
		layout: 'main1.hbs'
	});
});

module.exports = router;