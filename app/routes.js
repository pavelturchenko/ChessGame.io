var Game            = require('../app/models/listGame');

module.exports = function(app, passport, io) {

    var personSessionID;

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        personSessionID = req.sessionID;
        res.render('pages/index.ejs'); // load the index.ejs file
    });

    app.get('/selection-game', function (req, res) {
        personSessionID = req.sessionID;
        res.render('pages/selectGame.ejs'); // load the index.ejs file
    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        personSessionID = req.sessionID;
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
        personSessionID = req.sessionID;
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
        personSessionID = req.sessionID;
        res.render('pages/profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/game', function (req, res) {
        personSessionID = req.sessionID;
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

        socket.on('connectServer', function () {
           io.emit('connectServer', personSessionID);
        });
        
        
        socket.on('createGame', function (personID) {
            io.emit('createGame', personID);
        });

        socket.on("connectToGame", function(creatorID){
            // io.emit("connectToGame");
            var creatorID = creatorID,
                newGame = new Game();

            newGame.game.creatorID = creatorID;
            newGame.game.joinedID = personSessionID;

            io.emit("connectToGame", creatorID, personSessionID);
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
