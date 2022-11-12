const Article = require('../Models/article');
const { parseMD } = require('../utils');

const getArticles = (req, res) => {
	Article.find({}, (err, articles) => {
		if (err) return res.status(500).render('error', {title: 'Impossibile ottenere gli articoli', error: err});
		res.locals.articles = articles.reverse();
		res.render('news/posts', { title: 'Articoli' });
	});
};

const getArticle = (req, res) => {
	const articleID = req.params.ID;
	Article.findById(articleID, (err, article) => {
		if (err || !article)
			return res.status(500).render('error', {title: '500', error: 'Impossibile accedere all\'articolo richiesto!'});
		res.locals.article = article;
		res.render('news/post', {title: article.title});
	});
};

const createArticle = (req, res) => {
	const { title, subtitle, tags, body } = req.body;
	const author = res.locals.username;
	const author_id = res.locals.userID;

	Article.create(
		{
			title,
			subtitle,
			tags,
			body: parseMD(body),
			author,
			author_id,
		},
		(err, _article) => {
			if (err) return res.status(500).json({ err: err.message });
			res.status(201).json({ res: 'Articolo creato!' });
		}
	);
};

module.exports = {
	getArticles,
	getArticle,
	createArticle,
};