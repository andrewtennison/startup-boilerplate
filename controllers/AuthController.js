
/**
 *  Auth Controller
 *  Created by create-controller script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/

var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'auth',
	passport = require('passport'),
  	FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
		clientID: '237429156359045',
		clientSecret: '47162acfe0016699b9b5c4eb6cada390',
		callbackURL: "http://dev.onside.me:3000/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findByFacebook( accessToken, profile, function(err, user){
				if (err) 	return done(err);
				if (!user)  return done(null, false, { message: 'Unknown user' });
			  	//if (!user.validPassword(password)) return done(null, false, { message: 'Invalid password' });
			  	user.accessToken = accessToken;
			  	if(user.isNew) return done(null, user, {message: 'New user'});
				return done(null, user);
			})
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	console.log(obj)
	done(null, obj);
	// User.findOne(id, function (err, user) {
    	// done(err, user);
	// });
	
});

module.exports = {

	indexFacebook : passport.authenticate('facebook', { scope: ['email','user_status', 'user_photos', 'user_activities', 'user_birthday', 'read_friendlists', 'publish_checkins', 'publish_stream'] }),

	callbackFacebook : passport.authenticate('facebook', { failureRedirect: '/login' }),
	
	callbackFacebookCallback : function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/home');
	}
};