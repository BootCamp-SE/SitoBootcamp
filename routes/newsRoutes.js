const { Router } = require('express');
const router = Router();

const { requirePolicy, requireAdmin } = require('../Middleware/auth');
const { getArticles, getArticle } = require('../Controllers/newsController');

router.get('/', getArticles);

router.get('/articleEditor', requirePolicy, (req, res) => {
	res.render('news/articleEditor', { title: 'Article Editor' });
});

// NOTE: Require admin because still in dev
router.get('/eventi', requireAdmin, (req, res) => {
	res.render('news/events', { title: 'Storico Eventi' });
});

router.get('/rapporti', requirePolicy, (req, res) => {
	res.render('news/reports', { title: 'Rapporti' });
});

// NOTE: Require admin because still in dev
router.get('/safenet', requireAdmin, (req, res) => {
	res.render('news/safeNet', { title: 'SafeNet Radio' });
});

// NOTE: Require admin because still in dev
router.get('/navi', requireAdmin, (req, res) => {
	res.render('news/shipsForum', { title: 'Forum Navi' });
});

router.get('/:ID', getArticle);

module.exports = router;
