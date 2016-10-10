/**
 * Created by Павел on 08.10.2016.
 */

var socket = io(),
    personID;
var option;
var creatorSessionID;

socket.emit('connectServer');

socket.on('connectServer', function(personSessionID){
    personID = personSessionID;
});

//    Create new game

$(document).on('click', '#createGame', function(){
    socket.emit('createGame', personID);
    return false;
});
socket.on('createGame', function(personID){
    var creatorID = personID;
    $('.enter-game > ul').append("<li><a class='newGame' data-creatorid="+creatorID+">" + "Game" + "</a></li>")
});

// Connection to game

$(document).on('click', '.newGame', function(){
    var creatorID = $(this).attr('data-creatorid');
    socket.emit("connectToGame", creatorID);
});

socket.on("connectToGame", function(creatorID, personSessionID){

    var creatorID = creatorID;
    var personSessionID = personSessionID;

    if(creatorID === personSessionID || personSessionID === personID) {
        creatorSessionID = creatorID;

        option = (36000);
        setCookie("ChessGame", creatorSessionID, option);
        location.href = '/game';
    }

});

function setCookie(name, value, option){
    option = option || {};
    var expires = option.expires;
    if(typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires*1000);
        expires = option.experis = d;
    }
    if(expires && expires.toUTCString) {
        option.expires = expires.toUTCString();
    }
    value = encodeURIComponent(value);
    var updateCookie = name + "=" + value;
    for (var propName in option){
        updateCookie += '; ' + propName;
        var propValue = option[propName];
        if(propValue !== true) {
            updateCookie += '='+propValue;
        }
    }
    document.cookie = updateCookie;
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}