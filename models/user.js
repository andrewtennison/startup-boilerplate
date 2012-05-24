var async = require('async'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	mongooseTypes = require("mongoose-types");

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
			
			if(!user) var user = new U();

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
		console.log(arr[l][prop] +' // '+value)
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
	
	function updateUserList(){
		console.log(':: updateFriendStatus => updateUserList');
		// Update + Save
		Friend.status = userStatus;		
		user.save(function(err){
			if(err) return callback( err );
			return callback(null, Friend);
		});
	};
	
	function updateFriendsList(f){
		console.log(':: updateFriendStatus => updateFriendsList');
		U.findById(friendID, function(err,doc){
			if(err) return callback( err );
		
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
				if(err) return callback( err );
				f();
			});
		});
	}

	// Find friend
	var Friend = findInArray(user.friends, 'id', friendID);
	
	( !Friend )? console.log('friend does not exit, add') : console.log('friend does exist');
	
	// Run Checks
	if( !Friend ) return callback('user is not in friends list' );
	//if( !checkStatus(Friend.status) ) return callback('status update not allowed');

	// Update friends object first, on success update req.user
	console.log(':: updateFriendStatus => run funcs');
	updateFriendsList(function(){
		updateUserList();
	});

});

Status.pre('save', function(next){
	console.log('saving status ///////////////////////////// ')
	var errors = [];
	if( this.scale === '0') errors.push('Please choose a scale');
	if( this.distance === '0') errors.push('Please choose a distance');
	if( this.time === '0') errors.push('Please choose a time');

	(errors.length == 0)
		? next()
		: next(new Error('status broken'));
});

User.pre('save', function(next){
	console.log('saving user ///////////////////////////// ')
	next();
})

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


