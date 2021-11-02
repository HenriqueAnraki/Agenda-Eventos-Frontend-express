'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (erq, res, next) => {
    res.status(200).send({
        title: "Agenda de eventos API",
        version: "0.0.0"
    })
})

module.exports = router;