const User = require('../app/models/user');
module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        res.render('index')
    })

    app.get('/login', (req, res) => {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));


    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user
        });
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    //Update
    app.get('/update', isLoggedIn, (req, res) => {
        res.render('update', {
            user: req.user
        });
    });


    app.post("/update", (req, res) => {
        var newPassword = req.body.newPassword;
        var id = req.user.id;
        console.log(id)
        console.log(newPassword)
        User.findOneAndUpdate({'_id': id}, {$set: {'password': newPassword}},
        function (err, doc){
            if (err) {
                console.log("update document error");
            } else {
                res.redirect('/profile');
                console.log(doc);
            }
        });
    });

    app.param('id', function (req, res, next, id) {
        user.findById(id, function (err, docs) {
            if (err) res.json(err);
            else {
                req.userId = docs;
                next();
            }
        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }

};