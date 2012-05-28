
/**
 *  Home Controller
 *  Created by create-controller script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/

var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'home',
	statusValues = require('../lib/statusValues');

console.log(statusValues)

var data = statusValues;

module.exports = {

	index : function(req,res,next){
		if( !req.isAuthenticated() ){
			res.redirect('/');
			return;
		}
		
		//req.user.status = req.user.status.pop();
		var status = req.user.status;
//		req.user.status = status.sort(function(a,b){return (a.created - back.created);});		

		res.render(ViewTemplatePath, {layout: 'layout.app.html', content:data, user:req.user});
	}
	
};