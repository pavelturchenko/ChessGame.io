var socket = io(),
    personID;
var option;
var creatorSessionID;

socket.emit('connectServer');

socket.on('connectServer', function(personSessionID){
    personID = personSessionID;
    option = (36000);
    setCookie("persSesID", personID, option);
    console.log(getCookie("persSesID"));
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