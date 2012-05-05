var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = new Schema({
    name: {
        first: String,
		last : String
    },
    email: { type: String, required: true, index: { unique: true, sparse: true } },
	alive: Boolean
});

mongoose.model('User', User);