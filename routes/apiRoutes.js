const { Router } = require('express');
const router = Router();
const authController = require('../Controllers/authController');

router.post('/auth/login', authController.login);

module.exports = router;