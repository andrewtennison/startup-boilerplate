
/**
 *  Tests Controller
 *  Created by create-controller script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/
 var mongoose = require('mongoose'),	
	Test = mongoose.model('Test'),
	pager = require('../utils/pager.js'),
	ViewTemplatePath = 'tests';

module.exports = {

	/**
	 * Index action, returns a list either via the views/tests/index.html view or via json
	 * Default mapping to GET '/tests'
	 * For JSON use '/tests.json'
	 **/
	index: function(req, res, next) {
		  	 
		  var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
		  var to = req.params.to ? parseInt(req.params.to) : 10;
	      var total = 0;
	      
	      Test.count({}, function (err, count) {
	    	total = count;  
	    	var pagerHtml = pager.render(from,to,total,'/tests');    	
	                  
			  Test.find({})
			  	.sort('name', 1)
			  	.skip(from).limit(to)
			  	.find(function (err, tests) {
				
				  if(err) return next(err);
				  
			      switch (req.params.format) {
			        case 'json':	          
			          res.send(tests.map(function(u) {
			              return u.toObject();
			          }));
			          break;
		
			        default:			        	
			        	res.render(ViewTemplatePath,{tests:tests,pagerHtml:pagerHtml});
			      }
			      
			  });
	      
	      });
	      	  	
	},
	
	/**
	 * Show action, returns shows a single item via views/tests/show.html view or via json
	 * Default mapping to GET '/test/:id'
	 * For JSON use '/test/:id.json'
	 **/	
	show: function(req, res, next) {	  		  
			
		  Test.findById(req.params.id, function(err, test) {
			  
			  if(err) return next(err);
			  
		      switch (req.params.format) {
		        case 'json':
		          res.send(test.toObject());
		          break;
	
		        default:
		        	res.render(ViewTemplatePath + "/show",{test:test});
		      }
		      
		  });
		      
	},
	
	/**
	 * Edit action, returns a form via views/tests/edit.html view no JSON view.
	 * Default mapping to GET '/test/:id/edit'
	 **/  	  
	edit: function(req, res, next){
		  Test.findById(req.params.id, function(err, test) {
			  if(err) return next(err);
			  res.render(ViewTemplatePath + "/edit",{test:test});
		});
	},
	  
	/**
	 * Update action, updates a single item and redirects to Show or returns the object as json
	 * Default mapping to PUT '/test/:id', no GET mapping	 
	 **/  
	update: function(req, res, next){
	    
	    Test.findById(req.params.id, function(err, test) {
	        
	    	if (!test) return next(err);
	        
	    	test.name = req.body.test.name;
	    	
	        test.save(function(err) {
	        
	    	  if (err) {
	    		  console.log(err);
	        	  req.flash('error','Could not update test: ' + err);
	          	  res.redirect('/tests');
	          	  return;
	    	  }
	    		
	          switch (req.params.format) {
	            case 'json':
	              res.send(test.toObject());
	              break;
	            default:
	              req.flash('info', 'Test updated');
	              res.redirect('/test/' + req.params.id);
	          }
	        });
	      });
	},
	  
	/**
	 * Create action, creates a single item and redirects to Show or returns the object as json
	 * Default mapping to POST '/tests', no GET mapping	 
	 **/  
	create: function(req, res, next){
		  
		  var test = new Test(req.body.test);
		  
		  test.save(function(err) {
		   
			if (err) {
	    	  req.flash('error','Could not create test: ' + err);
	      	  res.redirect('/tests');
	      	  return;
			}
	
		    switch (req.params.format) {
		      case 'json':
		        res.send(test.toObject());
		        break;
	
		      default:
		    	  req.flash('info','Test created');
		      	  res.redirect('/test/' + test.id);
			 }
		  });	  
		  
	},
	  
	/**
	 * Delete action, deletes a single item and redirects to index
	 * Default mapping to DEL '/test/:id', no GET mapping	 
	 **/ 
	destroy: function(req, res, next){
		  
		  Test.findById(req.params.id, function(err, test) {
		        
		    	if (!test) { 
	  	    	  	req.flash('error','Unable to locate the test to delete!');
		    		res.send('false'); 
		    		return false; 
		    	};
		    		    
		    	test.remove(function(err) {
	    		  if(err) {
	    	    	  req.flash('error','There was an error deleting the test!');
	    			  res.send('false');
	    		  } else {
	    	    	  req.flash('info','Test deleted');
	    			  res.send('true');
	    		  }    	          
	   	      	}); 
		  });
		  
	}
	
};