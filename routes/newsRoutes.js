const { Router } = require('express');
const router = Router();
const { requireAuth, requirePolicy, requireAdmin } = require('../Middleware/auth');
const Article = require('../Models/article');

router.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		if (err) return res.status(500).render('error', {title: 'Impossibile ottenere gli articoli', error: err});
		res.locals.articles = articles;
		res.render('news/posts', { title: 'Articoli' });
	});
});

router.get('/eventi', (req, res) => {
	res.render('news/events', { title: 'Storico Eventi' });
});

router.get('/rapporti', requireAuth, requirePolicy, (req, res) => {
	res.render('news/reports', { title: 'Rapporti' });
});

router.get('/safenet', (req, res) => {
	res.render('news/safeNet', { title: 'SafeNet Radio' });
});

// NOTE: Require admin because still in dev
router.get('/navi', requireAdmin, (req, res) => {
	res.render('news/shipsForum', { title: 'Forum Navi' });
});

// TODO: Create custom route with correct name
router.get('/editorMD', requireAuth, requireAdmin, (req, res) => {
	res.render('news/editorMD', { title: 'editorMD' });
});

router.get('/:ID', (req, res) => {
	const articleID = req.params.ID;
	Article.findById(articleID, (err, article) => {
		if (err || !article)
			return res.status(500).render('error', {title: '500', error: 'Impossibile accedere all\'articolo richiesto!'});
		res.locals.article = article;
		res.render('news/post', {title: article.title});
	});
});

module.exports = router;
