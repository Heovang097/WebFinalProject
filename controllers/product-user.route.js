const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/byCat/:id', async function (req, res) {
  const catId = +req.params.id || 0;

  for (c of res.locals.lcCategories) {
    if (c.CatID === catId) {
      c.IsActive = true;
      break;
    }
  }

  const list = await productModel.findByCatID(catId);
  res.render('vwProducts/byCat', {
    products: list,
    empty: list.length === 0
  });
});

module.exports = router;