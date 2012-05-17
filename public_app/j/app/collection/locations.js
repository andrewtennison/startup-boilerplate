
// Collection Locations

define([
	'jquery',
	'underscore',
	'backbone',
	'appConfig',
	'models/location'
], function($, _, Backbone, config, LocationModel){
	
	var Locations = Backbone.Collection.extend({
		model: LocationModel,
		url: config.root + '/location'
	});

	return Locations;
});

