/**
 * Created by prog on 05.09.16.
 */
"use strict";

var socket = io(),
    personID;

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
var creatorSessionID = getCookie('ChessGame');
var personSessionID = getCookie('persSesID');
console.log(creatorSessionID);
console.log(personSessionID);

;(function(){
    function Game(){
        Game.player = true;
        Game.elemClass = "";
        Game.buildTable = function(){
            document.write('<table>');
            for (var i = 1; i < 9; i++) {
                document.write('<tr data-x='+i+'>');
                for(var j = 1; j < 9; j++){
                    if(i % 2 === 0) {
                        if(j % 2 !== 0){
                            document.write('<td data-y='+j+' class="black"></td>');
                        } else {
                            document.write('<td data-y='+j+'></td>')
                        }
                    } else {
                        if(j % 2 === 0){
                            document.write('<td data-y='+j+' class="black"></td>');
                        } else {
                            document.write('<td data-y='+j+'></td>');
                        }
                    }
                }
                document.write('</tr>');
            }
            document.write('</table>');
            Game.addFigureToBoard();
        };
        Game.addFigureToBoard = function() {
            var cells = document.getElementsByTagName('tr');
            for (var i = 0; i < cells.length; i++) {
                var rows;
                if (i === 0) {
                    rows = cells[i].getElementsByTagName('td');
                    Game.rowsOldestFigure(rows, "b");
                }
                if (i === 1) {
                    rows = cells[i].getElementsByTagName('td');
                    Game.rowsPawn(rows, "b");
                }
                if (i === 6) {
                    rows = cells[i].getElementsByTagName('td');
                    Game.rowsPawn(rows, "w");
                }
                if (i === 7) {
                    rows = cells[i].getElementsByTagName('td');
                    Game.rowsOldestFigure(rows, "w");
                }

            }
        };
        Game.rowsPawn = function(rows, figureColor){
            for (var j = 0; j < 8; j++) {
                var span = document.createElement('span');
                span.className = figureColor + "P";
                rows[j].appendChild(span);
            }
        };
        Game.rowsOldestFigure = function(rows, figureColor){
            for (var j = 0; j < 8; j++) {
                var span = document.createElement('span');
                if (j === 0 || j === 7) {
                    span.className = figureColor + "R";
                    rows[j].appendChild(span);
                }
                if (j === 1 || j === 6) {
                    span.className = figureColor + "N";
                    rows[j].appendChild(span);
                }
                if (j === 2 || j === 5) {
                    span.className = figureColor + "B";
                    rows[j].appendChild(span);
                }
                if (j === 3) {
                    span.className = figureColor + "Q";
                    rows[j].appendChild(span);
                }
                if (j === 4) {
                    span.className = figureColor + "K";
                    rows[j].appendChild(span);
                }
            }
        };
        Game.buildTable();
    }


    window.__games = Game;
})();

var newGame = __games(creatorSessionID);


