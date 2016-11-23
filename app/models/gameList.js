var mongoose = require('mongoose');

// define the schema for our user model
var gameListSchema = mongoose.Schema({

    gameListID : String
    
});


// create the model for game and expose it to our app
module.exports = mongoose.model('gameList', gameListSchema);
