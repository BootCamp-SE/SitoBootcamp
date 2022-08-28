const { Router } = require('express');
const router = Router();

const authController = require('../Controllers/authController');
const { requireAuth } = require('../Middleware/auth');

const User = require('../Models/user');
const Player = require('../Models/player');

router.post('/auth/login', authController.login);
router.post('/auth/signup', requireAuth, authController.signup);

router.get('/user', requireAuth, async (req, res) => {
	const ID = req.query.ID;
	const userData = await User.findById(ID).exec();
	userData ?	res.status(200).json(userData) : res.status(404).json({err: 'Utente non trovato!'});
});

router.get('/player', requireAuth, async (req, res) => {
	const ID = req.query.ID;
	const playerData = await Player.findOne({user_id: ID}).exec();
	playerData ?	res.status(200).json(playerData) : res.status(404).json({err: 'Player non trovato!'});
});

module.exports = router;
