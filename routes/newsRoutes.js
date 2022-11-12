const { Router } = require('express');
const router = Router();
const { requireAuth, requirePolicy, requireAdmin } = require('../Middleware/auth');
const { getArticles, getArticle } = require('../Controllers/newsController');

router.get('/', getArticles);

router.get('/articleEditor', requireAuth, requirePolicy, (req, res) => {
	res.render('news/articleEditor', { title: 'Article Editor' });
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

router.get('/:ID', getArticle);

module.exports = router;
