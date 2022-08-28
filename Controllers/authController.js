const JWT = require('jsonwebtoken');
const User = require('../Models/user');
const Player = require('../Models/player');

const createToken = (id, remember) => {
	const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
	return JWT.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	});
};

const login = async (req, res) => {
	const { username, password, remember } = req.body;
	try {
		const user = await User.login(username, password);
		const token = createToken(user._id, remember);
		const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
		res.cookie('JWT', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ res: { user: user._id, message: 'Accesso confermato!' } });
	} catch (err) {
		res.status(500).json({ err: 'Credenziali non valide!' });
	}
};

const signup = async (req, res) => {
	const { username, password, policy, createPlayer } = req.body;
	console.log(createPlayer);
	try {
		console.log('Creating user');
		const user = await User.create({ username, password, policy });
		console.log(user);
		if (createPlayer) {
			console.log('Creating player');
			const player = await Player.create({ user_id: user._id });
			console.log('Player created\n', player);
		}
		res.status(200).json({ res: 'Utente creato' });
	} catch (errs) {
		var err = '';
		err += errs.errors.username ? errs.errors.username.message : '';
		err += errs.errors.password ? '\n' + errs.errors.password.message : '';
		res.status(500).json({ err });
	}
};

module.exports = {
	login,
	signup,
};
