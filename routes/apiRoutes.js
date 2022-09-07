const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const { requireAuth, requireAdmin } = require('../Middleware/auth');

const docsController = require('../Controllers/docsController');

// Login && Logout
router.post('/auth/login', authController.login);
router.post('/auth/signup', requireAuth, authController.signup);

// Update User && Player Settings
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

// Create New Article
router.post('/md-editor', requireAuth, requireAdmin, docsController.createArticle);

module.exports = router;