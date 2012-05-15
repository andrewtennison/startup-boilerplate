
/**
 *	Login Controller
 *	Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	ViewTemplatePath = 'login',
	User = mongoose.model('User'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var users = [
	{ id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
	{ id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
	console.log('findById')
	var idx = id - 1;
	if (users[idx]) {
		fn(null, users[idx]);
	} else {
		fn(new Error('User ' + id + ' does not exist'));
	}
}

function findByUsername(username, fn) {
	console.log('findByUsername')
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

// Simple route middleware to ensure user is authenticated.
//	 Use this route middleware on any resource that needs to be protected.	If
//	 the request is authenticated (typically via a persistent login session),
//	 the request will proceed.	Otherwise, the user will be redirected to the
//	 login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}

// Passport session setup.
//	 To support persistent login sessions, Passport needs to be able to
//	 serialize users into and deserialize users out of the session.	Typically,
//	 this will be as simple as storing the user ID when serializing, and finding
//	 the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});


// Use the LocalStrategy within Passport.
//	 Strategies in passport require a `verify` function, which accept
//	 credentials (in this case, a username and password), and invoke a callback
//	 with a user object.	In the real world, this would query a database;
//	 however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('passport.use.init')
		// asynchronous verification, for effect...
		process.nextTick(function () {
			
			// Find the user by username.	If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message.	Otherwise, return the
			// authenticated `user`.
			findByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unkown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
			})
		});
	}
));




module.exports = {

	init: function(params) {
		console.log('LoginController.init')
		ViewTemplatePath = params.viewPath	 // Enable over-ride of view path for testing
	},
	
	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		console.log('LoginController.index')
		res.render(ViewTemplatePath, { user: req.user, message: req.flash('error') });
	},
	create: function(req, res, next){
		console.log('LoginController.create');


		passport.authenticate('local', function(err, user, info) {
			console.log(err)
			console.log(user)
			console.log(info)
			
			if (err) { return next(err) }
			if (!user) {
				req.flash('error', info.message);
				return res.redirect('/login')
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/users/' + user.username);
			});
		})(req, res, next);

		// passport.authenticate('local', {
			// failureRedirect: '/login', 
			// failureFlash: true 
		// }),function(req, res) {
			// res.redirect('/');
		// };
	}
};





