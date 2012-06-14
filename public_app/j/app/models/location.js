
// Model: Location

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){
	var Location = Backbone.Model.extend({
		idAttribute: '_id',
		url: config.root + '/location'
	});
	return Location;
});