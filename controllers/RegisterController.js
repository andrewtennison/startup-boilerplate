
/**
 *	Login Controller
 *	Created by create-controller script @ Fri Mar 11 2011 21:16:50 GMT+0000 (GMT)
 **/
var mongoose = require('mongoose'),	
	ViewTemplatePath = 'login',
	User = mongoose.model('User'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var users = [
	{ id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
	{ id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

module.exports = {

	init: function(params) {
		console.log('RegisterController.init')
		ViewTemplatePath = params.viewPath	 // Enable over-ride of view path for testing
	},
	
	/**
	 * Index action, returns a list either via the views/users/index.html view or via json
	 * Default mapping to GET '/users'
	 * For JSON use '/users.json'
	 **/
	index: function(req, res, next) {
		console.log('RegisterController.index')
		
		if(res.user){
			res.redirect('/');
		}else{
			res.render(ViewTemplatePath, { user: req.user, message: req.flash('error') });
		}
	},
	create: function(req, res, next){
		console.log('RegisterController.create');
		res.render(ViewTemplatePath, { user: req.user, message: req.flash('error'), body: req.body });
	}
};





