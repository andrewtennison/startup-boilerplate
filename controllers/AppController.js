var fs = require('fs'),
	inflection = require('../lib/inflection');
	

module.exports = function(app) {
	
	// app.get("/favicon.ico", function() {}); // Required if you delete the favicon.ico from public
	
	app.get('/auth/:action/:callback', authRouter, authCallback);
	app.get('/auth/:action', authRouter);
	app.get('/logout', function(req, res){
		req.logOut();
		res.redirect('/');
	});
	
	// Plural
	app.get("/:controller?", router);					// Index
	app.get("/:controller.:format?", router);			// Index
	app.get("/:controller/:from-:to.:format?", router);	// Index
	
	// Plural Create & Delete
	app.post("/:controller", router);					// Create
	app.del("/:controller", router);	 				// Delete all
	
	// Singular - different variable to clarify routing
	app.get("/:controller/:id.:format?", router);		// To support controller/index	
	app.get("/:controller/:id/:action", router);		// Show edit
	app.put("/:controller/:id", router);				// Update
	app.del("/:controller/:id", router);				// Delete	
	
}

//app.get("/:controller?", ensureAuthenticated, router);
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/', {message:'not logged in', status:401})
}

function andRestrictToSelf(req, res, next) {
	req.authenticatedUser.id == req.user.id
	? next()
	: next(new Error('Unauthorized'));
}
function andRestrictTo(role) {
	return function(req, res, next) {
		req.authenticatedUser.role == role
		? next()
		: next(new Error('Unauthorized'));
	}
}


function authCallback(req, res){
	authRouter(req, res, false)
}

function authRouter(req, res, next){
	var controller = 'auth';
	var action = req.params.action ? req.params.action : '';
	var callback = req.params.callback ? req.params.callback : '';
	var method = req.method.toLowerCase();
	var fn = 'index';

	console.log('controllerLibrary = ./' + controller.capitalize() + 'Controller')
	
	// Default route
	if(controller.length == 0) {
		index(req,res,next);
		return;
	};
	
	fn = (callback)? 'callback' : 'index';
	fn += action.capitalize();
	if(!next) fn += 'Callback';

	console.log('controller = ' + './' + controller.capitalize() + 'Controller >> ' + fn)

	try {
		var path = './' + controller.capitalize() + 'Controller',
			controllerLibrary = require(path);

		if(typeof controllerLibrary[fn] === 'function') {
			console.log('call '+path+' function')
			controllerLibrary[fn](req,res,next);		
		} else {
			console.log(path+' not function')
			if(next){res.render('404')}else{return};
		}
	} catch (e) {
		console.log(e)
		if(next){res.render('404')}else{return};
	}
};

function router(req, res, next) {
	var controller = req.params.controller ? req.params.controller : '';
	var action = req.params.action ? req.params.action : '';
	var id = req.params.id ? req.params.id : '';
	var method = req.method.toLowerCase();
	var fn = 'index';

	// Default route
	if(controller.length == 0) {
		index(req,res,next);
		return;
	}		
	
	// Determine the function to call based on controller / model and method
	if(id.length == 0) {
		
		// We are plural
		switch(method) {
			case 'get':
				fn = 'index';
				break;
			case 'post':
				fn = 'create';
				break;
			case 'delete':
				fn = 'destroyAll';
				break;		
		}		
	} else {
		
		// Controller name is now singular, need to switch it back 
		switch(method) {
			case 'get':
				if(action.length > 0) {
					fn = action;
				} else {
					fn = 'show';
				}
				break;
			case 'put':
				fn = 'update';
				break;
			case 'delete':
				fn = 'destroy';
				break;		
		}		
	}
	
	console.log('controllerLibrary = ./' + controller.capitalize() + 'Controller')
	
	try {
		var controllerLibrary = require('./' + controller.capitalize() + 'Controller');
		
		// if(typeof controllerLibrary[fn] === 'object'){
			// var options = controllerLibrary[fn].middlewhere;
			// // run middlewhere dependent on options. 
			// // finally run controllerLibrary[fn].init
		// }
		
		if(typeof controllerLibrary[fn] === 'function') {
			console.log('call '+controllerLibrary+' function')
			controllerLibrary[fn](req,res,next);		
		} else {
			console.log(controllerLibrary+' not function')
			//res.render('404');
			res.send(404)
		}
	} catch (e) {
		console.log(e)
		res.send(404)
		//res.render('404');
	}
};


/**
 * Default Application index - shows a list of the controllers.
 * Redirect here if you prefer another controller to be your index.
 * @param req
 * @param res
 */

function index(req, res, next) {
		 
	/**
	 * If you want to redirect to another controller, uncomment
	 */
	// res.redirect('/controllerName');
	
	var controllers = [];
	
	console.log('AppController.index')
	fs.readdir(__dirname + '/', function(err, files){

		if (err) throw err;

		files.forEach(function(file){
			if(file != "AppController.js") {
				controllers.push(file.replace('Controller.js','').toLowerCase());
			}
		});

		var data = {
			controllers:controllers, 
			user: req.user
		};
		res.render('app', {content:data});
	
	});	
};