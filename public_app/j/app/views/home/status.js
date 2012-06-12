// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'vm',
	'events',
	'views/form',
	'text!templates/status.item.html'
], function($, _, Backbone, Vm, Events, FormView, statusItemTpl){
	
	var StatusView = FormView.extend({
		el: '#status',
		template: _.template(statusItemTpl),
		initialize: function(){
			console.info('FriendView.init');
			var AppState = this.options.appState;
			_.bindAll(this, 'render', 'updateView', 'postForm', 'clearForm', 'showErrors', 'toggleHref');

			this.model = AppState.get('status');
			this.model.bind('change', this.updateView);
			this.model.fetch();
		},
		showErrors: function(){
			this.$('p').html();
		},
		updateView: function(){
			var exp = this.model.get('expiresPretty');
			
			var html = (exp === 'false')
				? 'Please set your status'
				: this.template(this.model.toJSON());
			
			this.$('p:first').html( html );
		},
		postForm: function(e){
			e.preventDefault();
			
			var $form = $(e.target);
			$form.addClass('loading');
			
			var self = this,
				data = $(e.target).serialize();
			
			// navigator.success
			function success(pos){
				self.$('input[name="lat"]').val(pos.coords.latitude);
				self.$('input[name="lng"]').val(pos.coords.longitude);
				send();
			};
			// navigator.error
			function error(msg){
				console.error(msg)
				send();
			};
			function send(){
				// can use save as i dont want all values posted, as some are calculated by the server
				// possible fix, ignor incoming values for these elements! Then model.save(attr)
				$.post('/status', data, function(res){
					$form.removeClass('loading');
					if(!res.error) self.model.set(res);
				});
			}
			
			if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition(success, error);
			} else {
				send();
			}
				
		}
		// countdownTimer(){} // live countdown of time left on status
	});
	
	return StatusView;
	
});