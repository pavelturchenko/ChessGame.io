/**
 * Created by prog on 05.09.16.
 */
"use strict";

;(function(){
    function Game(colorPlayer){
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
            this.addFigureToBoard();
        };
        this.addFigureToBoard = function() {
            var cells = document.getElementsByTagName('tr');
            for (var i = 0; i < cells.length; i++) {
                var rows;
                if (i === 0) {
                    rows = cells[i].getElementsByTagName('td');
                    this.rowsOldestFigure(rows, "w");
                }
                if (i === 1) {
                    rows = cells[i].getElementsByTagName('td');
                    this.rowsPawn(rows, "w");
                }
                if (i === 6) {
                    rows = cells[i].getElementsByTagName('td');
                    this.rowsPawn(rows, "b");
                }
                if (i === 7) {
                    rows = cells[i].getElementsByTagName('td');
                    this.rowsOldestFigure(rows, "b");
                }
            }
            if(this.player == 'white'){
                var spanRotate = document.getElementsByTagName('span');
                for (var r = 0; r < spanRotate.length; r++){
                    this.transformRotate(spanRotate[r], 180);
                }
            }

        };
        this.rowsPawn = function(rows, figureColor){
            for (var j = 0; j < 8; j++) {
                var span = document.createElement('span');
                span.className = figureColor + "P";
                rows[j].appendChild(span);
            }
        };
        this.rowsOldestFigure = function(rows, figureColor){
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
                    span.className = figureColor + "K";
                    rows[j].appendChild(span);
                }
                if (j === 4) {
                    span.className = figureColor + "Q";
                    rows[j].appendChild(span);
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
                targetColor = target.className.slice(0,1);
            if (self.player === 'white' && targetColor === 'b'){
                return false;
            }
            if (self.player === 'black' && targetColor === 'w'){
                return false;
            }
            self.selectFigure(self, target);
        }

    }
    Game.prototype.selectFigure = function(self, target){
        if(target.className === 'wP' || target.className === 'bP'){
            self.calculationPawnMoves(self, target);
        } else if(target.className === 'wR' || target.className === 'wP'){
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
        var corsArray = self.readCorsAndRemoveFocus(target);
        target.className  += ' focus';
        var mathSymbol;
        if(self.player === 'white'){
            mathSymbol = '+' ;
        }  else {
            mathSymbol = '-' ;
        }
        console.log(corsArray);
        var corsY = Number(corsArray[1]) + 1,
            corsX = Number(corsArray[1]),
            chessTableTrGo = document.querySelector('[data-y="'+  corsY +'"]');
            // chessTableTrGo = chessTableTrGo.children('td');
            // chessTableTdGo = chessTableTrGo;
        console.log(typeof chessTableTrGo);
        console.log(chessTableTrGo);
        if(corsArray[1] === '7' || corsArray[1] === '2') {

        }
    };
    Game.prototype.calculationRookMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(target);
        target.className  += ' focus';
    };
    Game.prototype.calculationKnightMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(target);
        target.className  += ' focus';
    };
    Game.prototype.calculationBishopMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(target);
        target.className  += ' focus';
    };
    Game.prototype.calculationQueenMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(target);
        target.className  += ' focus';
    };
    Game.prototype.calculationKingMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(target);
        target.className  += ' focus';
    };
    Game.prototype.readCorsAndRemoveFocus = function(target){
        var corY = target.parentNode.parentNode.dataset.y,
            corX = target.parentNode.dataset.x,
            chessTableSpan = document.getElementById('chess-board').getElementsByTagName('span');
        for (var i = 0; i < chessTableSpan.length; i++){
            chessTableSpan[i].classList.remove('focus');
        }
        var corsArray = [corX, corY];
        return corsArray;
    };


    window.__games = Game;

})();






