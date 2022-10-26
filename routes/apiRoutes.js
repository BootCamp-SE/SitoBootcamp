const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const { requireAuth, requireAdmin } = require('../Middleware/auth');

const docsController = require('../Controllers/docsController');

// Login && Logout
router.post('/auth/login', authController.login);
router.post('/auth/signup', requireAuth, authController.signup);

// Update User && Player Settings
router.put('/auth/settings/user', requireAuth, (req, res, next) => {
	if ((res.locals.isAdmin || res.locals.userPolicy.includes('manageruser')) || (res.locals.userID == req.query.ID)) {
		next();
	} else {
		res.status(403).json({ err: 'Forbidden access!'});
	}
}, authController.updateUserSettings);

router.put('/auth/settings/policies', requireAuth, (req, res, next) => {
	if ((res.locals.isAdmin || res.locals.userPolicy.includes('manageruser')) || (res.locals.userID == req.query.ID)) {
		next();
	} else {
		res.status(403).json({ err: 'Forbidden access!'});
	}
}, authController.updateUserPolicies);

router.put('/auth/settings/player', requireAuth, (req, res, next) => {
	if ((res.locals.isAdmin || res.locals.userPolicy.includes('manageruser')) || (res.locals.userID == req.query.ID)) {
		next();
	} else {
		res.status(403).json({ err: 'Forbidden access!'});
	}
}, authController.updatePlayerSettings);

// Create New Article
// TODO: Move articles logic and routes to correct routes
router.post('/md-editor', requireAuth, requireAdmin, docsController.createArticle);

router.use('/', (req, res) => {
	res.status(404).json({err: 'API endpoint not found!'});
});

module.exports = router;