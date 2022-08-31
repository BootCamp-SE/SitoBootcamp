const { Router } = require('express');
const router = Router();
const { requireAuth, requirePolicy, requireAdmin } = require('../Middleware/auth');

router.get('/', (req, res) => {
	res.render('news/posts', { title: 'Articoli' });
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

router.get('/navi', (req, res) => {
	res.render('news/shipsForum', { title: 'Forum Navi' });
});

router.get('/editorMD', requireAuth, requireAdmin, (req, res) => {
	res.render('news/editorMD', { title: 'editorMD' });
});

module.exports = router;
