// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'text!templates/friend.item.html'
], function($, _, Backbone, Events, friendItemTpl){
	var FriendView = Backbone.View.extend({
		el: '#friends',
		template: _.template(friendItemTpl),
		initialize: function(){
			console.info('FriendView.init');
			var AppState = this.options.appState;
			
			 _.bindAll(this, 'render', 'addOne', 'addAll');
			
			this.collection = AppState.get('friends');
			this.collection.on('add', this.addOne);
			this.collection.on('reset', this.addAll);
			this.collection.fetch();
		},
		events: {},
		render: function(){
			console.info('FriendView.render')
			// this.$el.append(this.template( this.model.toJSON() ));
		    // return this;
			//$(this.el).html(layoutTemplate);
		},
		addOne: function(item, index){
			console.log('FriendView.addOne')
			this.$('ol').append(this.template( item.toJSON() ));
		},
		addAll: function(){
			console.log('FriendView.addAll')
			this.$('ol').empty();
			
			var friends = this.collection.where({friendStatus: "friend"});
			if(friends) friends.forEach(this.addOne);
		}
	});
	
	return FriendView;
	
});