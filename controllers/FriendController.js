
/**
 *  Friends Controller
 *  Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'friend',
	request = require('request'),
	async = require('async');

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
		//console.log(req.user)
		
		function findRegisteredFriends(arr, callback){
			var query = User.find({});
			query
			.in('fb_uid', arr)
			.select('displayName')
			.exec(function(err,docs){
				// on complete of all calls return results
				//docs.forEach(function(doc){ console.log(doc) });
				//(r.error)? res.send(r.error) : res.json(r.success);
				console.log(docs)
				
				docs.forEach(function(doc){
					var add = true;
					req.user.friends.forEach(function(f){
						if(f.id === doc.id) add = false;
					});
					doc.uid = doc.id;
					if(add) req.user.friends.push( doc );
				});

				req.user.fb_friends = arr;
  	
				req.user.save(function(err) {
					if(req.xhr){
						res.json(docs);
					}else{
						//req.flash('info','Friend found');
						var data = {
							fb_friends : arr,
							friends : req.user.friends 
						}
						res.render(ViewTemplatePath, {content : data});
					}
				});
			})
		};
		
		if( !req.isAuthenticated() ){
			res.redirect('/');
		}else{
			
			// get FB friends, query, remove matched with friends to find new friends to add
			// get local friends, get statuses OR setup sockets to transmit data
			if(req.session.fb_friends){
				findRegisteredFriends(req.session.fb_friends)
			}else{
				var url = 'https://graph.facebook.com/' + req.user.fb.username + '/friends?access_token=' + req.user.fb_accessToken;
				request({url:url, json:true}, function (error, response, json) {
					if (!error && response.statusCode == 200) {
						
						req.session.fb_friends = json;
						
						var arr = [],
							l = json.data.length;
						while(l--){ arr.push( json.data[l].id ) };
						req.session.fb_friends = arr;
						findRegisteredFriends(arr)
					}	
				})
			};
		} 
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
		
			
		// User.findById(req.params.id, function(err, user) {
// 			
			// if(err) return next(err);
// 			
		    // switch (req.params.format) {
		      // case 'json':
		        // res.send(user.toObject());
		        // break;
// 	
		      // default:
		      	// var data = {friend: user.friend};
		      	// res.render(ViewTemplatePath + "/show",{content:data});
		    // }
// 		    
		// });
		    
	},
	
	invite: function(req, res, next){
		if( !req.user ) next(new Error('invite failed, not logged in'));
		
		// check users has friend
		User.updateFriendStatus(req.user, req.params.id, 'invite', 'invited', function(err, friend){
			console.log('updateFriendStatus run')

			if(err) return res.send({error: err});
			
			// user.friend status updated
			// extra logic => i invite friend > change friend status, then add/amend friend.friend[user.id].status
			
			
			res.send('invite worked - ' + friend.status)
		})
	},

	accept: function(req, res, next){
		if( !req.user ) next(new Error('invite failed, not logged in'));
		
		// check users has friend
		User.updateFriendStatus(req.user, req.params.id, 'friend', function(err, friend){
			if(err) return res.send({error: err}) 
			res.send('friend added - ' + friend.status)
		})
	},

	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/  	
	edit: function(req, res, next){
		User.findById(req.params.id, function(err, user) {
			if(err) return next(err);
			res.render(ViewTemplatePath + "/edit",{user:user});
		});
	},
	
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/ 
	 
	// PUT => friend/:id?action=invite
	update: function(req, res, next){
		var action = req.params.action;
		
		if(!req.user) next()
		switch(action){
			case 'invite':
				// User > invites > Friend
				// update user.friend.id status
				// update or add friend.friend.userID status
				
				break;
			case 'accept':
				break;
			case 'reject':
				break;
			default:
				break;
		}
		
		User.findById(req.params.id, function(err, user) {
			if (!user) return next(err);
			user.name = req.body.user.name;
	  	
	      user.save(function(err) {
	      
	  	if (err) {
	  		console.log(err);
	      	req.flash('error','Could not update user: ' + err);
	        	res.redirect('/users');
	        	return;
	  	}
	  		
	        switch (req.params.format) {
	          case 'json':
	            res.send(user.toObject());
	            break;
	          default:
	            req.flash('info', 'Friend updated');
	            res.redirect('/user/' + req.params.id);
	        }
	      });
	    });
	},
	
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	create: function(req, res, next){
		
		var user = new Friend(req.body.user);
		
		user.save(function(err) {
		 
			if (err) {
	  	req.flash('error','Could not create user: ' + err);
	    	res.redirect('/users');
	    	return;
			}
	
		  switch (req.params.format) {
		    case 'json':
		      res.send(user.toObject());
		      break;
	
		    default:
		  	req.flash('info','Friend created');
		    	res.redirect('/user/' + user.id);
			 }
		});	
		
	},
	
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/user/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		
		User.findById(req.params.id, function(err, user) {
		      
		  	if (!user) { 
		  		req.flash('error','Unable to locate the user to delete!');
		  		res.render('404'); 
		  		return false; 
		  	};
		  		  
		  	user.remove(function(err) {
	  		if(err) {
	  	  	req.flash('error','There was an error deleting the user!');
	  			res.send('false');
	  		} else {
	  	  	req.flash('info','Friend deleted');
	  			res.send('true');
	  		}    	        
	 	    	}); 
		});
		
	}
	
};