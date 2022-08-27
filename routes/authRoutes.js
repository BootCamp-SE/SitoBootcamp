const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
	res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
	res.render('auth/login', {title: 'Accedi'});
});

router.get('/signup', (req, res) => {
	res.render('auth/signup', {title: 'Registrazione'});
});

router.get('/setting', (req, res) => {
	res.render('auth/setting', {title: 'Impostazioni'});
});

module.exports = router;