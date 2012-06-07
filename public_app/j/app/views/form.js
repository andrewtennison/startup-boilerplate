// Use this as a quick template for future modules
define([
	'jquery',
	'underscore',
	'backbone',
	'syphon',
	'events'
], function($, _, Backbone, Syphon, Events){
	
	var FormView = Backbone.View.extend({
		events: {
			'submit form' : 'postForm',
			'click .toggle' : 'toggleHref'
		},
		errors: false,
		render: function(){
			console.info('LocationView.render')
			// this.$el.append(this.template( this.model.toJSON() ));
		    // return this;
			//$(this.el).html(layoutTemplate);
		},
		postForm: function(e){
			e.preventDefault();
			this.clearForm();

			var self = this,
				data = Backbone.Syphon.serialize(this);
			this.collection.create(data, {wait: true, success: self.clearForm, error: self.showErrors});
		},
		clearForm: function(){
			console.log('clearForm');
			this.$('form')[0].reset();
			
			if( !this.errors) return;
			
			this.$('p.errMsg').remove();
			this.errors.forEach(function(err){
				err.removeClass('error');
			});
			this.errors = false;
		},
		showErrors: function(model, res){
			var self = this,
				err = $.parseJSON(res.responseText),
				$form = this.$('form');

			$form.prepend('<p class="errMsg">'+err.message+'</p>');
			self.errors = [];
			for(key in err.errors){
				var el = $('[name='+key+']', $form).parent();
				el.addClass('error').attr('data-content', err.errors[key].type);
				self.errors.push(el);
			}
		},
		toggleHref: function(e){
			e.preventDefault();
			var id = e.target.getAttribute('href');
			$(id).toggleClass('off');
		}
	});
	
	return FormView;
	
});