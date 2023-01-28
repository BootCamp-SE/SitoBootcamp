const crypto = require('crypto');

// Log requests
const LogRequestsDev = (req, res, next) => {
	console.log(req.method, req.url, req.cookies, req.body);
	next();
};

const LogRequests = (req, res, next) => {
	console.log(req.method, req.url);
	next();
};

// Create Nonce and CPS for headers
const generateNonce = (req, res, next) => {
	const nonce = crypto.randomBytes(16).toString('base64');
	const csp = `script-src 'nonce-${nonce}' 'strict-dynamic' https:; object-src 'none'; base-uri 'none';`;
	res.set('Content-Security-Policy', csp);
	res.locals.nonce = nonce;
	next();
};

// Set parameters for ejs rendering
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

const getSpecializations = (req, res, next) => {
	res.locals.specializations = [
		'Componentistica Navale',
		'Tattico',
		'Ingegnere',
		'Generico'
	];
	next();
};

const getPolicies = (req, res, next) => {
	res.locals.policies = [
		{id: 'administrator', text: 'Amministratore', nl: false},
		{id: 'createuser', text: 'Creazione Utenti', nl: false},
		{id: 'manageruser', text: 'Gestione Utenti', nl: true},
		{id: 'readreportsecret', text: 'Lettura Rapporti Secretati', nl: false},
		{id: 'readreport', text: 'Lettura Rapporti', nl: false},
		{id: 'writereport', text: 'Scrittura Rapporti', nl: false},
		{id: 'writearticles', text: 'Scrittura Articoli', nl: true},
		{id: 'writesafenet', text: 'Scrittura SafeNet', nl: false},
		{id: 'teacher', text: 'Insegnante Accademia', nl: false},
		{id: 'student', text: 'Studente Accademia', nl: false},
	];
	next();
};

// TODO: Move crews to DB
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
	generateNonce,
	getRanks,
	getSpecializations,
	getPolicies,
	getCrews,
};
