const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('newEntries/form', {title: "Modulo Iscrizione"});
});

router.get('/faq', (req, res) => {
    res.render('newEntries/faq', {title: "FAQ"});
});

router.get('/regolamento', (req, res) => {
    res.render('newEntries/regolamento.ejs', {title: "Regolamento"});
});

router.get('/progetto', (req, res) => {
    res.render('newEntries/progetto', {title: "Il Progetto"});
});

module.exports = router;