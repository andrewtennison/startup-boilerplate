	
var faye = require('faye'),
	client = false,
	bayeux	= new faye.NodeAdapter({mount: '/bayeux', timeout: 20});

module.exports = bayeux;