// Require.js allows us to configure shortcut alias
require.config({
	paths: {
		// Major libraries
		jquery: '/j/libs/jquery/jquery-min',
		underscore: '/j/libs/underscore/underscore-min',	// https://github.com/amdjs
		backbone: '/j/libs/backbone/backbone-min',			// https://github.com/amdjs
		syphon: '/j/libs/backbone/backbone.syphon.min',	// https://github.com/derickbailey/backbone.syphon

		// Require.js plugins
		text: '/j/libs/require/text',
		order: '/j/libs/require/order',
		async: '/j/libs/require/async', // https://github.com/millermedeiros/requirejs-plugins

		// load config file - this could be dependent on environment 
		// appConfig: ( window.bootstrapJson.env === 'development')? 'config/development' : 'config/production',
		appConfig: 'config/development',

		// Async load google maps
		google: '/j/libs/google/googleMaps',
				
		// external
		facebook: 'http://connect.facebook.net/en_US/all',

		// FAYE > pubsub messaging
		faye:'http://dev.onside.me/bayeux/client',

		// templates folder
		templates: '../../t'
	},
	urlArgs: "bust=" + (new Date()).getTime()
});

// init the app
require([
	'router',
	'vm'
], function(Router, Vm){

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '237429156359045', // App ID
			channelUrl : '//dev.onside.me/facebook/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
	    // Additional initialization code here
	};

	//var appView = Vm.create({}, 'AppView', AppView);
	Router.initialize();
	//appView.render(); // render() calls Backbone.history when its ready to start

});