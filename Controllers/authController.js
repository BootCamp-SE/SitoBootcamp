const User = require('../Models/user');
const JWT = require('jsonwebtoken');

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
	const { username, password } = req.body;
	try {
		await User.create({ username, password });
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
