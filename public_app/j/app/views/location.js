// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'views/form',
	'text!templates/location.item.html'
], function($, _, Backbone, Events, FormView, locationItemTpl){

	var LocationView = FormView.extend({
		el: '#locations',
		template: _.template(locationItemTpl),
		initialize: function(){
			console.info('LocationView.init');
			var AppState = this.options.appState;
			 _.bindAll(this, 'render', 'addOne', 'addAll', 'postForm', 'clearForm', 'showErrors', 'toggleHref');
			 
			this.collection = AppState.get('locations');
			this.collection.on('add', this.addOne);
			this.collection.on('reset', this.addAll);
			this.collection.fetch();
		},
		addOne: function(item, index){
			this.$('ol').append(this.template( item.toJSON() ));
		},
		addAll: function(){
			this.$('ol').empty();
			this.collection.each(this.addOne);
		}
	});
	
	return LocationView;
	
});