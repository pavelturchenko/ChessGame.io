var Game = require('../app/models/game'),
    Anonymous = require('../app/models/anonymous'),
    GameList = require('../app/models/gameList');

module.exports = function(app, passport, io) {

    var newAnonymous = new Anonymous();
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        newAnonymous.anonymous.anonymousID = req.sessionID;
        res.cookie('personID', newAnonymous.anonymous.anonymousID);
        res.render('pages/index.ejs'); // load the index.ejs file
    });

    app.get('/selection-game', function (req, res) {
        res.render('pages/selectGame.ejs'); // load the index.ejs file
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
        res.render('pages/game.ejs');
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
        console.log('a user connection');


        socket.on('createGame', function (creatorID) {
            /*При создании игры заносим созданные игры в базу данных*/

            var addGameToList = new GameList({gameListID : creatorID});

            addGameToList.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(GameList.find({ "gameListID" : "dgadTEvu8NkbkrpdC58cVrsF"}));
                }
            });



            io.emit('createGame', creatorID);
        });

        socket.on("connectToGame", function(creatorID, personID){

            /*Заносим в базу данных id игроков, переделать на создание отдельной комнаты*/

            var newGame = new Game();

            creatorSessionID = creatorID;
            personSessionID = personID;

            newGame.game.gameID = creatorSessionID;
            newGame.game.creatorID = creatorSessionID;
            newGame.game.joinedID = personSessionID;

            /*После подключения к игроку дописать удаления этой игры из списка доступных игр*/


            io.emit("connectToGame", creatorSessionID, personSessionID);
        });

        socket.on('connectServerGame', function () {
            io.emit('connectServerGame', personSessionID);
        });

        socket.on('disconnect', function () {
            console.log('user disconnect');
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
};

