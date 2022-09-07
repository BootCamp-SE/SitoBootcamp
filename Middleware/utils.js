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
		{tag: 'Mapc', name: 'Marinaio di Prima Classe'},
		{tag: 'Mas', name: 'Marinaio Scelto'},
		{tag: 'Ctc', name: 'Capo di 3° Classe'},
		{tag: 'Csc', name: 'Capo di 2° Classe'},
		{tag: 'Cpc', name: 'Capo di 1° Classe'},
		{tag: 'aGm', name: 'Aspirante Guardiamarina'},
		{tag: 'Gm', name: 'Guardiamarina'},
		{tag: 'Ten', name: 'Tenente'},
		{tag: 'TenCom', name: 'Tenente Comandante'},
		{tag: 'Com', name: 'Comandante'},
		{tag: 'Cap', name: 'Capitano'},
		{tag: 'Com', name: 'Commodoro'},
		{tag: 'VAmm', name: 'Vice Ammiraglio'},
		{tag: 'Amm', name: 'Ammiraglio'},
	];
	next();
};

const getSpecialization = (req, res, next) => {
	res.locals.specialization = [
		'Componentistica Navale',
		'Tattico',
		'Ingegnere',
		'Generico'
	];
	next();
};

const getCrews = (req, res, next) => {
	res.locals.crews = [
		'Carrier',
		'Horus',
		'Radeztky',
		'Endurance',
		'Componentistica Caccia',
	];
	next();
};

module.exports = {
	LogRequestsDev,
	LogRequests,
	getRanks,
	getSpecialization,
	getCrews,
};
