const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('config');

const port = config.get('PORT');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('Hello World')
});

if (!process.env.NODE_ENV) {
  const localtunnel = require('localtunnel');
  const options = { subdomain: 'tickertracker' }

  const tunnel = localtunnel(port, options, (err, tunnel) => {
    if (err) {
      console.log(err);
      tunnel();
    }
      tunnel.url
      console.log(`LocalTunnel up at ${tunnel.url}`);
  });
}

require('./db/db.js');
require('./bot');

app.listen(port, () => console.log(`Listening on port ${port}`));
