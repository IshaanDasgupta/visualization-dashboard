const Article = require('../models/Article');
const createError = require('../utils/error');

const createArticle = async(req,res,next) => {
    try{
        const article = new Article(req.body);
        await article.save();
        res.status(200).send(article);
    }
    catch(err){
        next(err);
    }
}

const fetchArticle = async (req,res,next) => {
    try {
        let filter = {};
        if (req.query.topic){
            filter.topic = req.query.topic;
        }
        if (req.query.country){
            filter.country = req.query.country;
        }
        if (req.query.sector){
            filter.sector = req.query.sector;
        }
        if (req.query.source){
            filter.source = req.query.source;
        }
        const articles = await Article.find(filter);
        res.status(200).send(articles);
    }
    catch(err){
        next(err);
    }
}

module.exports = {createArticle , fetchArticle};