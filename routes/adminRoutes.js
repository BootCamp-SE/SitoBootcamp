const { Router } = require('express');
const router = Router();
const { requirePolicy } = require('../Middleware/auth');
const User = require('../Models/user');

router.get('/', requirePolicy, (req, res) => {
	res.render('admin/admin', { title: 'Pannello admin' });
});

router.get('/users', requirePolicy, (req, res) => {
	User.find({}, { password: 0}, (err, usersData) => {
		if (err) {
			console.log(err);
			res.status(500).render('error', {title: 'Gestione utenti', Error: 'Impossibile ottenere gli utenti'});
		}
		res.locals.usersData = usersData;
		res.status(200).render('admin/users', {title: 'Gestione utenti'});
	});
});

module.exports = router;
