
var app,
	app_root	= __dirname,
	app_port	= 3000,
	fs			= require('fs'),
	express		= require('express'),
	util		= require('util'),
	SessionMongoose = require("session-mongoose"),
	mongoose	= require('mongoose'),
	logging		= require('node-logging'),
	stylus		= require('stylus'),
	nib			= require('nib'),
	passport	= require('passport');


var mongooseSessionStore = new SessionMongoose({
	url: "mongodb://localhost/session",
	interval: 6000 // expiration check worker run interval in millisec (default: 60000)
});

mongoose.connect('mongodb://localhost/boilerplate');
mongoose.connection.on('error', console.error);

// Initial bootstrapping
exports.boot = function(params){
	
	//Create our express instance
	app = express.createServer();	
	
	 // Import configuration
	require(app_root + '/conf/configuration.js')(app,express);
	
	// Bootstrap application
	bootApplication(app);
	bootModels(app);
	bootControllers(app);
	bootFaye(app);

	return app;
};

function compileStylus (str, path) {
	return stylus(str)
		.set('filename', path)
		.set('compress', false)
		.use(nib());
}
function bootApplication(app) {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());

	// before sessions to prevent passport.deserializeUser being called for static assets
	app.use(express.static(app_root + '/public_app'));
	app.use(express.session({
		secret: "changeSecret",
		maxAge: new Date(Date.now() + 3600000), 
		store: mongooseSessionStore 
    }));

	app.use(passport.initialize());
	app.use(passport.session());

	// dynamic router
	app.use(app.router);
	app.use(express.logger());
	app.use(logging.requestLogger);

	// Example 500 page
	app['error'](function(err, req, res){
		console.log('Internal Server Error: ' + err.message);
		res.render('500');
	});
	
	// Example 404 page via simple Connect middleware
	app.use(function(req, res){
		res.render('404');
	});

	// Setup ejs views as default, with .html as the extension
	app.set('views', app_root + '/views');
	app.register('.html', require('ejs'));
	app.set('view engine', 'html');


	// Some dynamic view helpers
	app.dynamicHelpers({
		request: function(req){ return req; },
		//user: function(req){ return req.user; },
		hasMessages: function(req){ return Object.keys(req.session.flash || {}).length; },
		messages: function(req){
			return function(){
				var msgs = req.flash();
				console.log(msgs);
				return Object.keys(msgs).reduce(function(arr, type){
					return arr.concat(msgs[type]);
				}, []);
			}
		}
	});
}

function compile(str, path) {
	return stylus(str)
	.set('filename', path)
	.set('compress', true)
	.use(nib());
}

//Bootstrap models 
function bootModels(app) {
	fs.readdir(app_root + '/models', function(err, files){
		if (err) throw err;
		files.forEach(function(file){
			bootModel(app, file);
		});
	});
	
	// Connect to mongoose
	mongoose.connect(app.set('db-uri'));

}

// Bootstrap controllers
function bootControllers(app) {
	fs.readdir(app_root + '/controllers', function(err, files){
		if (err) throw err;
		files.forEach(function(file){			
			bootController(app, file);				
		});
	});
	
	require(app_root + '/controllers/AppController')(app);			// Include
}

function bootModel(app, file) {
	var name = file.replace('.js', ''),
		schema = require(app_root + '/models/'+ name);				// Include the mongoose file
}

// Load the controller, link to its view file from here
function bootController(app, file) {
	var name = file.replace('.js', ''),
		controller = app_root + '/controllers/' + name,	 // full controller to include
		template = name.replace('Controller','').toLowerCase();	// template folder for html - remove the ...Controller part.

	// console.log('bootController')
	// console.log('name = '+name)
	// console.log('controller = '+controller)
	// console.log('template = '+template)
	
	// Include the controller
	//require(controller)(app,template);			// Include
}

function bootFaye(app) {
	var bayeux = require(app_root + '/utils/faye');
	bayeux.attach(app);
}


// allow normal node loading if appropriate
if (!module.parent) {
	exports.boot().listen(app_port);
	console.log("Express server %s listening on port %d", express.version, app.address().port)
}
