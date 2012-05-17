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
		facebook: 'http://connect.facebook.net/en_US/all.js',

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
	var appView = Vm.create({}, 'AppView', AppView);
	Router.initialize({appView: appView});
	appView.render(); // render() calls Backbone.history when its ready to start
});