
/**
 *  Users Controller
 *  Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'user';

module.exports = {

	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		res.send({error:'service not enabled'})
	},
	
	/**
	 * Show action, returns shows a single item via views/users/show.html view or via json
	 * Default mapping to GET '/user/:id'
	 * For JSON use '/status/:id.json'
	 **/	
	show: function(req, res, next) {
		User.findById(req.params.id, ['status'], function(err, user) {
			if(err) return next(err);
			res.send(user.toObject());
		});
	},
	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		res.send({error:'service not enabled'})
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){

	    User.findById(req.params.id, function(err, user) {
	    	if (!user) return next(err);
			console.log(req.body)

			var newStatus = {
				scale	: req.body.scale,
				distance: req.body.distance,
				time	: req.body.time,
				geo		: [req.body.lat, req.body.lng]
			};
			user.status.push(newStatus);

	        user.save(function(err) {
				if (err) {
			   		res.send({error:err});
					return;
				}
				res.send(user.status.toObject());
			});
		});
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	create: function(req, res, next){
		
		  var user = new User(req.body.user);
		  
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
		    	  req.flash('info','User created');
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
	    	    	  req.flash('info','User deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};