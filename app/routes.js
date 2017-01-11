var Game = require('../app/models/game'),
    GameList = require('../app/models/gameList');

module.exports = function (app, passport, io) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.cookie('personID', req.sessionID);
        res.render('pages/index.ejs', {pages: 'index'}); // load the index.ejs file
    });

    app.get('/selection-game', function (req, res) {
        res.cookie('personID', req.sessionID);
        res.render('pages/index.ejs', {pages: 'selectGame'});
    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', {message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('pages/profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/game', function (req, res) {
        res.render('pages/index.ejs', {pages: 'game'});
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    /*
     * buildNewGame
     */
    io.on('connection', function (socket) {
        // console.log('a user connection -> ' + socket.id);
        var addGameToList = new GameList();
        // Function to remove all schema
        // GameList.remove({}, function (err) {});
        // Game.remove({}, function (err) {});

        socket.on('selectGame', function () {
            var gameMap = {};
            GameList.find({}, function (err, gameListID) {
                gameListID.forEach(function (gameListID) {
                    gameMap[gameListID._id] = gameListID.gameListID;
                });
                io.emit('selectGame', gameMap);
            });

        });

        socket.on('createGame', function (creatorID) {
            /*При создании игры заносим созданные игры в базу данных
             * Проверяем наличие этой игры в базе, если есть, то не даобавляем*/
            GameList.find({}, function (err, gameListID) {
                var gameGreatEarlier = false;
                gameListID.forEach(function (gameListID) {
                    if (gameListID.gameListID === creatorID) {
                        gameGreatEarlier = true;
                        return false;
                    }
                });
                if (gameGreatEarlier === false) {
                    addGameToList.gameListID = creatorID;
                    addGameToList.socketCreateID = socket.id;
                    addGameToList.save(function (err, addGameToList, affected) {
                        if (err) throw err;
                    });
                }
            });
            socket.join('games' + creatorID);
            io.emit('createGame', creatorID);
        });

        socket.on("connectToGame", function (creatorID, personID) {
            if (creatorID === personID) {
                return false
            }
            var games = 'games' + creatorID;
            socket.join(games);
            /*Заносим в базу данных id игроков, переделать на создание отдельной комнаты*/
            var newGame = new Game(),
                newFigurePositon = {
                    white: {
                        pawn1: [2, 1, 'wP'],
                        pawn2: [2, 2, 'wP'],
                        pawn3: [2, 3, 'wP'],
                        pawn4: [2, 4, 'wP'],
                        pawn5: [2, 5, 'wP'],
                        pawn6: [2, 6, 'wP'],
                        pawn7: [2, 7, 'wP'],
                        pawn8: [2, 8, 'wP'],
                        rook1: [1, 1, 'wR'],
                        rook2: [1, 8, 'wR'],
                        knight1: [1, 2, 'wN'],
                        knight2: [1, 7, 'wN'],
                        bishop1: [1, 3, 'wB'],
                        bishop2: [1, 6, 'wB'],
                        queen: [1, 5, 'wQ'],
                        king: [1, 4, 'wK']
                    },
                    black: {
                        pawn1: [7, 1, 'bP'],
                        pawn2: [7, 2, 'bP'],
                        pawn3: [7, 3, 'bP'],
                        pawn4: [7, 4, 'bP'],
                        pawn5: [7, 5, 'bP'],
                        pawn6: [7, 6, 'bP'],
                        pawn7: [7, 7, 'bP'],
                        pawn8: [7, 8, 'bP'],
                        rook1: [8, 1, 'bR'],
                        rook2: [8, 8, 'bR'],
                        knight1: [8, 2, 'bN'],
                        knight2: [8, 7, 'bN'],
                        bishop1: [8, 3, 'bB'],
                        bishop2: [8, 6, 'bB'],
                        queen: [8, 5, 'bQ'],
                        king: [8, 4, 'bK']
                    }
                };
            newGame.gameID = games;
            newGame.creatorID = creatorID;
            newGame.joinedID = personID;
            newGame.walker = 'white';
            newGame.figurePosition = newFigurePositon;
            newGame.save(function (err, newGame, affected) {
                if (err) throw err;
            });

            io.to(games).emit('redirect', games);
        });

        socket.on('connectServerGame', function () {
            io.emit('connectServerGame', personSessionID);
        });

        socket.on('connectToGameRoom', function (personID) {
            Game.find({}, function (err, gameID) {
                gameID.forEach(function (gameID) {
                    if (gameID.creatorID === personID || gameID.joinedID === personID) {
                        var games = gameID.gameID,
                            walker = gameID.walker,
                            figurePosition = gameID.figurePosition;
                        socket.join(games);
                        io.to(games).emit('connectToGameRoom', gameID.creatorID, gameID.joinedID, games, walker, figurePosition);
                        return false
                    }
                });
            });
        });
        socket.on('stepToGo', function (cordsArray, personID, walker) {
            var cordsName = cordsArray[4],
                newFigurePosition;
            Game.find({}, function (err, gameID) {
                gameID.forEach(function (gameID) {
                    if (gameID.creatorID === personID || gameID.joinedID === personID) {
                        newFigurePosition = gameID.figurePosition;
                        for (var colorName in newFigurePosition) {
                            if(colorName === "white" && colorName != walker){
                                for (var figureName in newFigurePosition[colorName]) {
                                    console.log('white    !')
                                    /*найти и перезаписать нужный элемент*/
                                }
                            } else if(colorName === "black" && colorName != walker){
                                for (var figureName in newFigurePosition[colorName]) {
                                    console.log('black    !')
                                    /*найти и перезаписать нужный элемент*/
                                }
                            }

                        }


                        return false;
                    }
                });
            });

            // Game.update({creatorID: personID}, {
            //     walker: walker,
            //     // figurePosition: {
            //     //     white: {
            //     //         cordsName: [8, 8]
            //     //     }
            //     // }
            // }, function (err, numberAffected, rawResponse) {
            //
            // });
            Game.find({}, function (err, gameID) {
                gameID.forEach(function (gameID) {
                    if (gameID.creatorID === personID) {
                        console.log(gameID.creatorID);
                        console.log(gameID.joinedID);
                        console.log(gameID.figurePosition);
                        console.log(gameID.walker);
                        return false
                    }
                });
            });
        });
        socket.on('disconnect', function () {
            var disconnentId = this.id;
            /*Удаляем игру*/
            GameList.find({}, function (err, gameListID) {
                var gameMap = {};
                gameListID.forEach(function (gameListID) {
                    if (gameListID.socketCreateID == disconnentId) {
                        GameList.remove({"socketCreateID": disconnentId}, function (err, users) {
                        });
                    } else {
                        gameMap[gameListID._id] = gameListID.gameListID;
                    }
                });
                io.emit('disconnectServer', gameMap);
            });
        })
    });
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

