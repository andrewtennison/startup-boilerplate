
/**
 *  Auth Controller
 **/

var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'auth',
	passport = require('passport'),
  	FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
		clientID: '237429156359045',
		clientSecret: '47162acfe0016699b9b5c4eb6cada390',
		callbackURL: 'http://dev.onside.me:3000/auth/facebook/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			console.log('findByFacebook called - ' + accessToken)
			User.findByFacebook( accessToken, profile, function(err, user){
				console.log('findByFacebook returned')
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
	console.log('passport.serializeUser id = ' + user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('passport.deserializeUser id = ' + id);
	User.findOne(id, function (err, user) {
    	done(err, user);
	});
});

module.exports = {

	indexFacebook : passport.authenticate('facebook', { scope: ['email', 'user_status', 'user_photos', 'user_activities', 'user_birthday', 'read_friendlists', 'publish_checkins', 'publish_stream'] }),

	callbackFacebook : passport.authenticate('facebook', { failureRedirect: '/login' }),
	
	callbackFacebookCallback : function(req, res) {
		// Successful authentication, redirect home.
		console.log('//////////////// facebook callback on complete ')
		console.log('is user new, could redirect somewhere else? - ' + req.user.isNew)
		res.redirect('/home');
	}
};



