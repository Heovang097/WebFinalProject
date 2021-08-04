module.exports = function (app) {
    app.get('/', function (req, res) {
        // res.send('<b>Hello</b> World!');
        res.redirect('/mainpage')
    });
    app.get('/404', function (req, res) {
        res.sendFile('404.html')
    });


    app.use('/account', require('../controllers/account.route'));
    app.use('/mainpage', require('../controllers/mainpage.route'));
    app.use('/article', require('../controllers/article.route'));
    app.use('/writer', require('../controllers/writer.route'));
    app.use('/editor', require('../controllers/editor.route'));
    app.use('/admin', require('../controllers/admin.route'));
    app.use('/comment', require('../controllers/comment.route'));
    app.use('/api', require('../controllers/api.route'));
    app.use('/auth', require('../controllers/auth.route'));
    app.use('/tags', require('../controllers/tags.route'));
    app.use('/search', require('../controllers/search.route'));


}