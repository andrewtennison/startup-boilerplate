var async = require('async'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	mongooseTypes = require("mongoose-types"),
	request = require('request'),
	statusValues = require('../lib/statusValues'),
	_ = require('underscore')._;


mongooseTypes.loadTypes(mongoose);

var Email = mongoose.SchemaTypes.Email;

// var FriendSchema = new Schema({
// 	_friend: { type: Schema.ObjectId, ref: 'userModel' },
// 	rel: {type: String, default: 'none'},
// 	fb_uid: String
// });

/*

friends > get FB list
- get update user.fb_friends[];

friends > find New
- get users facebook friends
- search against users
	- return all
- loop through, if existing friend ignor else add to list

firends > get Status


user.friends = [{id > get user / relation}]
user.relations = [{id/status}]

*/

var User = new Schema({
	// eMail address
	email: { type: Email, unique: true },
	date: {
		created: { type: Date, default: Date.now },
		lastVisited: { type: Date, default: Date.now }
	},

	displayName: { type: String },
	gender: {type: String},
	photo: {type: String},
	
	// Facebook	
	fb_uid: {type:String, unique: true, index: true},
	fb: {},
	fb_friends: [],
	fb_accessToken: { type: String },
	
	_friends: [{ type: Schema.ObjectId, ref: 'User', unique:true }],
	relationships: {type: String},

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
	    created: { type: Date },
	    expires: { type: Date},
	    title: {type: String}
	}
}); 


/*
 to reg new user, return error + set message, pick up and redirect to register passing in info to pre fill
*/

User.static('getFacebookFriends', function(user, Callback){
	console.log('getFacebookFriends');
	// get facebook friends from FB.API
	var Model = this,
		url = 'https://graph.facebook.com/' + user.fb.username + '/friends?access_token=' + user.fb_accessToken;

	request({url:url, json:true}, function (error, response, json) {
		if (!error && response.statusCode == 200) {
			console.log('facebook friends JSON')
			var FB_arr = _.pluck(json.data, 'id');
			user.fb_friends = FB_arr;
			Callback(FB_arr)

		}else{
			console.log('User.findByFacebook.getFriends');
			Callback(error);
		}	
	})
});

User.static('synFriendsList', function(reqUser, callback){
	console.log('synFriendsList');

	var Model = this;

	// Model.getFacebookFriends(reqUser, function( fb_friends ){
	// 	reqUser.fb_friends = fb_friends;
		var fb_friends = reqUser.fb_friends;

		var friendIds = _.pluck(reqUser.friends, '_id'),
			diff = _.without(fb_friends, friendIds);

		Model
		.where('fb_uid').in(fb_friends)
		.where('_id').in(friendIds)
		.select('displayName fb_uid')
		.run(function(err, docs){
			console.log('Get Matching Users from FB_UID');

			docs.forEach(function(doc){ reqUser._friends.push(doc._id) });

			reqUser.save(function(error){
				console.log('synFriendsList.save');
				if(error) console.log(error);

				Model.populateFriends(reqUser, function(user){
					callback(user);
				})
			})
		}) // END run 
	// }) // END getFacebookFriends
});


User.static('populateFriends', function(reqUser, callback){
	// compare user.fb_friends against users in DB + compare with friends list
	// run populate on friends list to update details
	var Model = this;

	Model
	.findById(reqUser)
	.populate('_friends', ['status', 'displayName', 'fb_uid', 'photo'])
	.run(function (err, user) {
		console.log('user populated')
		callback(user)
	})
});


User.static('findByFacebook', function (accessToken, profile, Callback) {
	console.log('User.findByFacebook');

	var U = this;
	U.findOne({ fb_uid: profile.id }, function(err, user) {
		// check if user exists, create if not
		var newUser = (!user)? true : false; 
		var user =  user || new U();

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
		user.save(function(err) {
			console.log('User.findByFacebook.save')
			return Callback(err, user);
        });
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

// change to updateRelationship
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

User.static('getFriendsStatus', function(user, callback){
	var friends = user.friends;
	var relations = user.relationships;
	
	// populate friends
	// apply relationship status to friend
	// return
	
})

User.pre('save', function(next){
	console.log('saving user ///////////////////////////// ')
	next();
});

var userModel = mongoose.model('User', User);
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


