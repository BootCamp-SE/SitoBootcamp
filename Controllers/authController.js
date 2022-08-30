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
		res
			.status(200)
			.json({ res: { user: user._id, message: 'Accesso confermato!' } });
	} catch (err) {
		res.status(500).json({ err: 'Credenziali non valide!' });
	}
};

const signup = async (req, res) => {
	const { username, password, policy, createPlayer } = req.body;
	try {
		User.create({ username, password, policy }, (err, user) => {
			if (err) {
				res.status(500).json({ err: 'Utente non creato!' });
			} else {
				if (createPlayer) {
					Player.create({ _id: user.id }, (err, _doc) => {
						if (err) {
							res.status(500).json({ err: 'Profilo giocatore non creato!' });
						}
					});
					User.updateOne(
						{ _id: user._id },
						{ hasPlayer: true },
						(err, _doc) => {
							if (err) {
								res.status(500).json({ err: 'Utente non aggiornato!' });
							} else {
								res.status(200).json({ res: 'Utente creato' });
							}
						}
					);
				} else {
					res.status(200).json({ res: 'Utente creato' });
				}
			}
		});
	} catch (err) {
		var errString = '';
		errString = err.errors.username
			? err.errors.username.properties.message
			: '';
		errString += err.errors.password
			? err.errors.password.properties.message
			: '';
		res.status(500).json({ err: errString });
	}
};

const updateUserSettings = async (req, res) => {
	const ID = req.query.ID;
	const oldPassword = req.body.oldPassword;
	const userData = {
		username: req.body.username,
		password: req.body.newPassword,
	};

	try {
		const checkPassword = await User.checkPassword(ID, oldPassword);
		if (checkPassword) {
			User.updateOne({ _id: ID }, userData).then((userRes) => {
				userRes.acknowledged
					? res.status(204).json({ res: 'Utente aggiornato!' })
					: res.status(500).json({ err: 'Utente non aggiornato!' });
			});
		}
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const updatePlayerSettings = async (req, res) => {
	const ID = req.query.ID;
	const playerData = req.body;

	Player.updateOne({ _id: ID }, playerData).then((playerRes) => {
		playerRes.acknowledged
			? res.json({ res: 'Profilo giocatore aggiornato!' })
			: res.status(500).json({ err: 'Profilo giocatore non aggiornato!' });
	});
};

const getUserData = (ID, cb) => {
	User.findById(ID, (err, user) => {
		if (err || user == {}) return cb({ err: 'Utente non trovato!' });
		return cb(user);
	});
};

const getPlayerData = (ID, cb) => {
	Player.findById(ID, (err, player) => {
		if (err || player == {})
			return cb({ err: 'Profilo giocatore non trovato!' });
		return cb(player);
	});
};

module.exports = {
	login,
	signup,
	updateUserSettings,
	updatePlayerSettings,
	getUserData,
	getPlayerData,
};
