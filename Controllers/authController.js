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
	try {
		User.create({ username, password, policy }, (err, user) => {
			if (err) res.status(500).json({ err: 'Utente non creato!'});
			if (createPlayer) {
				Player.create({ _id: user.id }, (err, _doc) => {
					if (err) res.status(500).json({ err: 'Profilo giocatore non creato!'});
				});
				User.updateOne({_id: user._id}, {hasPlayer: true}, (err, _doc) => {
					if (err) res.status(500).json({ err: 'Utente non aggiornato!'});
				});
			}
		});
		res.status(200).json({ res: 'Utente creato' });
	} catch (err) {
		var errString = '';
		errString = err.errors.username ? err.errors.username.properties.message : '';
		errString += err.errors.password ? err.errors.password.properties.message : '';
		res.status(500).json({ err: errString });
	}
};

const getUserData = async (id) => {
	const data = await User.findById(id).exec();
	if (!data) return { err: 'User not found!' };
	return data;
};

const getPlayerData = async (id) => {
	const data = await Player.findOne({user_id: id}).exec();
	if (!data) return { err: 'User not found!' };
	return data;
};

module.exports = {
	login,
	signup,
	getUserData,
	getPlayerData,
};
