var express = require('express'),
    app = express();

app.use('/auth/sign', require('.routes/login.js'));

app.listen('3000');
