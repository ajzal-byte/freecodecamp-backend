require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const isUrl = require('is-url');

// Basic Configuration
const port = process.env.PORT || 3000;
let counter = 0;
const shortendUrls = {};

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  //check if url if valid
  if (!isUrl(url)) {
    res.json({ error: 'invalid url'});
    return;
  }
  counter += 1;
  shortendUrls[counter] = url;
  res.json({ original_url: req.body.url, short_url: counter});
})

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const url = shortendUrls[id];
  res.redirect(url);
})

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
