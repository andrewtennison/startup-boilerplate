// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'text!templates/location.item.html'
], function($, _, Backbone, Events, locationItemTpl){
	console.log('Location View file loaded')
	var LocationView = Backbone.View.extend({
		el: '#locations',
		template: _.template(locationItemTpl),
		initialize: function(){
			console.info('LocationView.init');
			var AppState = this.options.appState;
			
			 _.bindAll(this, 'render', 'addOne', 'addAll');
			
			this.collection = AppState.get('locations');
			this.collection.on('add', this.addOne);
			this.collection.on('reset', this.addAll);
			this.collection.fetch();
		},
		events: {},
		render: function(){
			console.info('LocationView.render')
			// this.$el.append(this.template( this.model.toJSON() ));
		    // return this;
			//$(this.el).html(layoutTemplate);
		},
		addOne: function(item, index){
			console.log('LocationView.addOne')
			this.$('ol').append(this.template( item.toJSON() ));
		},
		addAll: function(){
			console.log('LocationView.addAll')
			this.$('ol').empty();
			this.collection.each(this.addOne);
		}
	});
	
	return LocationView;
	
});