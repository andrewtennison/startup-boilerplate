
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
			console.log(json)
			this.grouped = json.grouped;
			return json._friends;
		},
		updateGroupItem: function(id){
			// when an individual model is updated, update the associated group item
		},
		comparator: function(friend) {
			return friend.get('status').expires;
		}
	});

	return Friends;
	
});

