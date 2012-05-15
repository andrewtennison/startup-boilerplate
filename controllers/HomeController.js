
/**
 *  Home Controller
 *  Created by create-controller script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/

var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'home';


module.exports = {

	index : function(req,res,next){
		res.render(ViewTemplatePath);
	}
	
};