const express = require('express');
const server = express();

server.use(express.json());
server.get('/', (req, res) => {
  const queryParameters = req.query;
  res.status(200).json(queryParameters);
});

module.exports = server;
