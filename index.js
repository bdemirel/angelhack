var express = require('express'),
    app = express();

app.use('/auth/sign', require('./routes/login.js'));
app.use('/auth/create', require('./routes/add_user.js'));
app.use('/event/create', require('./routes/add_event.js'));
app.use('/event/list', require('./routes/list_events.js'));
app.use('/note/create', require('./routes/create_note.js'));
app.use('/note/list', require('./routes/list_note.js'));
app.use('/event/details', require('./routes/event_details.js'));
app.use('/debug', require('./routes/debug.js'));

app.listen('3000');
