const express = require('express');
const server = express();

// ROUTES
const actionRouter = require('./data/helpers/actionRouter');
const projectRouter = require('./data/helpers/projectRouter');

server.use(express.json());

server.use('/api/actions/', actionRouter);
server.use('/api/projects/', projectRouter);

server.get('/', (req, res) => {
  res.send(`<h1> Working! </h1>`);
});

module.exports = server;
