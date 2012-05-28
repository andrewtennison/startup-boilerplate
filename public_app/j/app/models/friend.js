
// Model: Friend

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var Friend = Backbone.Model.extend({
		url: config.root + '/friend'
	});
	return Friend;
});