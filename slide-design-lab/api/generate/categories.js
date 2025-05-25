const express = require('express');
const slideGeneration = require('../../backend/routes/slideGeneration');

const app = express();
app.use(express.json());
app.use('/', slideGeneration);

module.exports = app;