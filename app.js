const express = require('express');
const app = express();
const NewEntriesRoutes = require('./routes/newEntriesRoutes');

const LogRequests = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000);

app.use(LogRequests);

app.get('/', (req, res) => {
    res.render('index', {title: "Home"});
});

app.use('/arruolati', NewEntriesRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});