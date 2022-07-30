const express = require('express');
const app = express();

const LogRequests = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

app.use(LogRequests);

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(3000);