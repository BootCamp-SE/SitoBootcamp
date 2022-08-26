const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
	res.render('accademy/home', {title: 'Home Accademia Navale'});
});

router.get('/ingegneria', (req, res) => {
	res.render('accademy/ingegneria', {title: 'Dispense Ingegneri'});
});

router.get('/militare', (req, res) => {
	res.render('accademy/militare', {title: 'Dispense Militari'});
});

router.get('/tattica', (req, res) => {
	res.render('accademy/tattica', {title: 'Dispense Tattici'});
});

router.get('/scripts', (req, res) => {
	res.render('accademy/scripts', {title: 'Dispense Script'});
});

router.get('/varie', (req, res) => {
	res.render('accademy/others', {title: 'Dispense Varie'});
});

module.exports = router;