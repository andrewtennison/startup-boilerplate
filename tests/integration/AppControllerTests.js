
var assert = require('assert'), 
	should = require('should'), 
	mongoose = require('mongoose'),
	app = require('../../server.js');

var request = require('request');




/**
 * Simple expresso tests for the AppController
 */

var get = function(url, done){
	request(url, function(err,res,body){
        assert(!err);
		// myuserlist = JSON.parse(body);
		//assert(myuserlist.length, 12);

		res.statusCode.should.equal(200);
		// res.body.should.include.string('404');

		if (err) throw err; 
        done();
	}); 
}

module.exports = {
		
	before: function(){
		// possibly call app to start server on custom port
		//app.boot().listen(3000);
	},
	after: function(){
		// possibly end/top app
	},
	//beforeEach: function(){},
	//afterEach: function(){},
	
	'http: test /': function(done){
		get('http://dev.onside.me:3000/', done)
	},
	'http: test /user': function(done){
		get('http://dev.onside.me:3000/user', done)
	},
	'http: test /broken': function(done){
		get('http://dev.onside.me:3000/broken', done)
	}

		
};




