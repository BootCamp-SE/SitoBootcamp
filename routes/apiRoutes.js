const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const { requireAuth, requireAdmin } = require('../Middleware/auth');

const { renderMD } = require('../utils');

const _User = require('../Models/user');
const _Player = require('../Models/player');

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

router.post('/md-editor', requireAuth, requireAdmin, async (req, res) => {
	console.log(renderMD(req.body.body));
	res.status(201).json({res: 'Documento creato!'});
});

module.exports = router;
