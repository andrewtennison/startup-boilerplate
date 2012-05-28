
// Model: Friend

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var Status = Backbone.Model.extend({
		url: config.root + '/status'
	});
	return Status;
});