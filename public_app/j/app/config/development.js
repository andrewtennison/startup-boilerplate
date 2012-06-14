define([], function() {
	var config =	{
		name : 'Development',
		root : 'http://dev.onside.me:3000',
		bootStrapJSON : 'AppJson',
		globalNamespace : 'AppGlobalAccess'		// Do not include in production
	};
	
	return config;
});
