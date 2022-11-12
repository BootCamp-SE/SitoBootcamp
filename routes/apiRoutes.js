const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const { requireAuth, requirePolicy } = require('../Middleware/auth');

const newsController = require('../Controllers/newsController');

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
router.post('/news/createArticle', requireAuth, requirePolicy, newsController.createArticle);

router.use('/', (req, res) => {
	res.status(404).json({err: 'API endpoint not found!'});
});

module.exports = router;