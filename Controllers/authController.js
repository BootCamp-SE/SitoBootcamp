const User = require('../Models/user');
const JWT = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return JWT.sign({ id }, 'net ninja secret', {
		expiresIn: maxAge,
	});
};

const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.login(username, password);
		const token = createToken(user._id);
		res.cookie('JWT', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (error) {
		const errors = { user: '', password: '' };
		if (error.message.includes('Incorrect username!')) {
			errors.user = 'Incorrect username!';
		}
		if (error.message.includes('Incorrect password!')) {
			errors.password = 'Invalid password!';
		}
		res.status(400).json({ errors });
	}
};

module.exports = {
	login,
};
