const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const { requireAuth, requirePolicy } = require('../Middleware/auth');

const User = require('../Models/user');
const Player = require('../Models/player');

router.post('/auth/login', authController.login);
router.post('/auth/signup', requireAuth, authController.signup);
router.post('/auth/settings/user', requireAuth, (req, res, next) => {
	if ((res.locals.isAdmin || res.locals.userPolicy.includes('manageruser')) || (res.locals.userID == req.query.ID)) {
		next();
	} else {
		res.status(403).json({ err: 'Forbidden access!'});
	}
}, authController.updateUserSettings);
router.post('/auth/settings/player', requireAuth, (req, res, next) => {
	if ((res.locals.isAdmin || res.locals.userPolicy.includes('manageruser')) || (res.locals.userID == req.query.ID)) {
		next();
	} else {
		res.status(403).json({ err: 'Forbidden access!'});
	}
}, authController.updatePlayerSettings);

router.get('/users', requireAuth, requirePolicy, async (req, res) => {
	User.find({}, { password: 0}, (err, usersData) => {
		if (err) res.status(500).json({err: 'Impossible accedere agli utenti'});
		if (usersData) {
			res.status(200).json(usersData);
		} else {
			res.status(404).json({err: 'Non esistono utenti!'});
		}
	});
});

router.get('/players', requireAuth, requirePolicy, async (req, res) => {
	Player.find({}, {}, (err, playersData) => {
		if (err) res.status(500).json({err: 'Impossible accedere ai profili giocatori'});
		if (playersData) {
			res.status(200).json(playersData);
		} else {
			res.status(404).json({err: 'Non esistono profili giocatiri!'});
		}
	});
});

module.exports = router;
