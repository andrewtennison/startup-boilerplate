var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Location = new Schema({
    name: String,
    url: String,
    geo: {
    	Lat: String,
    	Long: String 
    },
	alive: Boolean
});

mongoose.model('Location', Location);