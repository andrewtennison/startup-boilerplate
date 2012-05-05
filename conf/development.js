
/**
 * DEVELOPMENT Environment settings
 */
module.exports = function(app,express) {
	
	app.set('db-uri', 'mongodb://localhost/mvc-development');	       
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	//app.all('/robots.txt', function(req,res) {res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});});
	
	app.config = {
		env: 'development'
	}
	
}

