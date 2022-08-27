const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
	res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
	res.render('auth/login', {title: 'Login'});
});

router.get('/signup', (req, res) => {
	res.render('auth/signup', {title: 'Signup'});
});

module.exports = router;