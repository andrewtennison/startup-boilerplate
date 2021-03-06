// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'views/home/friendItem'
], function($, _, Backbone, Events, FriendItemView){
	var FriendView = Backbone.View.extend({
		el: '#friends',
		initialize: function(){
			console.info('FriendView.init');
			var AppState = this.options.appState;
			
			 _.bindAll(this, 'addOne', 'addAll');
			
			this.collection = AppState.get('friends');
			this.collection.on('add', this.addOne);
			this.collection.on('reset', this.addAll);
			this.collection.fetch();
		},
		events: {},
		addOne: function(item, index){
			console.log('FriendView.addOne')

			// check for title attribute on status + if not expired
			// //if( !item.get('status').title ) return;

			var view = new FriendItemView({model:item, appState:this.options.appState});
			this.$el.append(view.render().el);
		},
		addAll: function(){
			console.log('FriendView.addAll')
			this.$('ol').empty();
			
			// var friends = this.collection.where({friendStatus: "friend"});
			// if(friends) friends.forEach(this.addOne);
			this.collection.each(this.addOne);
		}
	});
	
	return FriendView;
	
});