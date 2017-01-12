/**
 * Created by prog on 05.09.16.
 */
"use strict";

;(function(){
    function Game(colorPlayer, figurePosition){
        this.player = colorPlayer;
        this.buildTable = function(){
            var tableTag = document.createElement('table');
            tableTag.className = 'chess-board';
            tableTag.setAttribute('id', 'chess-board');
            document.getElementsByClassName('wrap')[0].appendChild(tableTag);
            for (var i = 1; i < 9; i++){
                var trTag = document.createElement('tr');
                trTag.setAttribute('data-y', i);
                trTag.className = 'rows';
                document.getElementsByClassName('chess-board')[0].appendChild(trTag);
                for (var j = 1; j < 9; j++){
                    var tdTag = document.createElement('td');
                    if(i % 2 === 0) {
                        if (j % 2 !== 0) {
                            tdTag.className = 'black';
                            tdTag.setAttribute('data-x', j);
                        } else {
                            tdTag.setAttribute('data-x', j);
                        }
                    } else {
                        if (j % 2 === 0) {
                            tdTag.className = 'black';
                            tdTag.setAttribute('data-x', j);
                        } else {
                            tdTag.setAttribute('data-x', j);
                        }
                    }
                    document.getElementsByClassName('rows')[i - 1].appendChild(tdTag);
                }
            }
            if(this.player == 'white'){
                var tableRotate = document.getElementsByTagName('table')[0];
                this.transformRotate(tableRotate, 180);
            }
            this.addFigureToBoard(figurePosition);
        };
        this.addFigureToBoard = function(figurePosition) {
            for (var colorName in figurePosition) {
                for (var figureName in figurePosition[colorName]) {
                    var parentTd = document.querySelector('[data-y = "'+ Number(figurePosition[colorName][figureName][0]) +'"] > [data-x = "'+ Number(figurePosition[colorName][figureName][1]) +'"]')
                    var elem = document.createElement('span');
                    elem.className = figurePosition[colorName][figureName][2];
                    elem.setAttribute('data-figurename', figureName);
                    parentTd.appendChild(elem);
                }
            }
            if(this.player == 'white'){
                var spanRotate = document.getElementsByTagName('span');
                for (var r = 0; r < spanRotate.length; r++){
                    this.transformRotate(spanRotate[r], 180);
                }
            }
        };
        this.transformRotate = function (elem, degree){
            elem.style.MozTransform = 'rotate('+degree+'deg)';
            elem.style.WebkitTransform = 'rotate('+degree+'deg)';
            elem.style.OTransform = 'rotate('+degree+'deg)';
            elem.style.MsTransform = 'rotate('+degree+'deg)';
            elem.style.transform = 'rotate('+degree+'deg)';
        };
        this.buildTable();
        var self = this;
        var elem = document.getElementById("chess-board");
        elem.onclick = function (e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                targetColor = target.className.slice(0,1),
                targetParents = target.parentNode.className;
            if (self.player === 'white' && targetColor === 'b' && targetParents !== 'rows'){
                return false;
            }
            if (self.player === 'black' && targetColor === 'w' && targetParents !== 'rows'){
                return false;
            }
            if(targetParents !== 'rows') {
                self.selectFigure(self, target);
            } else {
                self.goOrKillMove(self, target);
            }
        }

    }
    Game.prototype.selectFigure = function(self, target){
        if(target.className === 'wP' || target.className === 'bP'){
            self.calculationPawnMoves(self, target);
        } else if(target.className === 'wR' || target.className === 'bR'){
            self.calculationRookMoves(self, target);
        } else if(target.className === 'wN' || target.className === 'bN'){
            self.calculationKnightMoves(self, target);
        } else if(target.className === 'wB' || target.className === 'bB'){
            self.calculationBishopMoves(self, target);
        } else if(target.className === 'wQ' || target.className === 'bQ'){
            self.calculationQueenMoves(self, target);
        } else if(target.className === 'wK' || target.className === 'bK'){
            self.calculationKingMoves(self, target);
        }
    };
    Game.prototype.calculationPawnMoves = function(self, target){
        var corsArray = self.readCorsAndRemoveFocus(self, target),
            corsY,
            corsX,
            corsXKillLeft = Number(corsArray[0]) + 1,
            corsXKillRight = Number(corsArray[0]) - 1,
            walker = document.body.classList.contains('white');
        target.className  += ' focus';

        if(self.player === 'white' && walker){
            corsY = Number(corsArray[1]) + 1;
            corsX = Number(corsArray[0]);
            self.addClassGo(corsY, corsX);
            self.addClassKill(self, corsY, corsXKillLeft, corsXKillRight);
            if(corsArray[1] === '2') {
                corsY = Number(corsArray[1]) + 2;
                self.addClassGo(corsY, corsX);
            }
        }  else if(self.player === 'black' && !walker){
            corsY = Number(corsArray[1]) - 1;
            corsX = Number(corsArray[0]);
            self.addClassGo(corsY, corsX);
            self.addClassKill(self, corsY, corsXKillLeft, corsXKillRight);
            if(corsArray[1] === '7') {
                corsY = Number(corsArray[1]) - 2;
                self.addClassGo(corsY, corsX);
            }
        }
    };
    Game.prototype.calculationRookMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            walker = document.body.classList.contains('white');
        if(self.player === 'white' && walker) {
            target.className  += ' focus';
            self.moveRookAndForwardMoveQueen(self, corsArray, 'white');
        } else if(self.player === 'black' && !walker) {
            target.className  += ' focus';
            self.moveRookAndForwardMoveQueen(self, corsArray, 'black');
        }
    };
    Game.prototype.calculationKnightMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target);
        target.className  += ' focus';
    };
    Game.prototype.calculationBishopMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            walker = document.body.classList.contains('white');
        if(self.player === 'white' && walker) {
            target.className  += ' focus';
            self.moveBishopAndForwardMoveQueen(self, corsArray, 'white');
        } else if(self.player === 'black' && !walker) {
            target.className  += ' focus';
            self.moveBishopAndForwardMoveQueen(self, corsArray, 'black');
        }
    };
    Game.prototype.calculationQueenMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target);
        target.className  += ' focus';
    };
    Game.prototype.calculationKingMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target);
        target.className  += ' focus';
    };
    Game.prototype.moveRookAndForwardMoveQueen = function(self, corsArray, colorFigure) {
        var elem,
            i,
            corsY,
            corsX;
        for ( i = Number(corsArray[1]) + 1; i <= 8; i++ ){
            corsY = i;
            corsX = Number(corsArray[0]);
            elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
            if(elem != null && elem.childNodes.length === 0){
                elem.className += " go";
            } else if(elem != null && elem.childNodes.length !== 0){
                if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                    elem.className += " kill";
                    break;
                } else if (elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                    elem.className += " kill";
                    break;
                } else {
                    break;
                }
            }
        }
        for ( i = Number(corsArray[1]) - 1; i >= 0; i-- ){
            corsY = i;
            corsX = Number(corsArray[0]);
            elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
            if(elem != null && elem.childNodes.length === 0){
                elem.className += " go";
            } else if(elem != null && elem.childNodes.length !== 0){
                if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                    elem.className += " kill";
                    break;
                } else if (elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                    elem.className += " kill";
                    break;
                } else {
                    break;
                }
            }
        }
        for ( i = Number(corsArray[0]) + 1; i <= 8; i++ ){
            corsY = Number(corsArray[1]);
            corsX = i;
            elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
            if(elem != null && elem.childNodes.length === 0){
                elem.className += " go";
            } else if(elem != null && elem.childNodes.length !== 0){
                if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                    elem.className += " kill";
                    break;
                } else if (elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                    elem.className += " kill";
                    break;
                } else {
                    break;
                }
            }
        }
        for ( i = Number(corsArray[0]) - 1; i >= 0; i-- ){
            corsY = Number(corsArray[1]);
            corsX = i;
            elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
            if(elem != null && elem.childNodes.length === 0){
                elem.className += " go";
            } else if(elem != null && elem.childNodes.length !== 0){
                if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                    elem.className += " kill";
                    break;
                } else if (elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                    elem.className += " kill";
                    break;
                } else {
                    break;
                }
            }
        }
    };
    Game.prototype.moveBishopAndForwardMoveQueen = function(self, corsArray, colorFigure) {
        var elem,
            i,
            returnBishopSteps,
            corsY,
            corsX,
            diferent;

        for ( i = Number(corsArray[1]) + 1; i <= 8; i++ ){
            diferent = i - Number(corsArray[1]);
            corsY = i;
            corsX = Number(corsArray[0]) + diferent;
            returnBishopSteps = bishopSteps(corsY, corsX, colorFigure);
            if(corsX > 8 || corsX < 0 || returnBishopSteps === false) {
                break;
            }
        }
        for ( i = Number(corsArray[1]) + 1; i <= 8; i++ ){
            diferent = i - Number(corsArray[1]);
            corsY = i;
            corsX = Number(corsArray[0]) - diferent;
            returnBishopSteps = bishopSteps(corsY, corsX, colorFigure);
            if(corsX > 8 || corsX < 0 || returnBishopSteps === false) {
                break;
            }
        }
        for ( i = Number(corsArray[1]) - 1; i >= 0; i-- ){
            diferent = i - Number(corsArray[1]);
            corsY = i;
            corsX = Number(corsArray[0]) + diferent;
            returnBishopSteps = bishopSteps(corsY, corsX, colorFigure);
            if(corsX > 8 || corsX < 0 || returnBishopSteps === false) {
                break;
            }
        }
        for ( i = Number(corsArray[1]) - 1; i >= 0; i-- ){
            diferent = i - Number(corsArray[1]);
            corsY = i;
            corsX = Number(corsArray[0]) - diferent;
            returnBishopSteps = bishopSteps(corsY, corsX, colorFigure);
            if(corsX > 8 || corsX < 0 || returnBishopSteps === false) {
                break;
            }
        }
        function bishopSteps(corsY, corsX, colorFigure){
            elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
            if(elem != null && elem.childNodes.length === 0){
                elem.className += " go";
            } else if(elem != null && elem.childNodes.length !== 0){
                if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                    elem.className += " kill";
                    return false;
                } else if (elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                    elem.className += " kill";
                    return false;
                } else {
                    return false;
                }
            }
        }
    };
    Game.prototype.readCorsAndRemoveFocus = function(self, target){
        var corY = target.parentNode.parentNode.dataset.y,
            corX = target.parentNode.dataset.x,
            corsArray = [corX, corY];
        self.cleanTdAndSpan();
        return corsArray;
    };
    Game.prototype.cleanTdAndSpan = function() {
        var chessTableSpan = document.getElementById('chess-board').getElementsByTagName('span'),
            chessTableTd = document.getElementById('chess-board').getElementsByTagName('td');
        for (var i = 0; i < chessTableSpan.length; i++){
            chessTableSpan[i].classList.remove('focus');
        }
        for (var j = 0; j < chessTableTd.length; j++){
            chessTableTd[j].classList.remove('go');
            chessTableTd[j].classList.remove('kill');
        }
    };
    Game.prototype.addClassGo = function(corsY, corsX) {
        var chessTableTrGo = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
        if(chessTableTrGo.childNodes.length === 0) {
            chessTableTrGo.className += ' go';
        }
    };
    Game.prototype.addClassKill = function(self, corsY, corsXKillLeft, corsXKillRight){
        var chessTableTrKill = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsXKillLeft +'"] > span');
        if(chessTableTrKill !== null && ((self.player === 'white' && chessTableTrKill.className.slice(0,1) === 'b') || (self.player === 'black' && chessTableTrKill.className.slice(0,1) === 'w'))){
            chessTableTrKill = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsXKillLeft +'"]');
            chessTableTrKill.className += ' kill';
        }
        chessTableTrKill = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsXKillRight +'"] > span');
        if(chessTableTrKill !== null && ((self.player === 'white' && chessTableTrKill.className.slice(0,1) === 'b') || (self.player === 'black' && chessTableTrKill.className.slice(0,1) === 'w'))){
            chessTableTrKill = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsXKillRight +'"]');
            chessTableTrKill.className += ' kill';
        }
    };
    Game.prototype.goOrKillMove = function(self, target){
        if(target.classList.contains('go')){
           self.goMove(self, target);
        } else if(target.classList.contains('kill')){
            self.killMove();
        }
    };
    Game.prototype.goMove = function(self, target) {
       var elem = document.querySelector('.focus'),
           cordsArray = [];
        cordsArray[0] = target.dataset.x;
        cordsArray[1] = target.parentNode.dataset.y;
        cordsArray[2] = elem.parentNode.dataset.x;
        cordsArray[3] = elem.parentNode.parentNode.dataset.y;
        cordsArray[4] = elem.getAttribute('data-figurename');
       target.appendChild(elem);
       self.cleanTdAndSpan();
       var walker = document.body.classList.contains("white");
       if(walker) {
            walker = 'black';
           document.body.classList.remove("white");
           document.body.classList.add("black");
        } else {
           walker = 'white';
           document.body.classList.remove("black");
           document.body.classList.add("white");
        }
       socket.emit('stepToGo', cordsArray, personID, walker);
    };
    Game.prototype.killMove = function(self, target) {

    };
    window.__games = Game;
})();