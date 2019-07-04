"use strict"
require('./config/config');

const path = require('path');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');

const api = require('./routers/api.router');

var port = process.env.PORT;
var app = express();
var server = http.createServer(app);

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  exposedHeaders: ['*'],
}

app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(cors(corsOptions));
app.use('/subtitles', express.static(path.join(__dirname, './subtitles')));

app.use('/api', api);


server.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
})