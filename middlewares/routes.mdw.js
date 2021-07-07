module.exports = function(app) {
    app.get('/', function(req, res) {
        // res.send('<b>Hello</b> World!');
        res.render('home');
    });

    app.get('/about', function(req, res) {
        res.render('about');
    });

    app.get('/bs4', function(req, res) {
        res.sendFile(__dirname + '/bs4.html');
    });

    app.use('/account/', require('../controllers/account.route'));
<<<<<<< HEAD
    app.use('/products/', require('../controllers/article.route'));
    app.use('/mainpage/', require('../controllers/mainpage.route'));
=======
    app.use('/', require('../controllers/article.route'));
    app.use('/writer', require('../controllers/writer.route'));
>>>>>>> dev
}