const express = require('express');
const app = express();

const rotaProdutos = require('./routes/produtos');

app.use('/produtos', rotaProdutos);


module.exports = app;