// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'text!templates/friend.item.html'
], function($, _, Backbone, Events, friendItemTpl){

	var FriendItemView = Backbone.View.extend({
		tagName: 'article',
		template: _.template(friendItemTpl),

		initialize: function(){
			var AppState = this.options.appState;
			//this.model = this.options.model;
			console.info(this.model);

			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
		},
		render: function(){
			console.warn('RENDERING FRIEND VIEW');
			$(this.el).html(this.template( this.model.toJSON() ));
		    return this;
		}
	});
	
	return FriendItemView;
	
});