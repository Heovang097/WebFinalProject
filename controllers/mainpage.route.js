const express = require('express');

const router = express.Router();
const articlesModel = require('../models/article.model');
const categoryModel = require('../models/category.model');
const branchModel = require('../models/branch.model');
const articleModel = require('../models/article.model');

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
	// console.log(data[0]);
	const mostViewArticles = data[0].slice(0, 3);
	const newestArticlesRaw = await(articlesModel.newestArticles());
	const newestArticles = TakeNewArticles(10, newestArticlesRaw[0]);
	const raw_newestArticleByCat = await articlesModel.newestArticleByCat();
	const newestArticleByCat = raw_newestArticleByCat[0];
	// console.log(newestArticleByCat);
	// console.log(res.locals.lcCategories);
	res.render('vwMainpage/mainpage', {
		mostViewArticles: mostViewArticles,
		newestArticles: newestArticles,
		newestArticleByCat:  newestArticleByCat,
	});
});

router.get('/:CatLink', async function(req, res){
	// console.log(req.params.CatLink);
	const CatInfo = await categoryModel.findCatByLink(req.params.CatLink);
	// console.log(CatInfo[0]);
	const limit = 6;
	const total = await articleModel.countByCatID(CatInfo[0].CatID);
	// console.log(total);
	// console.log(total['count'])
	var nPage = Math.floor(total/limit);
	if (total % limit > 0) nPage = nPage + 1;
	console.log(nPage);

	let page = req.query.page || 1;
	if (page < 1) page = 1;
	const page_numbers = [];
	for (i = 1; i <= nPage; ++i){
		page_numbers.push({
			value: i,
			active: i===+page
		})
	}
	// console.log("page: ", page);
	const offset = (page - 1)*limit;
	const raw_CatArticles = await articlesModel.allByCatID(CatInfo[0].CatID, offset);
	const CatArticles = raw_CatArticles[0];
	res.render('vwArticle/byCat', {
		CatInfo: CatInfo[0],
		CatArticles: CatArticles,
		empty: CatArticles.length === 0,
		page_numbers: page_numbers,
		prev_page : Math.max(1, +page-1),
		next_page : Math.min(+page+1, nPage)
	});
});

router.get('/:CatLink/:BranchLink', async function(req, res){
	// console.log(req.params.BranchLink)
	const BranchInfo = await branchModel.findBranchByLink(req.params.BranchLink);
	if (BranchInfo.length === 0){
		res.render('vwArticle/byCat',{
			empty: true
		});
		return;
	}
	const limit = 6;
	const total = await articleModel.countByBranchID(BranchInfo[0].BranchID);
	// console.log(total);
	// console.log(total['count'])
	var nPage = Math.floor(total/limit);
	if (total % limit > 0) nPage = nPage + 1;
	console.log(nPage);

	let page = req.query.page || 1;
	if (page < 1) page = 1;
	const page_numbers = [];
	for (i = 1; i <= nPage; ++i){
		page_numbers.push({
			value: i,
			active: i===+page
		})
	}
	// console.log("page: ", page);
	const offset = (page - 1)*limit;

	const raw_BranchArticles = await articleModel.allByBranchID(BranchInfo[0].BranchID, offset);
	const BranchArticles = raw_BranchArticles[0];
	res.render('vwArticle/byCat', {
		CatInfo: BranchInfo[0],
		CatArticles: BranchArticles,
		empty: BranchArticles.length === 0,
		page_numbers: page_numbers,
		prev_page : Math.max(1, +page-1),
		next_page : Math.min(+page+1, nPage)
	})
})

module.exports = router;