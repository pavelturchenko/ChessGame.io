var mongoose = require('mongoose');

// define the schema for our user model
var gameListSchema = mongoose.Schema({

    game : {
        idGame : String
    }

});

// generating a hash


// checking if password is valid

// create the model for users and expose it to our app
module.exports = mongoose.model('gameList', gameListSchema);