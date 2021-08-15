
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const keys = require('../key');
const userModel = require('../models/user.model');

module.exports = function () {
	passport.use(
		new GoogleStrategy(
			{
				clientID: keys.googleClientID,
				clientSecret: keys.googleClientSecret,
				callbackURL: '/auth/google/callback',
			},
	
			async (accessToken, refreshToken, profile, done) => {
				console.log('pp callback function fired');
				console.log(profile);
				//check if exist user in db
				const existUser = await userModel.findByUsername(profile.id);
				if (existUser == null){
					// Add new user into db
					const user = {
						Username: profile.id,
						// Password: ,
						// DOB: dob,
						Name: profile.displayName,
						Email: profile.emails[0].value,
						Permission: 0,
						Avatar: profile.photos[0].value,
					}
					await userModel.add(user);
					done(null, user);
				}
				else {
					done(null, existUser);
					console.log("User already exist");
				}
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: keys.fbClientID,
				clientSecret: keys.fbClientSecret,
				callbackURL: 'https://localhost:3000/auth/facebook/callback',
			},
	
			async (accessToken, refreshToken, profile, done) => {
				console.log('facebook callback function fired');
				console.log(profile);
				//check if exist user in db
				// const existUser = await userModel.findByUsername(profile.id);
				// if (existUser == null){
				// 	// Add new user into db
				// 	const user = {
				// 		Username: profile.id,
				// 		// Password: ,
				// 		// DOB: dob,
				// 		Name: profile.displayName,
				// 		Email: profile.emails[0].value,
				// 		Permission: 0,
				// 		Avatar: profile.photos[0].value,
				// 	}
				// 	await userModel.add(user);
				// 	done(null, user);
				// }
				// else {
				// 	done(null, existUser);
				// 	console.log("User already exist");
				// }
			}
		)
	);

	passport.use(
		new GithubStrategy(
			{
				clientID: keys.githubClientID,
				clientSecret: keys.githubClientSecret,
				callbackURL: '/auth/github/callback',
			},
	
			async (accessToken, refreshToken, profile, done) => {
				console.log('Github callback function fired');
				console.log(profile);
				//check if exist user in db
				const existUser = await userModel.findByUsername(profile.id);
				if (existUser == null){
					// Add new user into db
					const user = {
						Username: profile.id,
						// Password: ,
						// DOB: dob,
						Name: profile.displayName || '',
						// Email: profile.emails[0].value || '',
						Permission: 0,
						Avatar: profile.photos[0].value,
					}
					await userModel.add(user);
					done(null, user);
				}
				else {
					done(null, existUser);
					console.log("User already exist");
				}
			}
		)
	);

	passport.serializeUser(function(user, done){
		done(null, user.Username);
	});
	passport.deserializeUser(async function(id, done){
		const existUser = await userModel.findByUsername(id);
		done(null, existUser);
	})
}