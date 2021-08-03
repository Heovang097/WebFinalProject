const passport = require('passport');
const express = require('express');
const router = express.Router();

const Config = require('../utils/config');
router.get('/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		prompt: 'select_account'
	})
);

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/account/login' }),
//   function(req, res) {
//     console.log('success');
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

router.get('/google/callback',
	passport.authenticate('google'),
	function (req, res) {
		// res.send(req.user);
		const user = req.user;
		switch (user.Permission) {
			case Config.PERMISSION.EDITOR:
				req.session.isEditor = true;
				break;
			case Config.PERMISSION.ADMIN:
				req.session.isAdmin = true;
				break;
		}

		req.session.isWriter = (user.PenName != null);
		req.session.auth = true;
		req.session.authUser = req.user;
		const url = req.session.retUrl || '/';
		console.log(url);
		res.redirect(url);
	}
);

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
	passport.authenticate('facebook'),
	function (req, res) {
		// res.send(req.user);
		const user = req.user;
		switch (user.Permission) {
			case Config.PERMISSION.EDITOR:
				req.session.isEditor = true;
				break;
			case Config.PERMISSION.ADMIN:
				req.session.isAdmin = true;
				break;
		}

		req.session.isWriter = (user.PenName != null);
		req.session.auth = true;
		req.session.authUser = req.user;
		const url = req.session.retUrl || '/';
		console.log(url);
		res.redirect(url);
	}
);

router.get('/github', passport.authenticate('github' ,
			{ scope: [ 'user:email' ],
			prompt: 'select_account'}));

router.get('/github/callback',
	passport.authenticate('github'),
	function (req, res) {
		// res.send(req.user);
		const user = req.user;
		switch (user.Permission) {
			case Config.PERMISSION.EDITOR:
				req.session.isEditor = true;
				break;
			case Config.PERMISSION.ADMIN:
				req.session.isAdmin = true;
				break;
		}

		req.session.isWriter = (user.PenName != null);
		req.session.auth = true;
		req.session.authUser = req.user;
		const url = req.session.retUrl || '/';
		console.log(url);
		res.redirect(url);
	}
);
module.exports = router;