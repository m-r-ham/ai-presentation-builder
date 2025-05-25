const express = require('express');
const trainingData = require('../../backend/routes/trainingData');

const app = express();
app.use(express.json());
app.use('/', trainingData);

module.exports = app;