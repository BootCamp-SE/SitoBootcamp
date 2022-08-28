const LogRequestsDev = (req, res, next) => {
	console.log(req.method, req.url, req.cookies, req.body);
	next();
};

const LogRequests = (req, res, next) => {
	console.log(req.method, req.url);
	next();
};

const getRanks = (req, res, next) => {
	res.locals.ranks = [
		{tag: 'Rec', name: 'Recluta'},
		{tag: 'Mar', name: 'Marinaio'},
		{tag: 'Cpc', name: 'Capo di 1° Classe'},
		{tag: 'Gm', name: 'Guardiamarina'},
		{tag: 'Ten', name: 'Tenente'},
		{tag: 'VAmm', name: 'Vice Ammiraglio'},
	];
	next();
};

const getSpecialization = (req, res, next) => {
	res.locals.specialization = [
		'Componentistica Navale',
		'Tattico',
		'Ingegnere',
	];
	next();
};

module.exports = {
	LogRequestsDev,
	LogRequests,
	getRanks,
	getSpecialization,
};
