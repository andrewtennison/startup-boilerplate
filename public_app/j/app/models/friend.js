
// Model: Friend

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var Friend = Backbone.Model.extend({
		idAttribute: '_id',
		url: config.root + '/friend'
	});
	return Friend;
});