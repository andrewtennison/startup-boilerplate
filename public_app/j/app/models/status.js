
// Model: Friend

define([
	'underscore',
	'backbone',
	'appConfig'
], function(_, Backbone, config){

	var prettify = function(time){
		if( !time ) return false;
		
		var date = new Date(),
			exp = new Date(time),
			s = (exp-date) / 1000;
		
		if(exp < date) return false;
		
		var h = Math.floor(s / 3600);
		s = s - h * 3600;
		var m = Math.floor(s / 60);
		s = Math.ceil(s - m * 60);
		
		// return h + 'h : ' + m + 'm : ' + s +'s';
		return {
			h : h,
			m : m,
			s : s
		};
	};
	
	var Status = Backbone.Model.extend({
		url: config.root + '/status',
		parse: function(json){
			if( !json.title ) return;

			json.expiresPretty = prettify(json.expires);
			return json;
		}
	});

	return Status;

});