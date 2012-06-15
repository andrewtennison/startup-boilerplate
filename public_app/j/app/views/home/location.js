// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'google',
	'events',
	'views/form',
	'text!templates/location.item.html'
], function($, _, Backbone, google, Events, FormView, locationItemTpl){

	var LocationView = FormView.extend({
		el: '#locations',
		template: _.template(locationItemTpl),
		initialize: function(){
			console.info('LocationView.init');
			var AppState = this.options.appState;
			 _.bindAll(this, 'render', 'addOne', 'addAll', 'postForm', 'clearForm', 'showErrors', 'toggleHref', 'getLocation');
			 
			this.collection = AppState.get('locations');
			this.collection.on('add', this.addOne);
			this.collection.on('reset', this.addAll);
			this.collection.fetch();

			this.getLocation();

		},
		addOne: function(item, index){
			this.$('ol').append(this.template( item.toJSON() ));
		},
		addAll: function(){
			this.$('ol').empty();
			this.collection.each(this.addOne);
		},
		getLocation: function(){
			if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
			} // END if

			var self = this,
				mapCanvas = $( "#map_canvas" ).get( 0 );

			function handleSuccess(pos){
				console.log(pos);
				var lat = pos.coords.latitude,
					lng = pos.coords.longitude;

				self.map = google.addMapToCanvas( mapCanvas, lat, lng );
			}
			function handleError(err){
				console.log('my position >> error');
				console.log(err);
				if(err.code == 1) alert('you said no :( ')
			}

		}
	});
	
	return LocationView;
	
});