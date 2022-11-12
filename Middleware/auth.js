const JWT = require('jsonwebtoken');
const User = require('../Models/user');

const pagesPolicy = [
	{ path: '/news/articleEditor', policy: ['writearticles'] },
	{ path: '/news/rapporti', policy: ['readreportsecret', 'readreport', 'writereport'] },
	{ path: '/accademia', policy: ['student', 'teacher'] },
	{ path: '/accademia/ingegneria', policy: ['student', 'teacher'] },
	{ path: '/accademia/militare', policy: ['student', 'teacher'] },
	{ path: '/accademia/tattica', policy: ['student', 'teacher'] },
	{ path: '/accademia/scripts', policy: ['student', 'teacher'] },
	{ path: '/accademia/others', policy: ['student', 'teacher'] },
	{ path: '/admin', policy: ['manageruser', 'createuser'] },
	{ path: '/auth/signup', policy: ['createuser'] },
	{ path: '/admin/users', policy: ['manageruser'] },
	{ path: '/api/users', policy: ['manageruser'] },
	{ path: '/api/players', policy: ['manageruser'] },
	{ path: '/api/news/createArticle', policy: ['writearticles'] },
];

const checkToken = (req, res, next) => {
	const token = req.cookies.JWT;
	if (token) {
		JWT.verify(token, process.env.JWT_SECRET, async (err, decodeToken) => {
			if (err) {
				res.locals.auth = false;
				next();
			}

			User.findById(decodeToken.id, (err, user) => {
				if (err || !user) {
					res.locals.auth = false;
					next();
				} else {
					res.locals.auth = true;
					res.locals.username = user.username;
					res.locals.userID = user._id;
					res.locals.isAdmin = user.policy.includes('administrator');
					res.locals.userPolicy = user.policy;
					next();
				}
			});
		});
	} else {
		res.locals.auth = false;
		next();
	}
};

// Check user permission
const requireAuth = (req, res, next) => {
	const { auth } = res.locals;
	if (auth) {
		next();
	} else {
		res.status(401).render('error', { title: '401', error: 'Unauthorized access!' });
	}
};

const requirePolicy = (req, res, next) => {
	const { userID, isAdmin, userPolicy } = res.locals;
	if (isAdmin) {
		next();
	} else {
		User.findById(userID, (err, user) => {
			if (err || !user)
				res.status(403).render('error', { title: '403', error: 'Forbidden access!' });

			const pagePolicy = pagesPolicy.find((p) => {
				return req.originalUrl == p.path;
			});

			if (pagePolicy.policy.some((p) => {
				return userPolicy.includes(p);
			})) {
				next();
			} else {
				res.status(403).render('error', { title: '403', error: 'Forbidden access!' });
			}
		});
	}
};

const requireAdmin = (req, res, next) => {
	const { auth, isAdmin } = res.locals;
	if (auth && isAdmin) {
		next();
	} else {
		res.status(401).render('error', { title: '401', error: 'Unauthorized access! Admin required!' });
	}
};

module.exports = {
	checkToken,
	requirePolicy,
	requireAuth,
	requireAdmin,
};
