var async = require('async'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	mongooseTypes = require("mongoose-types"),
	statusValues = require('../lib/statusValues');

mongooseTypes.loadTypes(mongoose);


var Email = mongoose.SchemaTypes.Email;

var Friends = new Schema({
	displayName : String, 
	status: {type: String, default: 'none'},
	uid: String
});

var Status = new Schema({
	scale : String,
	distance : String,
	time : String,
    geo: {
    	index:'2d',
    	//required: true,
    	type:[Number]
    },
    created: { type: Date, default: Date.now },
    expires: { type: Date},
    title: {type: String}
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
	photo: {type: String},
	
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
			
			if(!user) var user = new U();

			user.photo = 'http://graph.facebook.com/'+profile.username+'/picture';
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

			if (!newUser){
				//user.date.lastVisited = Date.now;
                user.visits += 1;
                user.isNew = false;
			};
			user.save(function(err) {
                if (err) throw err;
				return callback(null, user);
            });
		}
	});
});

function findInArray(arr, prop, value){
	var l = arr.length;
	while(l--){
		if(arr[l][prop] === value) return arr[l];
	}
	return false;
}

// Status = none / invite / invited / ignore / friend / block
User.static('updateFriendStatus', function(user, friendID, userStatus, friendStatus, callback){
	console.log('updateFriendStatus');
	var U = this;

	function checkStatus(curStatus){
		if(userStatus === 'invite' && curStatus !== 'none') return false;
		if(userStatus === 'invited' && ( curStatus !== 'friend' || curStatus !== 'ignor' )) return false;
		if(userStatus === 'friend' && curStatus !== 'block') return false;
		return true;
	};

	var Friend = findInArray(user.friends, 'id', friendID);
	( !Friend )? console.log('friend does not exit, add') : console.log('friend does exist');
	
	// Run Checks
	if( !Friend ) return callback('user is not in friends list' );

	async.parallel({
		updateUserList: function(onComp){ 
			console.log(':: updateFriendStatus => updateUserList');
			// Update + Save
			Friend.status = userStatus;		
			user.save(function(err){
				if(err) onComp( err );
				else onComp(null, Friend);
			});
		},
		updateFriendsList: function(onComp){
			console.log(':: updateFriendStatus => updateFriendsList');
			
			U.findById(friendID, function(err,doc){
				if(err) return onComp( err );
			
				var Friend = findInArray(doc.friends, 'id', user.id);
				( !Friend )? console.log('updateFriendsList > friend does not exit, add') : console.log('updateFriendsList > friend does exist');
				
				// if no friend, create + add
				var newUser = {
					displayName : user.displayName,
					status : friendStatus,
					_id : user.id
				};
				if( Friend ) {
					Friend.status = friendStatus;
				} else {
					doc.friends.push( newUser );
				}
				doc.save(function(err){
					console.log(':: updateFriendsList.save')
					if(err) onComp( err );
					else onComp(null, true)
				});
			});
			
		}
	}, function(err, result){
	    // results is now equals to: {one: 1, two: 2}
	    callback(err, result.updateUserList);
	});
});

User.pre('save', function(next){
	console.log('saving user ///////////////////////////// ')
	next();
});

var userModel = mongoose.model('User', User);

// Passport serialize / deserialize user session
var passport = require('passport');

passport.serializeUser(function(user, done) {
	console.log('passport.serializeUser: '+user.name+', id = ' + user.id);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('passport.deserializeUser id = ' + id);
	if( !id ) done('no users');
	userModel.findById(id, function (err, user) {
    	done(err, user);
	});
});

module.exports = userModel;


