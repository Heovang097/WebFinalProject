
const express = require('express');
const articleModel = require('../models/article.model');
const tagsModel = require('../models/tag.model');

const router = express.Router();

router.get('/:tag', async function(req, res){
	// console.log(req.params.CatLink);
	// const CatInfo = await categoryModel.findCatByLink(req.params.CatLink);
	// console.log(CatInfo[0]);
	const limit = 6;
	const total = await articleModel.countByTag(req.params.tag);
	// console.log(total);
	// console.log(total['count'])
	var nPage = Math.floor(total/limit);
	if (total % limit > 0) nPage = nPage + 1;
	// console.log(nPage);

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
	// const raw_CatArticles = await articlesModel.allByCatID(CatInfo[0].CatID, offset);
	// const CatArticles = raw_CatArticles[0];
	const TagArticles = await articleModel.allByTag(req.params.tag, offset);
	res.render('vwArticle/byCat', {
		CatInfo: null,
		CatArticles: TagArticles,
		empty: TagArticles.length === 0,
		page_numbers: page_numbers,
		prev_page : Math.max(1, +page-1),
		next_page : Math.min(+page+1, nPage)
	});
});


module.exports = router;