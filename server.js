const express = require('express');
const server = express();

server.use(express.json());
server.get('/', (req, res) => {
  res.send('<h2> Sprint Challenge Backend #1!!</h2>');
});
