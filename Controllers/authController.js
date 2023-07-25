const { isNullOrUndefined } = require('mongoose/lib/utils');
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
		res.cookie('JWT', token, { httpOnly: true, secure: true, maxAge: maxAge * 1000, sameSite: 'Strict' });
		return res.status(200).json({ res: 'Accesso confermato!' });
	} catch (err) {
		return res.status(500).json({ err: 'Credenziali non valide!' });
	}
};

// TODO: When singup page UI is remade add fields for discord and steam ids
const signup = async (req, res) => {
	const { username, password, policies, createPlayer } = req.body;
	
	var userData = {};
	userData.username = username;
	userData.password = password;
	userData.hasPlayer = createPlayer;
	userData.policies = policies;

	try {
		User.create(userData)
			.then(user => {
				if (!createPlayer)
					return res.status(200).json({ res: 'Utente creato!' });

				Player.create({ _id: user.id }) 
					.then(_player => {
						return res.status(200).json({ res: 'Utente e player creati!' });
					})
					.catch(_err => {
						return res.status(500).json({ err: 'Profilo giocatore non creato!' });
					});
			})
			.catch(err => {
				return res.status(500).json({ err: err.errors });
			});
	} catch (err) {
		return res.status(500).json({ err });
	}
};

const deleteUser = async (req, res) => {
	const userId = req.query.ID;
	try {
		User.findById(userId)
			.then(user => {
				if (user.hasPlayer) {
					Player.deleteOne({_id: userId})
						.catch(err => {
							return res.status(500).json({err});
						});
				}
			})
			.catch(_err => {
				return res.status(500).json({err: 'Utente non trovato'});
			});
			
		User.deleteOne({_id: userId})
			.then(err => {
				return res.status(500).json({err});
			});

		return res.status(200).json({res: 'Utente eliminato'});
	} catch (err) {
		return res.status(500).json({err});
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
		if (res.locals.isAdmin || res.locals.userPolicies.includes('manageusers')) {
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
				if (userRes.acknowledged) 
					return res.json({ res: 'Utente aggiornato!' });

				return res.status(500).json({ err: 'Utente non aggiornato!' });
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
			if (userRes.acknowledged)
				return res.json({ res: 'Utente aggiornato!' });
			
			return res.status(500).json({ err: 'Utente non aggiornato!' });
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
		if (!isNullOrUndefined(body[key])) {
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
		if (!isNullOrUndefined(body[key])) {
			if (FieldsWhiteList.includes(key) && body[key] != '') {
				ret[key] = body[key];
			}
		}
	});
	return ret;
};

const updatePlayerSettings = async (req, res) => {
	const ID = req.query.ID;
	const body = req.body;

	var playerData = {};

	if (res.locals.isAdmin || res.locals.userPolicies.includes('manageusers')) {
		playerData = createPlayerDataWithPerms(body);
	} else {
		playerData = createPlayerData(body);
	}

	Player.updateOne({ _id: ID }, playerData).then((playerRes) => {
		if (playerRes.acknowledged)
			return res.json({ res: 'Profilo giocatore aggiornato!' });

		return res.status(500).json({ err: 'Profilo giocatore non aggiornato!' });
	});
};

const getUserData = (ID, cb) => {
	User.findById(ID, {password: 0})
		.then(user => {
			return cb(user);
		})
		.catch(_err => {
			return cb({ err: 'Utente non trovato!' });
		});
};

const getPlayerData = (ID, cb) => {
	Player.findById(ID) 
		.then(player => {
			return cb(player);
		})
		.catch(_err => {
			return cb({ err: 'Profilo giocatore non trovato!' });
		});
};

module.exports = {
	login,
	signup,
	deleteUser,
	updateUserSettings,
	updateUserPolicies,
	updatePlayerSettings,
	getUserData,
	getPlayerData,
};
