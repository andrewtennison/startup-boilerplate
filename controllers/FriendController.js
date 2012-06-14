
/**
 *  Friends Controller
 *  Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'friend',
	request = require('request'),
	async = require('async'),
	bayeux = require('../utils/faye');


module.exports = {

	init: function(params) {
		console.log('FriendController.init')
		ViewTemplatePath = params.viewPath   // Enable over-ride of view path for testing
	},
	
	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		console.log('FriendController.index')
		if( !req.user ) return res.redirect('/');

		// function groupFriends(arr){
		// 	if(!arr) return {};
		// 	var l = arr.length,
		// 		obj = {};
				
		// 	while(l--){
		// 		var friendStatus = arr[l].friendStatus;
		// 		if( !obj[friendStatus] ) obj[friendStatus] = [];
		// 		obj[friendStatus].push( arr[l] );
		// 	}
		// 	return obj;
		// }


//		User.getFacebookFriends(req.user, function(user){

		User.synFriendsList(req.user, function(user){

			// bind client to subscriptions from friends
			user._friends.forEach(function(friend){
				if(bayeux.getClient()._channels._channels && !bayeux.getClient()._channels._channels['/status/' + friend._id]){
					bayeux.getClient().subscribe('/status/' + friend._id, function(msg){
						console.log('>>>>>>>>>>>>>>>>>>>> FriendController.index > '+req.user.displayName+' > subscriber - /status/' + friend._id + ' >> ' + msg.user + ' <<<<<<<<<<<<<<<<<<<<');
					})
				}
			});


			var data = {
				friends : [], //user.friends,
				grouped : {} //groupFriends(user.friends)
			};

			(req.xhr)
				? res.send(user)
				: res.render(ViewTemplatePath, {layout: 'layout.app.html', content : data, user: user});
		});
	},
	
	/**
	 * Show action, returns shows a single item via views/users/show.html view or via json
	 * Default mapping to GET '/user/:id'
	 * For JSON use '/user/:id.json'
	 **/	
	show: function(req, res, next) {			
		
		var friends = req.user.friends,
			friend = false;
		
		friends.forEach(function(f){
			if(f.id === req.params.id) friend = f;
		});
		
		if( !friend ){
			return next(new Error('you have no friends matching that ID'));
			return;
		};
		
		User.findById(friend.id, function(err,doc){
			if(err) return next(err);
			
			var data = {friend: friend, user:doc };
			res.render(ViewTemplatePath + "/show",{content:data});
		})
	},
	
	invite: function(req, res, next){
		if( !req.user ) next(new Error('invite failed, not logged in'));
		
		// check users has friend
		User.updateFriendStatus(req.user, req.params.id, 'invite', 'invited', function(err, friend){
			if(err) return res.send({error: err});
			res.send('invite worked - ' + friend.friendStatus)
		})
	},

	accept: function(req, res, next){
		if( !req.user ) next(new Error('invite failed, not logged in'));
		
		// check users has friend
		User.updateFriendStatus(req.user, req.params.id, 'friend', 'friend', function(err, friend){
			if(err) return res.send({error: err});
			res.send('invite accepted - ' + friend.friendStatus)
		})
	},

	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/
	edit: function(req, res, next){
		req.flash('error','no edit method on friends!');
		res.send('false');
	},
	
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/ 
	 
	// PUT => friend/:id?action=invite
	update: function(req, res, next){
		req.flash('error','no update method on friends!');
		res.send('false');
	},
	
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	create: function(req, res, next){
		req.flash('error','no create method on friends!');
		res.send('false');
	},
	
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/user/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		req.flash('error','no delete method on friends!');
		res.send('false');
	}
	
};