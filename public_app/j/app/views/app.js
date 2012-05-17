// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'facebook',
	'text!templates/layout.html'
], function($, _, Backbone, Events, FB, layoutTemplate){
	
	var AppView = Backbone.View.extend({
		el: '#locations',
		initialize: function(){
			console.info('AppView.init');
			console.log(this.options)
			
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