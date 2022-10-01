const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
module.exports = app;

// Enables parsing of POST request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', cors(), require('./api'));

app.listen(port, () =>
  console.log(`Andrew & Brynn's wedding website backend listening on ${port}!`),
);
