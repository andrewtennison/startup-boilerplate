
/**
 *  Home Controller
 *  Created by create-controller script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/

var mongoose = require('mongoose'),	
	User = mongoose.model('User'),
	ViewTemplatePath = 'home';

module.exports = {

	index : function(req,res,next){
		if( !req.isAuthenticated() ){
			res.redirect('/');
			return;
		}

		var data = {
			statusScale : [
				{value:'1', name:'A cheeky pint'},
				{value:'2', name:'A couple of beers'},
				{value:'3', name:'getting on it'},
				{value:'4', name:'A cheeky pint'},
				{value:'5', name:'A session'}
			],
			statusDistance : [
				{value:'1', name:'within a short stroll'},
				{value:'2', name:'somewhere nearish'},
				{value:'3', name:'I will resort to public transport'},
				{value:'4', name:'anywhere, i am desperate!'}
			],
			statusTime : [
				{value:'1', name:'I am free now'},
				{value:'11', name:'after 11am'},
				{value:'12', name:'after 12am'},
				{value:'13', name:'after 1pm'},
				{value:'14', name:'after 2pm'},
				{value:'15', name:'after 3pm'},
				{value:'16', name:'after 4pm'},
				{value:'17', name:'after 5pm'},
				{value:'18', name:'after 6pm'},
				{value:'19', name:'after 7pm'},
				{value:'20', name:'after 8pm'},
				{value:'21', name:'after 9pm'},
				{value:'22', name:'after 10pm'},
				{value:'23', name:'after 11pm'},
				{value:'24', name:'late'}
			]
		};
		res.render(ViewTemplatePath, {layout: 'layout.app.html', content:data, user:req.user});
	}
	
};