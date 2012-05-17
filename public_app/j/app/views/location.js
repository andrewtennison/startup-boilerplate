// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'facebook',
	'text!templates/location.html'
], function($, _, Backbone, Events, FB, layoutTemplate){
	
	var LocationView = Backbone.View.extend({
		el: '#locations',
		initialize: function(){
			console.info('LocationView.init');
			console.log(this.options)
			var AppState = this.options.appState;
			
			_.bindAll(this, 'render');
			
			this.collection = AppState.get('locations');
			this.collection.on('add', addOne)
			this.collection.on('reset', addAll)
			
		},
		render: function(){
			console.info('LocationView.render')
			//$(this.el).html(layoutTemplate);
			//Backbone.history.start();
		},
		events: {}
	});
	
	return LocationView;
	
});