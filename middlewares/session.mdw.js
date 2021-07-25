const session = require('express-session');
const passport = require('passport');

module.exports = function(app) {
    app.set('trust proxy', 1);
    app.use(session({
        secret: 'wBh7x5P3ETm72JgMqRWn',
        resave: false,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}