// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'vm',
	'events',
	'facebook',
	'text!templates/layout.html'
], function($, _, Backbone, Vm, Events, FB, layoutTemplate){
	
	var AppView = Backbone.View.extend({
		el: '#locations',
		initialize: function(){
			_.bindAll(this, 'render');
		},
		render: function(){
			$(this.el).html(layoutTemplate);
			Backbone.history.start();
		},
		events: {}
	});
	
	return AppView;
	
});