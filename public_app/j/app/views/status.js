// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'vm',
	'events',
	'text!templates/status.html'
], function($, _, Backbone, Vm, Events, statusTemplate){
	
	var StatusView = Backbone.View.extend({
		el: '#locations',
		initialize: function(){
			_.bindAll(this, 'render');
		},
		render: function(){
			//$(this.el).html(statusTemplate);
		},
		events: {}
	});
	
	return StatusView;
	
});