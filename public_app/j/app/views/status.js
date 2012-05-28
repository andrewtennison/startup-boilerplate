// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'vm',
	'events',
	'text!templates/status.item.html'
], function($, _, Backbone, Vm, Events, statusItemTpl){
	
	var prettify = function(time){
		var date = new Date(),
			exp = new Date(time),
			s = (exp-date) / 1000;
		
		if(exp < date) return '0, in past';
		
		var h = Math.floor(s / 3600);
		s = s - h * 3600;
		var m = Math.floor(s / 60);
		s = Math.ceil(s - m * 60);
		
		return h + 'h : ' + m + 'm : ' + s +'s';
	};
	
	var StatusView = Backbone.View.extend({
		el: '#status',
		template: _.template(statusItemTpl),
		initialize: function(){
			console.info('FriendView.init');
			var AppState = this.options.appState;
			_.bindAll(this, 'render', 'updateView', 'postForm');
			
			this.model = AppState.get('status');
			this.model.bind('change', this.updateView)
			this.model.fetch();
		},
		render: function(){
			var json = this.model.toJSON();
			json.expires = prettify(json.expires);
			this.$('p').html( this.template(json) );
		},
		events: {
			'submit form' : 'postForm'
		},
		updateView: function(){
			this.render();
		},
		postForm: function(e){
			e.preventDefault();
			var self = this,
				data = $(e.target).serialize();

			function success(pos){
				self.$('input[name="lat"]').val(pos.coords.latitude);
				self.$('input[name="lng"]').val(pos.coords.longitude);
				send();
			};
			function error(msg){
				console.error(msg)
				send();
			};
			function send(){
				// can use save as i dont want all values posted, as some are calculated by the server
				// possible fix, ignor incoming values for these elements! Then model.save(attr)
				$.post('/status', data, function(res){
					if(!res.error) self.model.set(res);
				});
			}
			
			if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition(success, error);
			} else {
				send();
			}
				
		}
	});
	
	return StatusView;
	
});