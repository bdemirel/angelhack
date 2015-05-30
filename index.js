var express = require('express'),
    app = express();

app.use('/auth/sign', require('.routes/login.js'));
app.use('/auth/create', require('.routes/add_user.js'));

app.listen('3000');
