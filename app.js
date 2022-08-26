require('dotenv').config(); // Import and config of env vars using dotenv module

// Importing modules
const express = require('express');
const path = require('path');

// Global Constants
const Port = process.env.PORT | 3000;

// Express Init
const app = express();
const NewEntriesRoutes = require('./routes/newEntriesRoutes');
const NewsRoutes = require('./routes/newsRoutes');
const AccademyRoutes = require('./routes/accademyRoutes');

// Middleware
const LogRequests = (req, res, next) => {
	console.log(req.method, req.url);
	next();
};

app.set('view engine', 'ejs');
app.use(LogRequests);
app.use('/', express.static(path.join(__dirname + '/public')));

// Starting web server
const server = app.listen(Port, () => {
	console.log(`Server listening on port: ${Port}`);
});

// Routes handling
app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});

app.use('/arruolati', NewEntriesRoutes);
app.use('/news', NewsRoutes);
app.use('/accademia', AccademyRoutes);

// Handling requests to not existing pages (aka error 404)
app.use((req, res) => {
	res.status(404).render('404', { title: '404' });
});

// Stopping web server gracefully
function StopServer(signal) {
	console.log(`Recived ${signal}\nStopping web server!`);
	server.closeAllConnections();
	server.close(() => {
		console.log('Web server stopped!\nExiting process!');
		process.exit(0);
	});
}

process.on('SIGINT', StopServer);
process.on('SIGTERM', StopServer);
process.on('SIGQUIT', StopServer);
