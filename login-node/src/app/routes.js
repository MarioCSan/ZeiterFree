const User = require('../app/models/user');
const bcrypt = require('bcrypt-nodejs');
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
        var oldPassword = req.body.oldPassword;
        var confirmPassword = req.body.confirmPassword;
        
        console.log(newPassword);

        if (oldPassword === '' && newPassword === '' && confirmPassword === '') {
            console.log('campos vacios')
        } else if (newPassword === confirmPassword) {
            //Se encripta newPassword
            var encryptedPassword = encriptado(newPassword);
            var id = req.user.id;
            User.update({
                    '_id': id
                }, {
                    $set: {
                        'local.password': encryptedPassword
                    }
                }, {
                    returnNewDocument: true
                },
                function (err, doc) {
                    if (err) {
                        res.redirect('/update');
                    } else {
                        res.redirect('/profile');
                        console.log(doc);
                    }
                });
        }


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

    function encriptado(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }

};