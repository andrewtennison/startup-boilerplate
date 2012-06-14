// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'vm',
	'events',
	'views/home/location',
	'views/home/friendList',
	'views/home/status',
	'text!templates/layout.html'
], function($, _, Backbone, Vm, Events, LocationView, FriendView, StatusView, layoutTemplate){
	
	var AppView = Backbone.View.extend({
		el: '#locations',
		initialize: function(){
			console.info('AppView.init');
			var AppState = this.options.appState
	
			var locationView = Vm.create({}, 'LocationView', LocationView, {appState:AppState});
			var friendView = Vm.create({}, 'FriendView', FriendView, {appState:AppState});
			var statusView = Vm.create({}, 'StatusView', StatusView, {appState:AppState});

			_.bindAll(this, 'render');
			
		},
		render: function(){
			console.info('AppView.render')
			//$(this.el).html(layoutTemplate);
			//Backbone.history.start();
		},
		events: {}
	});
	
	return AppView;
	
});