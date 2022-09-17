const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use('/api', require('./api'));

app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Andrew & Brynn</title>
  </head>
  <body>
    <p>Wedding website server</p>
  </body>
</html>
`
