const { Router } = require('express');
const router = Router();
const authController = require('../Controllers/authController');

router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);
router.post('/auth/setting', authController.signup);
module.exports = router;