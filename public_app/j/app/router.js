// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'vm',
	'appConfig',
	'model/appState',
	'views/app'
], function ($, _, Backbone, Vm, Config, AppStateModel, AppView) {
	var appState; // scope global to file, set in init
	
	var AppRouter = Backbone.Router.extend({
		routes: {
			'/location/:id' : 'getLocation',
			'*actions': 'defaultAction' // All urls will trigger this route
		},
		initialize: function(){
			// in init() define all views required on ALL page loads. Unique views can be defined in routes
			
			// This is JSON embeded in the page so can be used straight away prevent extra ajax requests
			var bootStrapJson = window[Config.bootStrapJSON];
			
			// AppState is a model that maintains state across all views
			appState = new AppStateModel();
			
			// Add appState to global name space for debug + development purposes
			if( Config.globalNamespace ) window[Config.globalNamespace] = appState;

			// Load User
			( bootStrapJson.user )
				? appState.get('user').reset( Config.bootStrapJSON.user )
				: appState.get('user').fetch();
			
			// Views
			var appView = Vm.create({}, 'AppView', AppView, {appState:appState});
		},
		getLocation: function(id){
			// see if ID exists in collection
			var model = appState.get('locations').get(id);
			if(model){
				// new visit, get Data
			}else{
				// exists, load Data
				appState.get('locations').reset( Config.bootStrapJSON.location )
			}
			// require(['views/location/index'], function (LocationPage) {
				// var dashboardPage = Vm.create(appView, 'LocationPage', LocationPage);
				// LocationPage.render();
				// // may be better to trigger and let the view render? Or setApp state, let AppView manage display
			// });

		}
		
	});

	var initialize = function(options){
		var router = new AppRouter(options);

		router.on('route:defaultAction', function (actions) {
			console.info('Backbone.router.on:defaultAction = ' + actions)
			/*
			 * App routes/ urls? - 
			 * 
			 * /home
			 * /locations
			 * /location/id
			 * /friends
			 * /friend/id
			 * 
			 * */
			
			
			/*
			require(['views/dashboard/page'], function (DashboardPage) {
				var dashboardPage = Vm.create(appView, 'DashboardPage', DashboardPage);
				dashboardPage.render();
			});
			*/
		});
		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});