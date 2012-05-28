
// Collection Friends

define([
	'jquery',
	'underscore',
	'backbone',
	'appConfig',
	'models/friend'
], function($, _, Backbone, config, FriendModel){
	
	var Friends = Backbone.Collection.extend({
		model: FriendModel,
		url: config.root + '/friend',
		parse: function(json){
			return json.friends;
		}
	});

	return Friends;
});

