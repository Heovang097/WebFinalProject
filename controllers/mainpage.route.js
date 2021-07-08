const express = require('express');

const router = express.Router();
const articlesModel = require('../models/article.model');

function TakeNewArticles(numberElement, data){
	const res = [];
	const arr = [];
	for (let i = 0; i < Math.min(numberElement,data.length); ++i){
		if (i%3 == 0) res.push([]);
		res[Math.floor(i/3)].push(data[i]);
		// console.log(i, res);
	}
	return res;
}

router.get('/', async function(req, res){
	const data = await articlesModel.mostViewArticles();
	const mostViewArticles = data.slice(0, 3);
	const newestArticlesRaw = await(articlesModel.newestArticles());
	const newestArticles = TakeNewArticles(10, newestArticlesRaw);
	const raw_newestArticleByCat = await articlesModel.newestArticleByCat();
	const newestArticleByCat = raw_newestArticleByCat[0];
	// console.log(newestArticleByCat);
	console.log(res.locals.lcCategories);
	res.render('vwMainpage/mainpage', {
		mostViewArticles: mostViewArticles,
		newestArticles: newestArticles,
		newestArticleByCat:  newestArticleByCat
	});
});

module.exports = router;