/**
 * Created by prog on 05.09.16.
 */
"use strict";

;(function(){
    // сам конструтор, содержит в себе построение поля
    function Game(colorPlayer, figurePosition){
        this.player = colorPlayer;
        this.buildTable = function(){
            var tableTag = document.createElement('table');
            tableTag.className = 'chess-board';
            tableTag.setAttribute('id', 'chess-board');
            document.getElementsByClassName('wrap-game')[0].appendChild(tableTag);
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
                    var corsY = figurePosition[colorName][figureName][0],
                        corsX = figurePosition[colorName][figureName][1];
                    if( corsY === 'kill' || corsX === 'kill') {
                        continue;
                    } else {
                        var parentTd = document.querySelector('[data-y = "'+ Number(corsY) +'"] > [data-x = "'+ Number(corsX) +'"]')
                        var elem = document.createElement('span');
                        elem.className = figurePosition[colorName][figureName][2];
                        elem.setAttribute('data-figurename', figureName);
                        parentTd.appendChild(elem);
                    }
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
                if(target.parentElement.classList.contains('kill')){
                    self.goOrKillMove(self, target);
                    return false;
                } else {
                    return false;
                }
            }
            if (self.player === 'black' && targetColor === 'w' && targetParents !== 'rows'){
                if(target.parentElement.classList.contains('kill')){
                    self.goOrKillMove(self, target);
                    return false;
                } else {
                    return false;
                }
            }
            if(targetParents !== 'rows' ) {

                if(targetParents !== 'kill'){
                    self.canMove(self, target);
                }
            } else {
                self.goOrKillMove(self, target);
            }
        }
    }
    // функция выдиления фигуры
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
    // функция расчета хода пешки
    Game.prototype.calculationPawnMoves = function(self, target){
        var corsArray = self.readCorsAndRemoveFocus(self, target),
            corsY,
            corsY2,
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
                corsY2 = Number(corsArray[1]) + 1;
                self.addClassGo(corsY, corsX, 'doubleStep', corsY2);
            }
        }  else if(self.player === 'black' && !walker){
            corsY = Number(corsArray[1]) - 1;
            corsX = Number(corsArray[0]);
            self.addClassGo(corsY, corsX);
            self.addClassKill(self, corsY, corsXKillLeft, corsXKillRight);
            if(corsArray[1] === '7') {
                corsY = Number(corsArray[1]) - 2;
                corsY2 = Number(corsArray[1]) - 1;
                self.addClassGo(corsY, corsX, 'doubleStep', corsY2);
            }
        }
    };
    // функция расчета хода ладьи
    Game.prototype.calculationRookMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            walker = document.body.classList.contains('white'),
            colorWalker = self.player;
        if(colorWalker === 'white' && walker) {
            target.className  += ' focus';
            callSearchForward(self);
        } else if(colorWalker === 'black' && !walker) {
            target.className  += ' focus';
            callSearchForward(self);
        }
        function callSearchForward(self){
            self.searchLeftHorizontal(self, corsArray, colorWalker);
            self.searchRightHorizontal(self, corsArray, colorWalker);
            self.searchTopVertical(self, corsArray, colorWalker);
            self.searchBottomVertical(self, corsArray, colorWalker);
        }
    };
    // функция расчета хода коня
    Game.prototype.calculationKnightMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            corsX = Number(corsArray[0]),
            corsY = Number(corsArray[1]),
            walker = document.body.classList.contains('white');

        if(self.player === 'white' && walker) {
            target.className  += ' focus';
            knightMoveTop(corsX, corsY, 'white');
            knightMoveBottom(corsX, corsY, 'white');
            knightMoveLeft(corsX, corsY, 'white');
            knightMoveRight(corsX, corsY, 'white');
        } else if(self.player === 'black' && !walker) {
            target.className  += ' focus';
            knightMoveTop(corsX, corsY, 'black');
            knightMoveBottom(corsX, corsY, 'black');
            knightMoveLeft(corsX, corsY, 'black');
            knightMoveRight(corsX, corsY, 'black');
        }

        function knightMoveTop(corsX, corsY, colorFigure) {
            var parentXCors = corsX + 1,
                parentYCors = corsY + 2,
                elem;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
                parentXCors = corsX - 1;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
        }
        function knightMoveBottom(corsX, corsY, colorFigure) {
            var parentXCors = corsX + 1,
                parentYCors = corsY - 2,
                elem;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
                parentXCors = corsX - 1;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
        }
        function knightMoveLeft(corsX, corsY, colorFigure) {
            var parentXCors = corsX + 2,
                parentYCors = corsY + 1,
                elem;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
                parentYCors = corsY - 1;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);

        }
        function knightMoveRight(corsX, corsY, colorFigure) {
            var parentXCors = corsX - 2,
                parentYCors = corsY + 1,
                elem;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
                parentYCors = corsY - 1;
                elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
                elemInspection(elem, colorFigure);
        }
        function elemInspection(elem, colorFigure){
            if(elem != null && elem.childNodes.length === 0){
                elem.className += " go";
            } else if(elem != null && elem.childNodes.length !== 0){
                if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                    elem.className += " kill";
                } else if (elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                    elem.className += " kill";
                }
            }
        }
    };
    // функция расчета хода слона
    Game.prototype.calculationBishopMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            walker = document.body.classList.contains('white'),
            colorWalker = self.player;
        if(colorWalker === 'white' && walker) {
            target.className  += ' focus';
            callSearchDiagonal(self);
        } else if(colorWalker === 'black' && !walker) {
            target.className  += ' focus';
            callSearchDiagonal(self);
        }
        function callSearchDiagonal(self){
            self.searchLeftTop(self, corsArray, colorWalker);
            self.searchRightBottom(self, corsArray, colorWalker);
            self.searchRightTop(self, corsArray, colorWalker);
            self.searchLeftBottom(self, corsArray, colorWalker);
        }
    };
    // функция расчета хода ферзя
    Game.prototype.calculationQueenMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            walker = document.body.classList.contains('white'),
            colorWalker = self.player;
        if(self.player === 'white' && walker) {
            target.className  += ' focus';
            callSearchDiagonal(self);
            callSearchForward(self);

        } else if(self.player === 'black' && !walker) {
            target.className  += ' focus';
            callSearchDiagonal(self);
            callSearchForward(self);

        }
        function callSearchDiagonal(self){
            self.searchLeftTop(self, corsArray, colorWalker);
            self.searchRightBottom(self, corsArray, colorWalker);
            self.searchRightTop(self, corsArray, colorWalker);
            self.searchLeftBottom(self, corsArray, colorWalker);
        }
        function callSearchForward(self){
            self.searchLeftHorizontal(self, corsArray, colorWalker);
            self.searchRightHorizontal(self, corsArray, colorWalker);
            self.searchTopVertical(self, corsArray, colorWalker);
            self.searchBottomVertical(self, corsArray, colorWalker);
        }
    };
    // функция арсчета хода короля
    Game.prototype.calculationKingMoves = function(self, target){
        var corsArray = this.readCorsAndRemoveFocus(self, target),
            corsX = Number(corsArray[0]),
            corsY = Number(corsArray[1]),
            walker = document.body.classList.contains('white');
        if(self.player === 'white' && walker) {
            target.className  += ' focus';
            kingMoveTop(corsX, corsY, 'white');
            kingMoveBottom(corsX, corsY, 'white');
            kingMoveLeft(corsX, corsY, 'white');
            kingMoveRight(corsX, corsY, 'white');
        } else if(self.player === 'black' && !walker) {
            target.className  += ' focus';
            kingMoveTop(corsX, corsY, 'black');
            kingMoveBottom(corsX, corsY, 'black');
            kingMoveLeft(corsX, corsY, 'black');
            kingMoveRight(corsX, corsY, 'black');
        }
        function kingMoveTop(corsX, corsY, colorFigure) {
            var parentXCors,
                parentYCors,
                elem;
            parentXCors = corsX + 1;
            parentYCors = corsY + 1;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
            parentXCors = corsX - 1;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
            parentXCors = corsX;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
        }
        function kingMoveBottom(corsX, corsY, colorFigure) {
            var parentXCors,
                parentYCors,
                elem;
            parentXCors = corsX + 1;
            parentYCors = corsY - 1;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
            parentXCors = corsX - 1;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
            parentXCors = corsX;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
        }
        function kingMoveLeft(corsX, corsY, colorFigure) {
            var parentXCors,
                parentYCors,
                elem;
            parentXCors = corsX + 1;
            parentYCors = corsY;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
        }
        function kingMoveRight(corsX, corsY, colorFigure) {
            var parentXCors,
                parentYCors,
                elem;
            parentXCors = corsX - 1;
            parentYCors = corsY;
            elem = document.querySelector('[data-y="'+  parentYCors +'"] > td[data-x="'+  parentXCors +'"]');
            elemInspection(elem, colorFigure, parentXCors, parentYCors);
        }
        function elemInspection(elem, colorFigure, parentXCors, parentYCors){
            var result;
            if(elem != null && elem.childNodes.length === 0){
                result = self.broukenField(self, parentXCors, parentYCors);
                console.log(result)
                if(result == false || result == undefined) {
                    return false;
                } else {
                    elem.className += " go";
                }
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
    // функция проверки битой фигуры
    Game.prototype.canMove = function(self, target){
        var corX = target.parentNode.dataset.x,
            corY = target.parentNode.parentNode.dataset.y,
            targetClass = target.className,
            targetData= target.dataset.figurename,
            i,
            diferent,
            returnBroukFig,
            colorFigure = self.player,
            corsArray = [corX, corY],
            leftDiagonalArray = [],
            rightDiagonalArray = [],
            horizontalArray = [],
            verticalArray = [],
            canIMove = true,
            numberStep = 0,
            kingPosArr = "",
            queenPosArr = "",
            bishopPosArr = "",
            targetPosArr = "",
            colorAnalize,
            colorEnemy;
        self.searchLeftTop(self, corsArray, diferent, returnBroukFig,  leftDiagonalArray, rightDiagonalArray, numberStep);
        self.searchRightBottom(self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep);
        self.searchRightTop(self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep);
        self.searchLeftBottom(self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep);
        self.searchLeftHorizontal(self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep);
        self.searchRightHorizontal(self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep);
        self.searchTopVertical(self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep);
        self.searchBottomVertical(self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep);
        if(colorFigure === "white") {
            colorAnalize = 'w';
            colorEnemy = 'b';
            sortOutLeftDiagonal(colorAnalize, colorEnemy);
            if(typeof kingPosArr != "number") {
                kingPosArr = "";
                queenPosArr = "";
                bishopPosArr = "";
                targetPosArr = "";
                sortOutRightDiagonal(colorAnalize, colorEnemy);
                if(typeof kingPosArr != "number") {
                    kingPosArr = "";
                    queenPosArr = "";
                    bishopPosArr = "";
                    targetPosArr = "";
                    sortOutHorizontal(colorAnalize, colorEnemy);
                    if(typeof kingPosArr != "number") {
                        kingPosArr = "";
                        queenPosArr = "";
                        bishopPosArr = "";
                        targetPosArr = "";
                        sortOutVertival(colorAnalize, colorEnemy);
                    }
                }
            }
        } else {
            colorAnalize = 'b';
            colorEnemy = 'w';
            sortOutLeftDiagonal(colorAnalize, colorEnemy);
            if(typeof kingPosArr != "number") {
                kingPosArr = "";
                queenPosArr = "";
                bishopPosArr = "";
                targetPosArr = "";
                sortOutRightDiagonal(colorAnalize, colorEnemy);
                if(typeof kingPosArr != "number") {
                    kingPosArr = "";
                    queenPosArr = "";
                    bishopPosArr = "";
                    targetPosArr = "";
                    sortOutHorizontal(colorAnalize, colorEnemy);
                    if(typeof kingPosArr != "number") {
                        kingPosArr = "";
                        queenPosArr = "";
                        bishopPosArr = "";
                        targetPosArr = "";
                        sortOutVertival(colorAnalize, colorEnemy);
                    }
                }
            }
        }
        function sortOutLeftDiagonal(colorAnalize, colorEnemy){
            for(i = 0; i < leftDiagonalArray.length; i++ ){
                if(leftDiagonalArray[i][0] === colorAnalize + 'K'){
                    kingPosArr = i;
                }
                if(leftDiagonalArray[i][0] === colorEnemy + 'Q'){
                    queenPosArr = i;
                }
                if(leftDiagonalArray[i][0] === colorEnemy + 'B'){
                    bishopPosArr = i;
                }
                if(leftDiagonalArray[i][0] == targetClass && leftDiagonalArray[i][1] == targetData) {
                    targetPosArr = i;
                }
            }
        }
        function sortOutRightDiagonal(colorAnalize, colorEnemy){
            for(i = 0; i < rightDiagonalArray.length; i++ ){
                if(rightDiagonalArray[i][0] === colorAnalize + 'K'){
                    kingPosArr = i;
                }
                if(rightDiagonalArray[i][0] === colorEnemy + 'Q'){
                    queenPosArr = i;
                }
                if(rightDiagonalArray[i][0] === colorEnemy + 'B'){
                    bishopPosArr = i;
                }
                if(rightDiagonalArray[i][0] == targetClass && rightDiagonalArray[i][1] == targetData) {
                    targetPosArr = i;
                }
            }
        }
        function sortOutHorizontal(colorAnalize, colorEnemy){
            for(i = 0; i < horizontalArray.length; i++ ){

                if(horizontalArray[i][0] === colorAnalize + 'K'){
                    kingPosArr = i;
                }
                if(horizontalArray[i][0] === colorEnemy + 'Q'){
                    queenPosArr = i;
                }
                if(horizontalArray[i][0] === colorEnemy + 'B'){
                    bishopPosArr = i;
                }
                if(horizontalArray[i][0] == targetClass && horizontalArray[i][1] == targetData) {
                    targetPosArr = i;
                }
            }
        }
        function sortOutVertival(colorAnalize, colorEnemy){
            for(i = 0; i < verticalArray.length; i++ ){
                if(verticalArray[i][0] === colorAnalize + 'K'){
                    kingPosArr = i;
                }
                if(verticalArray[i][0] === colorEnemy + 'Q'){
                    queenPosArr = i;
                }
                if(verticalArray[i][0] === colorEnemy + 'B'){
                    bishopPosArr = i;
                }
                if(verticalArray[i][0] == targetClass && verticalArray[i][1] == targetData) {
                    targetPosArr = i;
                }
            }
        }
        // console.log(leftDiagonalArray);
        // console.log(rightDiagonalArray);
        // console.log(horizontalArray);
        // console.log(verticalArray);
        // console.log(queenPosArr + " queen");
        // console.log(bishopPosArr + " bishop");
        // console.log(kingPosArr + " king");
        // console.log(targetPosArr + " target");
        if (typeof kingPosArr == "number") {
            if(queenPosArr - kingPosArr === 2 && targetPosArr > kingPosArr && targetPosArr < queenPosArr){
                canIMove = false;
            }
            if(bishopPosArr - kingPosArr === 2 && targetPosArr > kingPosArr && targetPosArr < queenPosArr){
                canIMove = false;
            }
        }
        if(canIMove === true){
            self.selectFigure(self, target);
        } else {
          console.log('запуск функции расчета возможности удара по фигуре');
        }
    };
    // функция проверки битого поля
    Game.prototype.broukenField = function(self, parentXCors, parentYCors) {
        var corsArray = [parentXCors, parentYCors],
            walker = document.body.classList.contains('white'),
            colorWalker = self.player,
            broukenFiledResalt = true,
            leftTopResult = [],
            leftBottomResult = [],
            rightTopResult = [],
            rightBottomResult = [],
            type,
            canMove = false,
            enemyFigure;
        if(colorWalker === 'white' && walker) {
            callSearchDiagonal(self);
        } else if(colorWalker === 'black' && !walker) {
            callSearchDiagonal(self);
        }
        function callSearchDiagonal(self){
            leftTopResult = self.searchLeftTop(self, corsArray, "", "", "", "", "", true);
            rightBottomResult = self.searchRightBottom(self, corsArray, "", "", "", "", "",true);
            rightTopResult = self.searchRightTop(self, corsArray, "", "", "", "", "", true);
            leftBottomResult = self.searchLeftBottom(self, corsArray, "", "", "", "", "", true);
        }


        for(var i = 0; i < leftTopResult.length; i++){
            console.log(leftTopResult[i]);
            if(leftTopResult[i] == undefined) {
                continue;
            } else {
                type = leftTopResult[i].slice(0,5);
                if(type === "enemy"){
                    canMove = false;
                    enemyFigure = leftTopResult[i].slice(7);
                    if(enemyFigure === "P"){
                        for(var y = i; y >= 0; y--){
                            if((leftTopResult[y].slice(0,5) === 'empty' || leftTopResult[y].slice(0,7) === 'frendly') && i-y > 2) {
                                canMove = true;
                            }
                        }
                    } else if( enemyFigure === "B" || enemyFigure === "Q" ) {
                        for(var y = i; y >= 0; y--){
                            if(leftTopResult[y].slice(0,7) === 'frendly' && i-y > 2) {
                                canMove = true;
                            }
                        }
                    }
                }
            }
            canMove === true
        }
        if(canMove === true){
            parseLeftBottomResult()
        }
        function parseLeftBottomResult(){
            for(var j = 0; j < leftBottomResult.length; j++){
                if(leftBottomResult[i] == undefined) {
                    continue;
                } else {
                    type = leftBottomResult[i].slice(0,5);
                    if(type === "enemy"){
                        enemyFigure = leftTopResult[i].slice(7);
                        if(enemyFigure === "P"){
                            for(var y = i; y >= 0; y--){
                                if((leftTopResult[y].slice(0,5) === 'empty' || leftTopResult[y].slice(0,7) === 'frendly') && i-y > 2) {
                                    canMove = true;
                                }
                            }
                        } else if( enemyFigure === "B" || enemyFigure === "Q" ) {
                            for(var y = i; y >= 0; y--){
                                if(leftTopResult[y].slice(0,7) === 'frendly' && i-y > 2) {
                                    canMove = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        if(canMove === true){
            parseRightBottomResult()
        }
        function parseRightTopResult(){
            for(var k = 0; k < rightTopResult.length; k++){
                if(rightTopResult[i] == undefined) {
                    continue;
                } else {
                    type = rightTopResult[i].slice(0,5);
                    if(type === "enemy"){
                        enemyFigure = leftTopResult[i].slice(7);
                        if(enemyFigure === "P"){
                            for(var y = i; y >= 0; y--){
                                if((leftTopResult[y].slice(0,5) === 'empty' || leftTopResult[y].slice(0,7) === 'frendly') && i-y > 2) {
                                    canMove = true;
                                }
                            }

                        } else if( enemyFigure === "B" || enemyFigure === "Q" ) {
                            for(var y = i; y >= 0; y--){
                                if(leftTopResult[y].slice(0,7) === 'frendly' && i-y > 2) {
                                    canMove = true;
                                }
                            }

                        }
                    }
                }
            }
        }
        if(canMove === true){
            parseRightBottomResult()
        }
        function parseRightBottomResult(){
            for(var z = 0; z < rightBottomResult.length; z++){
                if(rightBottomResult[i] == undefined) {
                    continue;
                } else {
                    type = rightBottomResult[i].slice(0,5);
                    if(type === "enemy"){
                        enemyFigure = leftTopResult[i].slice(7);
                        if(enemyFigure === "P"){
                            for(var y = i; y >= 0; y--){
                                if((leftTopResult[y].slice(0,5) === 'empty' || leftTopResult[y].slice(0,7) === 'frendly') && i-y > 2) {
                                    canMove = true;
                                }
                            }
                        } else if( enemyFigure === "B" || enemyFigure === "Q" ) {
                            for(var y = i; y >= 0; y--){
                                if(leftTopResult[y].slice(0,7) === 'frendly' && i-y > 2) {
                                    canMove = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return canMove;
    };
    // функция расчета диагонали слева-вверх
    Game.prototype.searchLeftTop = function (self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep, broukenFiled){
        var i = 0,
            corX = 0,
            corY = 0,
            arrayOfbroukFig = [];
        if(numberStep != 0 && numberStep != 2){
            numberStep = 1;
        }
        if(self.player == 'white'){
            for ( i = Number(corsArray[0]) + numberStep; i <= 8; i++ ){
                diferent = i - Number(corsArray[0]);
                corX = i;
                corY = Number(corsArray[1]) + diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    arrayOfbroukFig.push(returnBroukFig);
                    if(returnBroukFig === false){
                        return arrayOfbroukFig;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "leftTop", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        } else {
            for ( i = Number(corsArray[0]) - numberStep; i >= 0; i--){
                diferent =  Number(corsArray[0]) - i;
                corX = i;
                corY = Number(corsArray[1]) - diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    if(returnBroukFig === false){
                        return false;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "leftTop", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        }
        return arrayOfbroukFig;
    };
    // функция расчета диагонали справа-вниз
    Game.prototype.searchRightBottom = function (self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep, broukenFiled){
        var i = 0,
            corX = 0,
            corY = 0,
            arrayOfbroukFig = [];
        if(numberStep != 0){
            numberStep = 1;
        }
        if(self.player == 'white'){

            for ( i = Number(corsArray[0]) - numberStep; i > 0; i-- ){
                diferent = i - Number(corsArray[0]);
                corX = i;
                corY = Number(corsArray[1]) + diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    arrayOfbroukFig.push(returnBroukFig)
                    if(returnBroukFig === false){
                        return arrayOfbroukFig;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "rightBottom", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        } else {
            for ( i = Number(corsArray[0]) + 1 ; i > 0; i++ ){
                diferent = i - Number(corsArray[0]);
                corX = i;
                corY = Number(corsArray[1]) + diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    if(returnBroukFig === false){
                        return false;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "rightBottom", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        }
        return arrayOfbroukFig;
    };
    // функция расчета диагонали справа-вверх
    Game.prototype.searchRightTop = function (self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep, broukenFiled){
        var i = 0,
            corX = 0,
            corY = 0,
            arrayOfbroukFig = [];
        if(numberStep != 0){
            numberStep = 1;
        }
        if(self.player == 'white'){
            for ( i = Number(corsArray[0]) - numberStep; i > 0; i-- ){
                diferent = Number(corsArray[0]) - i;
                corX = i;
                corY = Number(corsArray[1]) + diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    arrayOfbroukFig.push(returnBroukFig);
                    if(returnBroukFig === false){
                        return arrayOfbroukFig;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "rightTop", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        } else {
            for ( i = Number(corsArray[0]) + numberStep; i > 0; i++ ){
                diferent = Number(corsArray[0]) - i;
                corX = i;
                corY = Number(corsArray[1]) + diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    if(returnBroukFig === false){
                        return false;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "rightTop", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        }
        return arrayOfbroukFig;
    };
    // функция расчета диагонали слева-вниз
    Game.prototype.searchLeftBottom = function (self, corsArray, diferent, returnBroukFig, leftDiagonalArray, rightDiagonalArray, numberStep, broukenFiled){
        var i = 0,
            corX = 0,
            corY = 0,
            arrayOfbroukFig = [];
        if(numberStep != 0){
            numberStep = 1;
        }
        if(self.player == 'white'){
            for ( i = Number(corsArray[0]) + numberStep; i <= 8; i++ ){
                diferent = i - Number(corsArray[0]);
                corX = i;
                corY = Number(corsArray[1]) - diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    arrayOfbroukFig.push(returnBroukFig)
                    if(returnBroukFig === false){
                        return arrayOfbroukFig;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "leftBottom", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        } else {
            for ( i = Number(corsArray[0]) - 1 ; i <= 8; i-- ){
                diferent = i - Number(corsArray[0]);
                corX = i;
                corY = Number(corsArray[1]) - diferent;
                if (broukenFiled === true) {
                    returnBroukFig = self.bishopStepsBrouken(corY, corX, self);
                    if(returnBroukFig === false){
                        return false;
                    }
                } else {
                    if(numberStep === 0) {
                        returnBroukFig = self.broukenFig(corY, corX, "leftBottom", leftDiagonalArray, rightDiagonalArray);
                    } else {
                        returnBroukFig = self.bishopSteps(corY, corX, self);
                    }
                }
                if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                    break;
                }
            }
        }
        return arrayOfbroukFig;

    };
    // функция расчета горизонтали влево
    Game.prototype.searchLeftHorizontal = function (self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep){
        var i,
            corY,
            corX;
        if(numberStep != 0){
            numberStep = 1;
        }
        for ( i = Number(corsArray[0]) + numberStep; i <= 8; i++ ){
            corY = Number(corsArray[1]);
            corX = i;
            if(numberStep === 0) {
                returnBroukFig = self.broukenFig(corY, corX, "leftHorizontal", horizontalArray, verticalArray);
            } else {
                returnBroukFig = self.rookSteps(corY, corX, self);
            }
            if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                break;
            }
        }
    };
    // функция расчета горизонтали вправо
    Game.prototype.searchRightHorizontal = function (self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep){
        var i,
            corY,
            corX;
        if(numberStep != 0){
            numberStep = 1;
        }
        for ( i = Number(corsArray[0]) - 1; i >= 0; i-- ){
            corY = Number(corsArray[1]);
            corX = i;
            if(numberStep === 0) {
                returnBroukFig = self.broukenFig(corY, corX, "rightHorizontal", horizontalArray, verticalArray);
            } else {
                returnBroukFig = self.rookSteps(corY, corX, self);
            }
            if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                break;
            }
        }
    };
    // функция расчета вертикали вверх
    Game.prototype.searchTopVertical = function (self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep){
        var i,
            corY,
            corX;
        if(numberStep != 0){
            numberStep = 1;
        }
        for ( i = Number(corsArray[1]) + numberStep; i <= 8; i++ ){
            corY = i;
            corX = Number(corsArray[0]);
            if(numberStep === 0) {
                returnBroukFig = self.broukenFig(corY, corX, "topVertical", horizontalArray, verticalArray);
            } else {
                returnBroukFig = self.rookSteps(corY, corX, self);
            }
            if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                break;
            }
        }
    };
    // функция расчета горизонтали вниз
    Game.prototype.searchBottomVertical = function (self, corsArray, returnBroukFig, horizontalArray, verticalArray, numberStep){
        var i,
            corY,
            corX;
        if(numberStep != 0){
            numberStep = 1;
        }
        for ( i = Number(corsArray[1]) - 1; i >= 0; i-- ){
            corY = i;
            corX = Number(corsArray[0]);
            if(numberStep === 0) {
                returnBroukFig = self.broukenFig(corY, corX, "bottomVertical", horizontalArray, verticalArray);
            } else {
                returnBroukFig = self.rookSteps(corY, corX, self);
            }
            if(corX >= 8 || corX <= 0 || corY >= 8 || corY <= 0 || returnBroukFig === false) {
                break;
            }
        }
    };
    // функция сбора данных в диагональ
    Game.prototype.broukenFig = function(corY, corX, wayfrom, leftDiagonalArray, rightDiagonalArray) {
        var elem = document.querySelector('[data-y="'+ corY +'"] > [data-x="' + corX + '"] > span'),
            elemClass,
            elemName,
            newSubArray = [],
            disassembleItem;
        if(elem != null && wayfrom === "leftTop"){
            disassembleItem = parseElem();
            return leftDiagonalArray.push(disassembleItem);
        } else if(elem != null && wayfrom === "rightBottom") {
            disassembleItem = parseElem();
            return leftDiagonalArray.unshift(disassembleItem);
        } else if(elem != null && wayfrom === "rightTop") {
            disassembleItem = parseElem();
            return rightDiagonalArray.push(disassembleItem);
        } else if(elem != null && wayfrom === "leftBottom") {
            disassembleItem = parseElem();
            return rightDiagonalArray.unshift(disassembleItem);
        } else if(elem != null && wayfrom === "leftHorizontal") {
            disassembleItem = parseElem();
            return leftDiagonalArray.unshift(disassembleItem);
        } else if(elem != null && wayfrom === "rightHorizontal") {
            disassembleItem = parseElem();
            return leftDiagonalArray.push(disassembleItem);
        } else if(elem != null && wayfrom === "topVertical") {
            disassembleItem = parseElem();
            return rightDiagonalArray.unshift(disassembleItem);
        } else if(elem != null && wayfrom === "bottomVertical") {
            disassembleItem = parseElem();
            return rightDiagonalArray.push(disassembleItem);
        }
        function parseElem() {
            elemClass = elem.className.slice(0,2);
            elemName = elem.dataset.figurename;
            return newSubArray = [elemClass, elemName];
        }
    };
    // шаги слона по координатам
    Game.prototype.rookSteps = function (corsY, corsX, self){
        var elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]'),
            colorFigure = self.player;
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
    };
    // шаги слона по координатам
    Game.prototype.bishopSteps = function (corsY, corsX, self){
        var elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]'),
            colorFigure = self.player;
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
    };
    // шаги слона для битого поля
    Game.prototype.bishopStepsBrouken = function (corsY, corsX, self){
        var elem = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]'),
            colorFigure = self.player,
            result;
        if(elem != null && elem.childNodes.length !== 0){
            if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "white"){
                result = "enemy " + elem.childNodes[0].className;
                return result;
            } else if(elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "black"){
                result = "enemy " + elem.childNodes[0].className;
                return result;
            } else if(elem.childNodes[0].className.slice(0,1) === 'w' && colorFigure === "white"){
                result = "frendly " + elem.childNodes[0].className;
                return result;
            } else if(elem.childNodes[0].className.slice(0,1) === 'b' && colorFigure === "black"){
                result = "frendly " + elem.childNodes[0].className;
                return result;
            } else {
                result = "empty";
                return result;
            }
        } else {
            result = "empty";
            return result;
        }
    };
    // функция считывания координат и удаление фокуса с фигур
    Game.prototype.readCorsAndRemoveFocus = function(self, target){
        var corY = target.parentNode.parentNode.dataset.y,
            corX = target.parentNode.dataset.x,
            corsArray = [corX, corY];
        self.cleanTdAndSpan();
        return corsArray;

    };
    // функция очистки лишних классов с ячеек и фигур
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
    // функция добавления класса хода
    Game.prototype.addClassGo = function(corsY, corsX , doubleStep, corsY2) {
        var chessTableTrGo;
        if(doubleStep === 'doubleStep'){
            chessTableTrGo = document.querySelector('[data-y="'+  corsY2 +'"] > td[data-x="'+  corsX +'"]');
            if(chessTableTrGo.childNodes.length === 0){
                chessTableTrGo.className += ' go';
            } else {
                return false;
            }
        }
        chessTableTrGo = document.querySelector('[data-y="'+  corsY +'"] > td[data-x="'+  corsX +'"]');
        if(chessTableTrGo.childNodes.length === 0) {
            chessTableTrGo.className += ' go';
        }
    };
    // функция добавления класса удара
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
    // функция считывания клика по классу движения или удара
    Game.prototype.goOrKillMove = function(self, target){
        if(target.classList.contains('go')){
            self.goMove(self, target);

        } else if(target.parentElement.classList.contains('kill')){
            self.killMove(self, target);
        }
    };
    // функция движения при ходе
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
    // функция движения при ударе
    Game.prototype.killMove = function(self, target) {
        var elem = document.querySelector('.focus'),
            parentElem = target.parentElement,
            cordsArray = [];
        cordsArray[0] = target.parentNode.dataset.x;
        cordsArray[1] = target.parentNode.parentNode.dataset.y;
        cordsArray[2] = elem.parentNode.dataset.x;
        cordsArray[3] = elem.parentNode.parentNode.dataset.y;
        cordsArray[4] = elem.getAttribute('data-figurename');
        cordsArray[5] = target.getAttribute('data-figurename');
        target.remove();
        parentElem.appendChild(elem);
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
        socket.emit('stepToKill', cordsArray, personID, walker);
    };
    window.__games = Game;
})();