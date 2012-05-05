
/**
 * TEST Environment settings
 */
module.exports = function(app,express) {
		
	app.set('db-uri', 'mongodb://localhost/mvc-production');
    app.use(express.errorHandler({ dumpExceptions: true, showStack: false }));
	//app.all('/robots.txt', function(req,res) {res.send('User-agent: *', {'Content-Type': 'text/plain'});});

	app.config = {
		env: 'production'
	}
	
}
