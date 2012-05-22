var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	mongooseTypes = require("mongoose-types");

mongooseTypes.loadTypes(mongoose);


var Email = mongoose.SchemaTypes.Email;

var Friends = new Schema({name : String});

var Status = new Schema({
	scale : String,
	distance : String,
	time : String,
    geo: {
    	index:'2d',
    	//required: true,
    	type:[Number]
    },
    created: { type: Date, default: Date.now }
});

var User = new Schema({
	// eMail address
	email: { type: Email, unique: true },
	date: {
		created: { type: Date, default: Date.now },
		lastVisited: { type: Date, default: Date.now }
	},

	// Name
	name: {
		first: { type: String, required: true },
		last: { type: String, required: true }
	},
	displayName: { type: String },
	gender: {type: String},
	
	// Facebook	
	fb_uid: {type:String, unique: true, index: true},
	fb: {},
	fb_friends: {},
	fb_accessToken: { type: String },
	
	friends: [Friends],
	visits: {type: Number, default: 0},
	isNew: {type: Boolean, default: true},
	
	status:[Status] // array of obj { scale:'', distance:'', time:'', end:'calc endTime as time + scale' }
});


/*
 to reg new user, return error + set message, pick up and redirect to register passing in info to pre fill
*/
User.static('findByFacebook', function (accessToken, profile, callback) {
	console.log('findByFacebook');

	var U = this;

	U.findOne({ fb_uid: profile.id }, function(err, user) {
		if (err){
			console.log('user error')
			return callback(err);
		}else{
			var newUser = (!user)? true : false; 
			
			if(!user) user = new U();

			user.fb_accessToken = accessToken;
			user.fb_uid = profile.id;
			user.fb = profile._json;
			user.email = (profile.emails && profile.emails[0])? profile.emails[0].value : false;
			user.displayName = profile.displayName;
			user.name = {
				first: profile.name.givenName,
				last: profile.name.familyName
			};
			user.gender = profile.gender;
			//user.date.lastVisited = Date.now;
			console.log('findByFacebook 3');

			if (newUser){
				user.save(function(err) {
	                if (err) throw err;
					return callback(null, user);
	            });
			}else{
                user.visits += 1;
                user.isNew = false;
				user.save(function(err) {
	                if (err) throw err;
					return callback(null, user);
	            });
			}
		}
	});
});

// pre fetch, if user not self, return limited info
User.pre('save', function(next){
	next();
});

// check if status already exists, possibly remove old
User.pre('save', function(next){
	next();
});

module.exports = mongoose.model('User', User);

// Passport serialize / deserialize user session
var UserModel = mongoose.model('User'),
	passport = require('passport');

passport.serializeUser(function(user, done) {
	console.log('passport.serializeUser id = ' + user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('passport.deserializeUser id = ' + id);
	UserModel.findOne(id, function (err, user) {
    	done(err, user);
	});
});

