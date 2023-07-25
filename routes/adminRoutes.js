const { Router } = require('express');
const router = Router();
const User = require('../Models/user');

// TODO: Create admin panel
// NOTE: Not urgent
router.get('/', (req, res) => {
	res.render('admin/admin', { title: 'Pannello admin' });
});

router.get('/users', async (req, res) => {
	User.find({})
		.then(usersData => {
			res.locals.usersData = usersData;
			res.status(200).render('admin/users', {title: 'Gestione Utenti'});
		})
		.catch(_err => {
			res.status(500).render('error', {title: 'Gestione utenti', error: 'Impossibile ottenere gli utenti'});
		});
});

module.exports = router;
