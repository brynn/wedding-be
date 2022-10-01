const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use('/api', require('./api'));

app.get('/', (req, res) => res.type('html').send(html));

app.listen(port, () =>
  console.log(`Andrew & Brynn's wedding website backend listening on ${port}!`),
);

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Andrew & Brynn</title>
  </head>
  <body>
    <p>Wedding website server WHAT IS HAPPENING</p>
  </body>
</html>
`;
