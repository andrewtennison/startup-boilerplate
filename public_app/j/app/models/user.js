
// Model: User

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var User = Backbone.Model.extend({
		idAttribute: '_id',
		url: config.root + '/user'
	});
	return User;
});