const JWT = require('jsonwebtoken');
const User = require('../Models/user');
const RoutePolicy = require('../Models/routePolicy');

var pagesPolicy = [];

const getRoutesPolicies = async () => {
	RoutePolicy.find({}, {_id: 0})
		.then(res => {
			pagesPolicy = res;
		})
		.catch(err => {
			console.error(err);
		});
};

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
					res.locals.isAdmin = user.policies.includes('administrator');
					res.locals.userPolicies = user.policies;
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
	const { userID, isAdmin, userPolicies } = res.locals;
	if (isAdmin) {
		next();
	} else {
		User.findById(userID, (err, user) => {
			if (err || !user)
				res.status(403).render('error', { title: '403', error: 'Forbidden access!' });

			const pagePolicies = pagesPolicy.find((p) => {
				return req.originalUrl == p.route;
			});

			if (pagePolicies.policies.some((p) => {
				return userPolicies.includes(p);
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
	getRoutesPolicies,
	checkToken,
	requirePolicy,
	requireAuth,
	requireAdmin,
};
