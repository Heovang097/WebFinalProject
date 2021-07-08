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
		newestArticleByCat:  newestArticleByCat
	});
});

router.get('/:CatLink', async function(req, res){
	// console.log(req.params.CatLink);
	const CatInfo = await categoryModel.findCatByLink(req.params.CatLink);
	// console.log(CatInfo[0]);
	const raw_CatArticles = await articlesModel.allByCatID(CatInfo[0].CatID);
	const CatArticles = raw_CatArticles[0];
	res.render('vwArticle/byCat', {
		CatInfo: CatInfo[0],
		CatArticles: CatArticles,
		empty: CatArticles.length === 0	
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
	const raw_BranchArticles = await articleModel.allByBranchID(BranchInfo[0].BranchID);
	const BranchArticles = raw_BranchArticles[0];
	res.render('vwArticle/byCat', {
		CatInfo: BranchInfo[0],
		CatArticles: BranchArticles,
		empty: BranchArticles.length === 0
	})
})

module.exports = router;