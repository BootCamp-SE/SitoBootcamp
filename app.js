require('dotenv').config({ path: './Config/.env' }); // Import and config of env vars using dotenv module

// Importing modules
const express = require('express');
const http = require('http');
const https = require('https');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

// Global Constants
const EnableHttpServer = process.env.HTTP | false;
const HttpPort = process.env.HTTP_PORT;
const HttpsPort = process.env.HTTPS_PORT;
const DEV = process.env.DEV | false;
if (DEV) console.log('Using developement mode!');
const PrivateKey = fs.readFileSync('./Config/key.pem');
const SSLCertificate = fs.readFileSync('./Config/cert.pem');

// Express Init
const app = express();
const utils = require('./Middleware/utils');
const auth = require('./Middleware/auth');
const AccademyRoutes = require('./routes/accademyRoutes');	// NOTE: Not urgent
const AdminRoutes = require('./routes/adminRoutes');
const ApiRoutes = require('./routes/apiRoutes');
const AuthRoutes = require('./routes/authRoutes');
const NewEntriesRoutes = require('./routes/newEntriesRoutes');	// TODO: Add content to pages
const NewsRoutes = require('./routes/newsRoutes');

// Middleware
app.set('view engine', 'ejs');
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(DEV ? utils.LogRequestsDev : utils.LogRequests);
app.use(auth.checkToken);
app.use(utils.generateNonce);

// Routes handling
app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});

app.use('/accademia', auth.requireAuth, auth.requirePolicy, AccademyRoutes);
app.use('/admin', auth.requireAuth, AdminRoutes);
app.use('/api', ApiRoutes);
app.use('/arruolati', NewEntriesRoutes);
app.use('/auth', AuthRoutes);
app.use('/news', NewsRoutes);

// Handling requests to not existing pages (aka error 404)
app.use((req, res) => {
	res.status(404).render('error', { title: '404', error: 'Page not found!' });
});

// Web server init
var HttpServer = http.createServer(app);
var HttpsServer = https.createServer(
	{
		key: PrivateKey,
		cert: SSLCertificate,
	},
	app
);

// Connecting to db and starting web server
console.log('Connecting to DB!');
mongoose.set('strictQuery', true);
mongoose
	.connect(process.env.DB_URI)
	.then(async () => {
		await auth.getRoutesPolicies();
		console.log('Connected with DB!\nStarting Web Server!');
		if (EnableHttpServer) {
			HttpServer.listen(HttpPort, () => {
				console.log(`Http server listening on port: ${HttpPort}`);
			});
		}
		HttpsServer.listen(HttpsPort, () => {
			console.log(`Https server listening on port: ${HttpsPort}`);
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

// Stopping web server gracefully
async function StopServer(signal) {
	console.log(`Recived ${signal}\nDisconnecting from database!`);
	HttpServer.closeAllConnections();
	HttpsServer.closeAllConnections();
	await mongoose.connection.close();
	console.log('Connection with DB closed!\nStopping web server!');
	HttpServer.close(() => {
		console.log('Http server stopped!');
		HttpsServer.close(() => {
			console.log('Https server stopped!\nExiting process!');
			process.exit(0);
		});
	});
}

process.on('SIGINT', StopServer);
process.on('SIGTERM', StopServer);
process.on('SIGQUIT', StopServer);
