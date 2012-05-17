var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Location = new Schema({
    name: String,
    url: String,
    description: String,
    geo: {
    	Lat: String,
    	Long: String 
    }
});

mongoose.model('Location', Location);