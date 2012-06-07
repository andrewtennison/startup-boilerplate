var async = require('async'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	mongooseTypes = require("mongoose-types"),
	request = require('request'),
	statusValues = require('../lib/statusValues');

mongooseTypes.loadTypes(mongoose);


var Email = mongoose.SchemaTypes.Email;

var Friends = new Schema({
	displayName : String, 
	friendStatus: {type: String, default: 'none'},
	uid: String,
	fb_uid: String
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
	
	status:{
		scale : String,
		distance : String,
		time : String,
	    geo: {
	    	index:'2d',
	    	type:[Number]
	    },
	    created: { type: Date, default: Date.now },
	    expires: { type: Date},
	    title: {type: String}
	}
});


/*
 to reg new user, return error + set message, pick up and redirect to register passing in info to pre fill
*/


User.static('findByFacebook', function (accessToken, profile, Callback) {
	console.log('User.findByFacebook');

	var U = this;
	// U.findOne({ fb_uid: profile.id }, function(err, user) {
		// Callback(err, user)
	// });
	// return;
	
	async.parallel({
		findUser: function(callback){
			console.log('User.findByFacebook.findUser');
			U.findOne({ fb_uid: profile.id }, function(err, user) {
				callback(err, user)
			});
		},
		getFriends: function(callback){
			console.log('User.findByFacebook.getFriends');
			var url = 'https://graph.facebook.com/' + profile._json.username + '/friends?access_token=' + accessToken;
			request({url:url, json:true}, function (error, response, json) {
				if (!error && response.statusCode == 200) {
					console.log('facebook friends JSON')
					
					var arr = [],
						l = json.data.length,
						query = U.find({});

					while(l--) arr.push(json.data[l].id);
					
					query
					.in('fb_uid', arr)
					.sort('status.expires', -1)
					.select('displayName fb_uid name status')
					.exec(function(err,docs){
						console.log(docs)
						callback(null, docs)
					})
				}else{
					callback(error);
				}	
			})
		}
	}, function(err, result){
		console.log('User.findByFacebook.oncomplete');

		if(err) return Callback(err);

		// check if user exists, create if not
		var newUser = (!result.findUser)? true : false; 
		var user = result.findUser || new U();

		// Set user values
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

		result.getFriends.forEach(function(doc){
			var add = true;
			user.friends.forEach(function(friend,index){
				// if facebook user is friend, update existing user else add to list
				if(friend.id === doc.id) {
					console.log(doc.displayName + ' is already friend / - i = ' + index);
					add = false;
					user.friends[index] = doc;
				}
			});
			doc.uid = doc.id;
			if(add) user.friends.push( doc );
		});
		
		user.save(function(err) {
			return Callback(err, user);
        });
	})
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
	
	console.log(user.friends)
	console.log('friendID = ' + friendID)
	console.log('userStatus = ' + userStatus)
	console.log('friendStatus = ' + friendStatus)
	
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
			Friend.friendStatus = userStatus;		
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
					friendStatus : friendStatus,
					_id : user.id
				};
				if( Friend ) {
					Friend.friendStatus = friendStatus;
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


