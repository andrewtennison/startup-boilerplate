
/**
 *  Home Controller
 *  Created by create-controller script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/

var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'home',
	statusValues = require('../lib/statusValues');

module.exports = {

	index : function(req,res,next){
		if( !req.isAuthenticated() ){
			res.redirect('/');
			return;
		}
		
		var status = req.user.status;

		res.render(ViewTemplatePath, {layout: 'layout.app.html', content:statusValues, user:req.user});
	}
	
};