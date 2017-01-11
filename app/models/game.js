var mongoose = require('mongoose');

// define the schema for our user model
var gameSchema = mongoose.Schema({

    gameID : String,
    creatorID : String,
    joinedID : String,
    walker : String,
    figurePosition : {
        white : {
            pawn1 : Array,
            pawn2 : Array,
            pawn3 : Array,
            pawn4 : Array,
            pawn5 : Array,
            pawn6 : Array,
            pawn7 : Array,
            pawn8 : Array,
            rook1 : Array,
            rook2 : Array,
            knight1 : Array,
            knight2 : Array,
            bishop1 : Array,
            bishop2 : Array,
            queen : Array,
            king : Array
        },
        black :{
            pawn1 : Array,
            pawn2 : Array,
            pawn3 : Array,
            pawn4 : Array,
            pawn5 : Array,
            pawn6 : Array,
            pawn7 : Array,
            pawn8 : Array,
            rook1 : Array,
            rook2 : Array,
            knight1 : Array,
            knight2 : Array,
            bishop1 : Array,
            bishop2 : Array,
            queen : Array,
            king : Array
        }
    }
});


// create the model for game and expose it to our app
module.exports = mongoose.model('game', gameSchema);