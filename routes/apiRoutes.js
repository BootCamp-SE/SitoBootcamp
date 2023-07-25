const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const newsController = require('../Controllers/newsController');

// Login
router.post('/auth/login', authController.login);

// User Signup && Delete
router.post('/auth/signup', authController.signup);
router.delete('/auth/delete', authController.deleteUser);

// Update User && Player Settings
router.put('/auth/settings/user', authController.updateUserSettings);

router.put('/auth/settings/policies', authController.updateUserPolicies);

router.put('/auth/settings/player', authController.updatePlayerSettings);

// Create New Article
router.post('/news/createArticle', newsController.createArticle);

router.use('/', (req, res) => {
	res.status(404).json({err: 'API endpoint not found!'});
});

module.exports = router;