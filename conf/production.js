
/**
 * TEST Environment settings
 */
module.exports = function(app,express) {
		
	app.set('db-uri', 'mongodb://localhost/mvc-production');
    app.use(express.errorHandler({ dumpExceptions: true, showStack: false }));
	//app.use(gzippo.staticGzip(__dirname + '/public_app'));
	//app.all('/robots.txt', function(req,res) {res.send('User-agent: *', {'Content-Type': 'text/plain'});});
	// app.enable('view cache')
	app.config = {
		env: 'production',
		
		facebook: {
			app_id:'237429156359045',
			app_secret:'47162acfe0016699b9b5c4eb6cada390'
		},

		fayeEndpoint: 'http://dev.onside.me:3000/bayeux'
	}
	
}
