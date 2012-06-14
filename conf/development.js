
/**
 * DEVELOPMENT Environment settings
 */
module.exports = function(app,express) {
	
	app.set('db-uri', 'mongodb://localhost/mvc-development');	       
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	//app.all('/robots.txt', function(req,res) {res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});});
	
	app.config = {
		env: 'development',

		facebook: {
			app_id:'237429156359045',
			app_secret:'47162acfe0016699b9b5c4eb6cada390'
		},

		fayeEndpoint: 'http://dev.onside.me:3000/bayeux'

	}
	
}