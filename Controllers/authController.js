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
		res.cookie('JWT', token, { httpOnly: true, secure: true, maxAge: maxAge * 1000 });
		res.status(200).json({ res: 'Accesso confermato!' });
	} catch (err) {
		res.status(500).json({ err: 'Credenziali non valide!' });
	}
};

const signup = async (req, res) => {
	const { username, password, policy, createPlayer } = req.body;
	try {
		User.create({ username, password, policy }, (err, user) => {
			if (err) {
				return res.status(500).json({ err: 'Utente non creato!' });
			} else {
				if (createPlayer) {
					Player.create({ _id: user.id }, (err, _doc) => {
						if (err) 
							return res.status(500).json({ err: 'Profilo giocatore non creato!' });
					});
					User.updateOne(
						{ _id: user._id },
						{ hasPlayer: true },
						(err, _doc) => {
							if (err) {
								return res.status(500).json({ err: 'Utente non aggiornato!' });
							} else {
								return res.status(200).json({ res: 'Utente creato' });
							}
						}
					);
				} else {
					return res.status(200).json({ res: 'Utente creato' });
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
		return res.status(500).json({ err: errString });
	}
};

const updateUserSettings = async (req, res) => {
	const ID = req.query.ID;
	const oldPassword = req.body.oldPassword;
	var useAdmin = false;

	var userData = {};
	if (req.body.username != '')
		userData.username = req.body.username; 
	if (req.body.newPassword != '')
		userData.password = req.body.newPassword;
	if (req.body.adminPassword != '') {
		if (res.locals.isAdmin || res.locals.userPolicies.includes('manageruser')) {
			userData.password = req.body.adminPassword;
			useAdmin = true;
		} else {
			return res.status(403).json({ err: 'Utente non aggiornato! Admin check' });
		}
	}

	try {
		if (!useAdmin)
			var checkPassword = await User.checkPassword(ID, oldPassword);
		if (checkPassword || useAdmin) {
			User.updateOne({ _id: ID }, userData).then((userRes) => {
				if (userRes.acknowledged) {
					res.json({ res: 'Utente aggiornato!' });
				} else {
					res.status(500).json({ err: 'Utente non aggiornato!' });
				}
			});
		}
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const updateUserPolicies = async (req, res) => {
	const ID = req.query.ID;

	var userData = {};
	if (req.body.policy != ([] || null))
		userData.policies = req.body.policy;

	try {
		User.updateOne({ _id: ID }, userData).then((userRes) => {
			if (userRes.acknowledged) {
				res.json({ res: 'Utente aggiornato!' });
			} else {
				res.status(500).json({ err: 'Utente non aggiornato!' });
			}
		});
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const FieldsWhiteList = ['grado', 'equipaggio', 'equipaggio_secondario', 'specializzazione', 'discord_id', 'discord_name', 'steam_id', 'steam_name', 'note_private', 'note_pubbliche'];
const FieldsBlackList = ['grado', 'equipaggio', 'equipaggio_secondario', 'specializzazione', 'discord_id', 'steam_id', 'note_private'];

const createPlayerData = (body) => {
	var ret = {};
	Object.keys(body).forEach((key) => {
		if (body[key] != undefined) {
			if (FieldsWhiteList.includes(key) && !FieldsBlackList.includes(key)) {
				ret[key] = body[key];
			}
		}		
	});
	return ret;
};

const createPlayerDataWithPerms = (body) => {
	var ret = {};
	Object.keys(body).forEach((key) => {
		if (FieldsWhiteList.includes(key)) {
			if (body[key] != '') 
				ret[key] = body[key];
		}
	});
	return ret;
};

const updatePlayerSettings = async (req, res) => {
	const ID = req.query.ID;
	const body = req.body;

	var playerData = {};

	if (res.locals.isAdmin || res.locals.userPolicies.includes('manageruser')) {
		playerData = createPlayerDataWithPerms(body);
	} else {
		playerData = createPlayerData(body);
	}

	Player.updateOne({ _id: ID }, playerData).then((playerRes) => {
		playerRes.acknowledged
			? res.json({ res: 'Profilo giocatore aggiornato!' })
			: res.status(500).json({ err: 'Profilo giocatore non aggiornato!' });
	});
};

const getUserData = (ID, cb) => {
	User.findById(ID, {password: 0}, function (err, user) {
		if (err || !user) return cb({ err: 'Utente non trovato!' });
		return cb(user);
	});
};

const getPlayerData = (ID, cb) => {
	Player.findById(ID, (err, player) => {
		if (err || player == null)
			return cb({ err: 'Profilo giocatore non trovato!' });
		return cb(player);
	});
};

module.exports = {
	login,
	signup,
	updateUserSettings,
	updateUserPolicies,
	updatePlayerSettings,
	getUserData,
	getPlayerData,
};

