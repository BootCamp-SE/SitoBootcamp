const express = require('express');
const app = express();
const NewEntriesRoutes = require('./routes/newEntriesRoutes');
const NewsRoutes = require('./routes/newsRoutes');
const AccademyRoutes = require('./routes/accademyRoutes');

const path = require("path"); // Require local path

const LogRequests = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

app.set('view engine', 'ejs');



app.listen(3000);

app.use(LogRequests);

app.get('/', (req, res) => {
    res.render('index', {title: "Home"});
});

app.use('/arruolati', NewEntriesRoutes);
app.use('/news', NewsRoutes);
app.use('/accademia', AccademyRoutes);

// Generate absolute path to static file
app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/arruolati', express.static(path.join(__dirname + '/public')));
app.use('/news', express.static(path.join(__dirname + '/public')));
app.use('/accademia', express.static(path.join(__dirname + '/public')));

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});