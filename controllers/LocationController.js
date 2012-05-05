
/**
 *  Locations Controller
 *  Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	Location = mongoose.model('Location'),
	ViewTemplatePath = 'location';

module.exports = {

	init: function(params) {
		console.log('LocationController.init')
		ViewTemplatePath = params.viewPath   // Enable over-ride of view path for testing
	},
	
	/**
	 * Index action, returns a list either via the views/locations/index.html view or via json
	 * Default mapping to GET '/locations'
	 * For JSON use '/locations.json'
	 **/
	index: function(req, res, next) {
		console.log('LocationController.index')
		  	/*
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Location.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/locations');    	
	                  
			  Location.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, locations) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(locations.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{locations:locations,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	*/  	
	      	res.render(ViewTemplatePath);
	},
	
	/**
	 * Show action, returns shows a single item via views/locations/show.html view or via json
	 * Default mapping to GET '/location/:id'
	 * For JSON use '/location/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Location.findById(req.params.id, function(err, location) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(location.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{location:location});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/locations/edit.html view no JSON view.
	 * Default mapping to GET '/location/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Location.findById(req.params.id, function(err, location) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{location:location});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/location/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
		
		
	    Location.findById(req.params.id, function(err, location) {
	        
	    	if (!location) return next(err);
	        
	    	location.name = req.body.location.name;
	    	
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
		
		  var location = new Location(req.body.location);
		  
		  location.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create location: ' + err);
	      	  res.redirect('/locations');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(location.toObject());
		        break;
	
		      default:
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