
// Model: AppState - maintains state throughout the application

define([
	'underscore',
	'backbone',
	'appConfig',
	'models/user',
	'models/status',
	'collections/locations',
	'collections/friends'
], function(_, Backbone, Config, UserModel, StatusModel, LocationCollection, FriendCollection){
	
	var State = Backbone.Model.extend({
		initialize: function(options){
			//_.bindAll(this, 'name');
			// this.collection = new Collection();
		},
		// all views can bind to app.changes on specific properties if they need to
		defaults: {
			user: new UserModel(),
			status: new StatusModel(),
			locations: new LocationCollection(),
			friends: new FriendCollection(),
			currentPage: false,
			config: Config
		}
	});
	
	return State;
	
});