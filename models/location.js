var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    request = require('request'),
    inflection = require('../lib/inflection');

var Location = new Schema({
    name: {type:String, required:true, unique:true},
    url: String,
    description: String,
    address: {type:String, required:true},
    formatted_address: String,
    geo: {
    	index:'2d',
    	//required: true,
    	type:[Number]
    }
});


Location.path('name').set(function (v) {
	return v.capitalize();
});

Location.pre('save', function(next){
	console.log('Location.pre Save')
	var self = this,
		address = encodeURIComponent( this.get('address') ),
		url = 'http://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false'; //&jsoncallback=?
				
	console.log('Location.pre Save, url = ' + url)
	
	request({url:url, json:true}, function (error, response, json) {
		if(error || json.results.length == 0){
			console.log('error')
			next(new Error('something went wrong - ' + error));
		}else if(json.results.length > 1){
			console.log('json multiple res')
			// return JSON + error, let user choose an address from the list
			next(new Error('too many results - ' + json.results.length));
		}else{
			self.formatted_address = json.results[0].formatted_address;
			self.geo = [ json.results[0].geometry.location.lat, json.results[0].geometry.location.lng ];
			// also update address with details from JSON.
			next();
		}
	});
})

mongoose.model('Location', Location);
