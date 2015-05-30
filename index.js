var express = require('express'),
    mongo = require('mongoskin'),
    app = express();

app.get('/', function(req, res)
{
  res.send('Hello World');
});

app.listen('3000');
