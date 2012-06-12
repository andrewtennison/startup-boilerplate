
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
		console.log('UserController.index')
		
		if(req.xhr){
			if( !req.user ) res.send({error:{msg:'not logged in', status:401}});
			res.send(req.user)
		}else{
			if( !req.user ) res.redirect('/');
			User.find({}, function (err, docs) {
				var data = { users:docs };
				res.render(ViewTemplatePath, {content:data, user:req.user});
			});
		}
	},
	
	/**
	 * Show action, returns shows a single item via views/users/show.html view or via json
	 * Default mapping to GET '/user/:id'
	 * For JSON use '/user/:id.json'
	 **/	
	show: function(req, res, next) {			
			
		User.findById(req.params.id, function(err, user) {
			
			if(err) return next(err);
			
		    switch (req.params.format) {
		      case 'json':
		        res.send(user.toObject());
		        break;
	
		      default:
		      	var data = { user:user };
		      	res.render(ViewTemplatePath + "/show",{content:data, user:user});
		    }
		    
		});
		    
	},
	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/  	
	edit: function(req, res, next){
	  	if(!req.user) return res.send(403,{error:'auth required'});
	  	var data = { user:req.user };
		res.render(ViewTemplatePath + "/edit",{content:data});
	},
	
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/
	update: function(req, res, next){
		if(req.user.id !== req.params.id) return res.send(401, {error:{msg: 'user must be loggeed in', status:401}});
		
	  User.findById(req.params.id, function(err, user) {
	  	if (!user) return next(err);
			
			user.displayName = req.body.displayName;
			user.email = req.body.email;
			
			user.save(function(err) {
				if (err) {
					console.log(err);
				  	req.flash('error','Could not update user: ' + err);
				    	res.redirect('/users');
				    	return;
				}
				
//				console.log(user.toObject())
	  		
				switch (req.params.format) {
				  case 'json':
				    res.send(user.toObject());
				    break;
				  default:
				    req.flash('info', 'User updated');
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