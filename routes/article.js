const express = require('express');
const { createArticle, fetchArticle } = require('../controller/article');

const router = express.Router();

router.post('/' , createArticle);
router.get('/' , fetchArticle);


module.exports = router;