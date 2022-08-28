const JWT = require('jsonwebtoken');
const User = require('../Models/user');

const pagesPolicy = [
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
];

const checkToken = (req, res, next) => {
	const token = req.cookies.JWT;
	if (token) {
		JWT.verify(token, process.env.JWT_SECRET, async (err, decodeToken) => {
			if (err) {
				res.locals.auth = false;
				next();
			}

			User.findById(decodeToken.id, (err, doc) => {
				if (err || doc._id == null) {
					res.locals.auth = false;
					next();
				} else {
					res.locals.auth = true;
					res.locals.userID = doc._id;
					res.locals.user = doc.username;
					res.locals.isAdmin = doc.policy.includes('administrator');
					res.locals.userPolicy = doc.policy;
					next();
				}
			});
		});
	} else {
		res.locals.auth = false;
		next();
	}
	// res.locals.auth = true;
	// res.locals.isAdmin = true;
	// res.locals.user = 'temp';
	// next();
};

const requirePolicy = (req, res, next) => {
	const { userID, isAdmin, userPolicy } = res.locals;
	User.findById(userID, (err, doc) => {
		if (err)
			res
				.status(401)
				.render('error', { title: '401', error: 'Unauthorized access!' });

		if (isAdmin) {
			next();
		} else {
			const pagePolicy = pagesPolicy.find((p) => {
				// console.log(req.originalUrl, p.path, req.originalUrl == p.path);
				return req.originalUrl == p.path;
			});

			if (
				pagePolicy.policy.some((p) => {
					return userPolicy.includes(p);
				})
			) {
				next();
			} else {
				res
					.status(401)
					.render('error', { title: '401', error: 'Unauthorized access!' });
			}
		}
	});
	// next();
};

const requireAuth = (req, res, next) => {
	const { auth } = res.locals;
	if (auth) {
		next();
	} else {
		res
			.status(401)
			.render('error', { title: '401', error: 'Unauthorized access!' });
	}
};

const requireAdmin = (req, res, next) => {
	const { auth, isAdmin } = res.locals;
	if (auth && isAdmin) {
		next();
	} else {
		res
			.status(401)
			.render('error', { title: '401', error: 'Unauthorized access!' });
	}
};

module.exports = {
	checkToken,
	requirePolicy,
	requireAuth,
	requireAdmin,
};
