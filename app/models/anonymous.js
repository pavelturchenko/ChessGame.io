var mongoose = require('mongoose');

// define the schema for our user model
var anonymusSchema = mongoose.Schema({

    anonymous : {
        anonymousID : String
    }

});


// create the model for game and expose it to our app
module.exports = mongoose.model('anonymous', anonymusSchema);/**
 * Created by prog on 10.10.16.
 */
