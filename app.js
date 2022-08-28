require('dotenv').config({ path: './Config/.env' }); // Import and config of env vars using dotenv module

// Importing modules
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

// Global Constants
const Port = process.env.PORT | 3000;
const DEV = process.env.DEV | false;
if (DEV) console.log('Using developement mode!');

// Express Init
const app = express();
const utils = require('./Middleware/utils');
const checkAuth = require('./Middleware/auth');
const NewEntriesRoutes = require('./routes/newEntriesRoutes');
const NewsRoutes = require('./routes/newsRoutes');
const AccademyRoutes = require('./routes/accademyRoutes');
const AuthRoutes = require('./routes/authRoutes');
const ApiRoutes = require('./routes/apiRoutes');

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(DEV ? utils.LogRequestsDev : utils.LogRequests);
app.use(checkAuth.checkToken);

// Connecting to db and starting web server
var server;
mongoose.connect(process.env.DB_URI).then(() => {
	console.log('Connected with DB!');
	server = app.listen(Port, () => {
		console.log(`Server listening on port: ${Port}`);
	});
});

// Routes handling
app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});

app.use('/arruolati', NewEntriesRoutes);
app.use('/news', NewsRoutes);
app.use('/accademia', checkAuth.requireAuth, AccademyRoutes);
app.use('/auth', AuthRoutes);
app.use('/api', ApiRoutes);

// Handling requests to not existing pages (aka error 404)
app.use((req, res) => {
	res.status(404).render('404', { title: '404' });
});

// Stopping web server gracefully
async function StopServer(signal) {
	console.log(`Recived ${signal}\nDisconnecting from database!`);
	server.closeAllConnections();
	await mongoose.connection.close();
	console.log('Connection with DB closed!\nStopping web server!');
	server.close(() => {
		console.log('Web server stopped!\nExiting process!');
		process.exit(0);
	});
}

process.on('SIGINT', StopServer);
process.on('SIGTERM', StopServer);
process.on('SIGQUIT', StopServer);
