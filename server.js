const express = require('express');
const server = express();

// ROUTES
const actionRouter = require('./data/helpers/actionRouter');
const projectRouter = require('./data/helpers/projectRouter');

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalURL} at ${new Date()}`);
  next();
}

server.use(logger);
server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<h1> Working! </h1>`);
});

module.exports = server;
