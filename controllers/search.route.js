const express = require('express');
const { route } = require('./account.route');
const router = express.Router();
const articleModel = require('../models/article.model');
var URLSearchParams = require('url-search-params');

router.get('/', async function(req, res){
	const type = req.query.type || 1;
	const search = req.query.search || '';
	let page = req.query.page || 1;
	if (page < 1) page = 1;
	const limit = 6;
	var total;
	var resultArticles;
	var offset = (page -1)*limit;
	// console.log(page);
	// console.log(offset);
	// console.log(type);
	// console.log(search);
	var url = '/search?';
	if (req.query.search){
		url +=`search=${req.query.search}`;
	}	
	if (req.query.type){
		url += `&type=${req.query.type}`;
	}
	console.log(url);
	// var searchParams = new URLSearchParams(url);
	// console.log(searchParams);
	// console.log(req.originalUrl.search);
	// for (let p of searchParams) {
  	// 	console.log(p);
	// }
	// searchParams.delete("page");
	// console.log(searchParams.toString());

	if (type == 1){
		// res.send(1);
		resultArticles = await articleModel.searchByTitle(search);
		total = resultArticles.length;
		resultArticles = await articleModel.searchByTitleOffsetPremium(search, offset);
		// console.log(resultArticles);
	}
	if (type == 2){
		// console.log(2);
		resultArticles = await articleModel.searchByAbstract(search);
		total = resultArticles.length;
		resultArticles = await articleModel.searchByAbstractOffsetPremium(search, offset);
	}
	if (type == 3){
		resultArticles = await articleModel.searchByContent(search);
		total = resultArticles.length;
		resultArticles = await articleModel.searchByContentOffsetPremium(search, offset);
	} 
	var nPage = Math.floor(total/limit);
	if (total % limit > 0) nPage = nPage + 1;

	const page_numbers = [];
	for (i = 1; i <= nPage; ++i){
		page_numbers.push({
			value: i,
			active: i===+page
		})
	}

	res.render('vwSearch/search', {
		Articles: resultArticles,
		empty: resultArticles.length == 0,
		page_numbers: page_numbers,
		prev_page : Math.max(1, +page-1),
		next_page : Math.min(+page+1, nPage),
		url: url,
	});
});

router.post('/', async function(req, res){
	// res.send(req.body);
	const content = req.body.content || '';
	const type = req.body.type || 1;
	res.redirect(`/search?search=${content}&type=${type}`)
});

module.exports = router;