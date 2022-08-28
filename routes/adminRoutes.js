const { Router } = require('express');
const router = Router();
const { requirePolicy } = require('../Middleware/auth');

router.get('/', requirePolicy, (req, res) => {
	res.render('admin/admin', { title: 'Pannello admin' });
});

router.get('/users', requirePolicy, (req, res) => {
	res.render('admin/users', { title: 'Gestione utenti'});
});

module.exports = router;
