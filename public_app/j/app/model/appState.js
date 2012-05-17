
// Model: AppState - maintains state throughout the application

define([
	'underscore',
	'backbone',
	'appConfig',
	'model/user',
	'collection/locations'
], function(_, Backbone, Config, UserModel, LocationCollection){
	
	var State = Backbone.Model.extend({
		initialize: function(options){
			//_.bindAll(this, 'name');
			// this.collection = new Collection();
		},
		// all views can bind to app.changes on specific properties if they need to
		defaults: {
			user: new UserModel(),
			locations: new LocationCollection(),
			currentPage: false,
			config: Config
		}
	});
	
	return State;
	
});