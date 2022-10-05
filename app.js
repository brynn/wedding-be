const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
module.exports = app;

// Enables parsing of POST request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('You found a server');
});

// Simple API key auth
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const apiKey = req.header('API-Key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
      res.status(401).json({error: 'Unauthorized'});
    } else {
      next();
    }
  });
}

app.use('/api', cors(), require('./api'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

app.listen(port, () =>
  console.log(`Andrew & Brynn's wedding website backend listening on ${port}!`),
);
