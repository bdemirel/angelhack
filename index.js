var express = require('express'),
    app = express();

app.use('/auth/sign', require('./routes/login.js'));
app.use('/auth/create', require('./routes/add_user.js'));
app.use('/event/create', require('./routes/add_event.js'));
app.use('/event/list', require('./routes/list_event.js'));

app.listen('3000');
