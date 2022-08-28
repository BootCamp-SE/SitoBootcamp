const { Router } = require('express');
const router = Router();
const { requirePolicy, requireAuth } = require('../Middleware/auth');
const { getRanks, getSpecialization } = require('../Middleware/utils');

router.get('/', (req, res) => {
	res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
	res.render('auth/login', {title: 'Accedi'});
});

router.get('/signup', requireAuth, requirePolicy, (req, res) => {
	res.render('auth/signup', {title: 'Registrazione'});
});

router.get('/logout', requireAuth, (req, res) => {
	res.cookie('JWT', '', {maxAge: 0});
	res.status(200).redirect('/');
});

router.get('/settings/:id', requireAuth, getRanks, getSpecialization, (req, res) => {
	res.render('auth/settings', {title: 'Impostazioni'});
});

module.exports = router;