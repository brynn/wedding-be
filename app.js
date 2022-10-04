const {apiKeyAuth} = require('@vpriem/express-api-key-auth');

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
module.exports = app;

// Enables parsing of POST request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Simple API key auth
if (process.env.NODE_ENV === 'production') {
  console.log('API KEY: ', process.env.API_KEY);
  app.use(apiKeyAuth(/^API_KEY/));
}

app.get('/', (req, res) => {
  res.send('You found a server');
});
app.use('/api', cors(), require('./api'));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

app.listen(port, () =>
  console.log(`Andrew & Brynn's wedding website backend listening on ${port}!`),
);
