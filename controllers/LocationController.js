
/**
 *	Locations Controller
 *	Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	Location = mongoose.model('Location'),
	ViewTemplatePath = 'location',
	request = require('request');

mongoose.set('debug', true)

/*
function geoEncode(address, callback){
	var url = 'http://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=true';
		
	request({url:url, json:true}, function (error, response, json) {
		callback( error, json.results[0].geometry.location )  // .lat / .lng
	});
}*/


module.exports = {

	init: function(params) {
		console.log('LocationController.init')
		ViewTemplatePath = params.viewPath	 // Enable over-ride of view path for testing
	},
	
	/**
	 * Index action, returns a list either via the views/locations/index.html view or via json
	 * Default mapping to GET '/locations'
	 * For JSON use '/locations.json'
	 **/
	index: function(req, res, next) {
		console.log('LocationController.index')
		
		// get locations, sort by distance from user && popularity / votes, return just 30 > paginate
		// var query = Location.find({});
		// query
		// .sort()
		// .limit(30)
		// .exec(function(err,docs){


		
		Location.find({}, function(err, docs) {
			var data = {
				locations : docs,
				flash : req.flash()
			}
			
			if(req.xhr){
				res.send(docs);
			}else{
				res.render(ViewTemplatePath, {content:data});
			}
		});
	},
	
	/**
	 * Show action, returns shows a single item via views/locations/show.html view or via json
	 * Default mapping to GET '/location/:id'
	 * For JSON use '/location/:id.json'
	 **/
	show: function(req, res, next) {					
		console.log(' /// location.show ' );

		Location.findById(req.params.id, function(err, location) {
			if(err) return next(err);
			switch (req.params.format) {
				case 'json':
					res.send(location.toObject());
					break;

				default:
					var data = {
						location:location
					};
					res.render(ViewTemplatePath + "/show",{content:data, user:req.user});
			}
		});
	},
	
	/**
	 * Edit action, returns a form via views/locations/edit.html view no JSON view.
	 * Default mapping to GET '/location/:id/edit'
	 **/
	edit: function(req, res, next){
		console.log(' /// location.edit ' );

		Location.findById(req.params.id, function(err, location) {
			if(err) return next(err);
			var data = {
				location: location
			}
			res.render(ViewTemplatePath + "/edit",{content:data});
		});
	},
		
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/location/:id', no GET mapping	 
	 **/
	update: function(req, res, next){
		console.log(' /// location.update ' );
		
		Location.findById(req.params.id, function(err, location) {
			if (!location) return next(err);
			location.name = req.body.name;
			location.url = req.body.url;
			location.description = req.body.description;
			
			console.log('location.geo -' +location.geo)

			// check existing
			if( !location.address || location.address !== req.body.address || !location.geo){
				// force new GEO Lookup if address - this wont work as existing address wil trigger. need to check for old!
				location.address = req.body.address;
				location.geo = false;
			};
			
			location.save(function(err) {
				
				if (err) {
					console.log(err);
					req.flash('error','Could not update location: ' + err);
					res.redirect('/locations');
					return;
				}
				
				switch (req.params.format) {
					case 'json':
						res.send(location.toObject());
						break;
					default:
						req.flash('info', 'Location updated');
						res.redirect('/location/' + req.params.id);
				}
			});
		});
	},
		
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/locations', no GET mapping
	 **/
	create: function(req, res, next){
		console.log(' /// location.create ' );
		
		var location = new Location(req.body);

		location.save(function(err) {
			// handle errors, missing required, or no GEO lookup, or multiple GEO results
			console.log('locationController.create > save')
			if (err) {
				console.log(err.errors)
				if(req.xhr){
					res.json(err, 400);
					return;
				}else{
					req.flash('error', err.errors);
					res.redirect('back');
					return;
				}
			};
			
			if(req.xhr){
				res.send(location.toObject());
			}else{
				req.flash('info','Location created');
				res.redirect('/location/' + location.id);
			}
		});
	},
		
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/location/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		console.log(' /// location.destroy ' );
		
		Location.findById(req.params.id, function(err, location) {
				
			if (!location) { 
				req.flash('error','Unable to locate the location to delete!');
				res.render('404'); 
				return false; 
			};
						
			location.remove(function(err) {
				if(err) {
					req.flash('error','There was an error deleting the location!');
					res.send('false');
				} else {
					req.flash('info','Location deleted');
					res.send('true');
				}
			}); 
		});
		
	}
	
};