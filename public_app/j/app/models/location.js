
// Model: Location

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var Location = Backbone.Model.extend({
		url: config.root + '/location'
	});
	return Location;
});