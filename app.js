const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.use(express.urlencoded({
    extended: true
}));

app.use('/public', express.static('public'))
app.use('/utils', express.static('utils'))

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw.js')(app);
const schedule = require('./middlewares/schedule.mdw')
setInterval(schedule.updateState, 60000)

const PORT = 3000;

app.listen(PORT, function() {
    console.log(`News listening at http://localhost:${PORT}`);
});