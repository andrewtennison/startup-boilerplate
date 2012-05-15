
/**
 *  Tests Unit Test
 *  Created by create-test script @ Tue May 08 2012 17:09:15 GMT+0100 (BST)
 **/
/**
 * Dependencies
 */
var     should = require('should')
	  , mongoose = require('mongoose')
	  , example = require('../../models/Test')
	  , Schema = mongoose.Schema
	  , SchemaType = mongoose.SchemaType
	  , ValidatorError = SchemaType.ValidatorError
	  , DocumentObjectId = mongoose.Types.ObjectId
	  , MongooseError = mongoose.Error;

/**
 * Simple expresso tests for the Test model
 */

module.exports = {
		    
  'Test that a model can be created': function(){
	    var Test = mongoose.model('Test');
	    var model = new Test();
	    model.isNew.should.be.true;    
   },
   
  'Test that the model is an instance of a mongoose schema': function(){
    var Test = mongoose.model('Test');
    Test.schema.should.be.an.instanceof(Schema);
    Test.prototype.schema.should.be.an.instanceof(Schema);
  },

  'Test that an Test has all of the default fields and values': function(){
    var Test = mongoose.model('Test');
    var model = new Test();
    model.isNew.should.be.true;
    model.get('_id').should.be.an.instanceof(DocumentObjectId);
    should.equal(undefined, model.get('name'));
   },
   
  'Test that saving a record with invalid fields returns a validation error': function(){
	    var Test = mongoose.model('Test');	    
	    var model = new Test();
	    model.set('name', '');
	    model.save(function(err){
	      err.should.be.an.instanceof(MongooseError);
	      err.errors.name.should.be.an.instanceof(ValidatorError);
	      
	      model.set('name', 'I exist!');
	      model.save(function(err){
	        should.strictEqual(err, null);
	      });
	      
	    });	    
  }

};