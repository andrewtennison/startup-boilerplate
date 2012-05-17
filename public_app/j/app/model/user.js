
// Model: User

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var User = Backbone.Model.extend({
		url: config.root + '/user'
	});
	return User;
});