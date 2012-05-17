// Require.js allows us to configure shortcut alias
require.config({
	paths: {
		// Major libraries
		jquery: '/j/libs/jquery/jquery-min',
		underscore: '/j/libs/underscore/underscore-min', // https://github.com/amdjs
		backbone: '/j/libs/backbone/backbone-min', // https://github.com/amdjs

		// Require.js plugins
		text: '/j/libs/require/text',
		order: '/j/libs/require/order',

		// load config file - this could be dependent on environment 
		appConfig: 'config/development',
		
		// external
		facebook: 'http://connect.facebook.net/en_US/all',

		// templates folder
		templates: '../../t'
	},
	urlArgs: "bust=" + (new Date()).getTime()
});

// init the app
require([
	'views/app',
	'router',
	'vm'
], function(AppView, Router, Vm){

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '237429156359045', // App ID
			channelUrl : '//de.onside.me/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
	    // Additional initialization code here
	};

	var appView = Vm.create({}, 'AppView', AppView);
	Router.initialize({appView: appView});
	appView.render(); // render() calls Backbone.history when its ready to start

});