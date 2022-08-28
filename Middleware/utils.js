const LogRequestsDev = (req, res, next) => {
	console.log(req.method, req.url, req.cookies, req.body);
	next();
};

const LogRequests = (req, res, next) => {
	console.log(req.method, req.url);
	next();
};

module.exports = {
	LogRequestsDev,
	LogRequests,
};
