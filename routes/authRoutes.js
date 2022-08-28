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

router.get('/logout', (req, res) => {
	res.cookie('JWT', '', {maxAge: 0});
	res.status(200).redirect('/');
});

router.get('/settings', (req, res) => {
	res.render('auth/settings', {title: 'Impostazioni'});
});

router.get('/401', (req, res) => {
	res.render('auth/401', {title: '401'});
});

module.exports = router;