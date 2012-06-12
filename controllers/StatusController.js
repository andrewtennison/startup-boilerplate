
/**
 *  Users Controller
 *  Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'user',
	statusValues = require('../lib/statusValues');

function findInArray(arr, prop, value){
	var l = arr.length;
	while(l--){
		if(arr[l][prop] === value) return arr[l];
	}
	return false;
}

function createExpires(status){
	var date = new Date( status.created ),
		duration = parseInt( status.scale ),
		startTime = parseInt( status.time );

	if( startTime === 1) startTime = date.getHours();
	date.setHours( startTime + duration );
	return date;
}

function createTitle(username, status){
	var string = username + ' fancies';
	string += ' ' + findInArray(statusValues.statusScale, 'value', status.scale).name;
	string += ' ' + findInArray(statusValues.statusDistance, 'value', status.distance).name;
	string += ' and is  ' + findInArray(statusValues.statusTime, 'value', status.time).name;
	console.log('createTitle = ' + string)
	return string;
}

module.exports = {

	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		console.log('controller.status.index')
		if( !req.user ) res.send(401, {error:{msg: 'user must be loggeed in', status:401}});
		// could check if status has expired and return nothing
		res.send(req.user.status);
	},
	
	/**
	 * Show action, returns shows a single item via views/users/show.html view or via json
	 * Default mapping to GET '/user/:id'
	 * For JSON use '/status/:id.json'
	 **/
	show: function(req, res, next) {
		console.log('controller.status.show')
		if(!req.user) return next(err);
		res.send(req.user.toObject());
	},
	
	/**
	 * Edit action, returns a form via views/users/edit.html view no JSON view.
	 * Default mapping to GET '/user/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		console.log('controller.status.edit')
		res.send(404,{error:'service not enabled'})
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/user/:id', no GET mapping	 
	 **/
	update: function(req, res, next){
		console.log('controller.status.edit')
		res.send(404,{error:'service not enabled'})
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/users', no GET mapping	 
	 **/  
	create: function(req, res, next){
		console.log('controller.status.create')
		
		var user = req.user;
    	if (!user) return next(err);
		console.log(req.body);
		
		var errors = [];
		if( req.body.scale === '') errors.push('Please choose a scale');
		if( req.body.distance === '') errors.push('Please choose a distance');
		if( req.body.time === '') errors.push('Please choose a time');
		
		if( errors.length > 0 ){
			req.flash('error','missing values');
			res.redirect('back');
			return;
		}

		var newStatus = {
			scale	: req.body.scale,
			distance: req.body.distance,
			time	: req.body.time,
			geo		: [req.body.lat, req.body.lng],
			created : new Date()
		};
		
		newStatus.expires = createExpires(newStatus);
		newStatus.title = createTitle(req.user.displayName, newStatus);

		user.status = newStatus;
        user.save(function(err) {
			(err)
				? res.send({error:err})
				: res.send(newStatus);
		});
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/user/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		console.log('controller.status.destory')
		res.send(404,{error:'service not enabled'})
	}
	
};