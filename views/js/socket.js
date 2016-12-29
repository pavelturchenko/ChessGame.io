/**
 * Created by Павел on 08.10.2016.
 */

var socket = io(),
    personID;



//    Create new game

$(document).on('click', '#createGame', function(){
    var creatorID = getCookie("personID");

    socket.emit('createGame', creatorID);
    return false;
});


socket.on('createGame', function(creatorID){
    var arrayTrueDate = false,
        dataCreate,
        addGame = "<li><a class='newGame' data-creatorid="+creatorID+">" + "Game" + "</a></li>",
        listGames = $('.enter-game ul');
    if(listGames.children().length == 0){
        $('.enter-game > ul').append(addGame);
    } else {
        listGames.find("a").each(function(){
            dataCreate = $(this).attr("data-creatorid");
            if(dataCreate === creatorID){
                arrayTrueDate = true;
            }
        });
        if(arrayTrueDate === false){
            $('.enter-game > ul').append(addGame);
        }
    }
});

// Connection to game

$(document).on('click', '.newGame', function(){
    var creatorID = $(this).attr('data-creatorid');
    personID = getCookie("personID");
    if(personID === creatorID) {
        return false;
    }
    socket.emit("connectToGame", creatorID, personID);
});

socket.on("redirect", function(){
    location.href = '/game';
});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}