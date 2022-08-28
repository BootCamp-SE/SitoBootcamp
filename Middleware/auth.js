const JWT = require('jsonwebtoken');
const User = require('../Models/user');

const checkToken = (req, res, next) => {
	const token = req.cookies.JWT;

	if (token) {
		JWT.verify(token, process.env.JWT_SECRET, async (err, decodeToken) => {
			if (err) {
				res.locals.auth = false;
				res.locals.user = null;
				next();
			} else {
				res.locals.auth = true;
				const user = await User.findById(decodeToken.id);
				res.locals.user = user.username;
				next();
			}
		});
	} else {
		res.locals.auth = false;
		res.locals.user = null;
		next();
	}
};

const requireAuth = (req, res, next) => {
	const {auth, user} = res.locals;
	if (auth) {
		User.findOne({username: user}, (err, doc) => {
			if (err) res.status(401).redirect('/auth/401');
			next();
		});
	} else {
		res.status(401).redirect('/auth/401');
	}
};

module.exports = {
	checkToken,
	requireAuth,
};
