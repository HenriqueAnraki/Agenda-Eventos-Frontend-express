'use strict'

const express = require('express');

const app = express();

app.get('/', (req, res) => {
res.status(200).send({ data: 'Hello World!' })
})


module.exports = app;