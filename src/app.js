'use strict'

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const errorHandler = require('./services/errorHandler-service');
const customErrorHandler = require('./services/customErrorHandler-service');
/// const customErrorHandler = require('./services/customErrorhandler-service');


// Models imports
const User = require('./models/user-model');
const Event = require('./models/event-model');

// Routes imports
const indexRoute = require('./routes/index-route');
const userRoute = require('./routes/user-route');
const eventRoute = require('./routes/event-route');

// App
const app = express();

// Router
const router = express.Router();

// BD
mongoose.connect(config.connectionString)

// =====

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
    next();
})


// Routes
app.use('/', indexRoute);
app.use('/users', userRoute);
// app.use('/events', eventRoute);

// Error handler
// console.log(typeof errorHandler)
// console.log(errorHandler)
app.use(customErrorHandler);
app.use(errorHandler);


module.exports = app;