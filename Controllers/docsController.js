const Article = require('../Models/article');

const { parseMD } = require('../utils');

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
	createArticle,
};
