
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
		url: config.root + '/friend'
	});

	return Friends;
});

