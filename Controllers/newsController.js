const Article = require('../Models/article');
const showdown = require('showdown');

const Converter = new showdown.Converter({
	noHeaderId: true,
	parseImgDimensions: true,
	simplifiedAutoLink: true,
	strikethrough: true,
	tables: true,
	tasklists: true,
	disableForced4SpacesIndentedSublists: true,
	simpleLineBreaks: true,
	emoji: true,

});

const getArticles = (req, res) => {
	Article.find({})
		.then(articles => {
			res.locals.articles = articles.reverse();
			res.render('news/posts', { title: 'Articoli' });
		})
		.catch(err => {
			return res.status(500).render('error', {title: 'Impossibile ottenere gli articoli', error: err});
		});
};

const getArticle = (req, res) => {
	const articleID = req.params.ID;
	Article.findById(articleID)
		.then(article => {
			res.locals.article = article;
			res.render('news/post', {title: article.title});
		})
		.catch(_err => {
			return res.status(500).render('error', {title: '500', error: 'Impossibile accedere all\'articolo richiesto!'});
		});
};

const parseMD = (text) => {
	return Converter.makeHtml(text);
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
			body: parseMD(body),		//TODO: Add input sanitizer
			author,
			author_id,
		})
		.then(_article => {
			return res.status(201).json({ res: 'Articolo creato!' });
		})
		.catch(err => {
			return res.status(500).json({ err: err.message });
		});
};

module.exports = {
	getArticles,
	getArticle,
	createArticle,
};