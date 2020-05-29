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


    app.post("/update", isLoggedIn, (req, res) => {
        var newPassword = req.body.newPassword;
        var confirmPassword = req.body.confirmPassword;

        if (newPassword === '' && confirmPassword === '') {
            console.log('campos vacios')
            res.redirect('update');
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
        } else {
            console.log('algo esta mal')
        }
    });

    //delete
    app.get('/delete', isLoggedIn, (req, res) => {
        res.render('delete', {
            user: req.user
        });
    });


    app.post("/delete", isLoggedIn, (req, res) => {
        // Aqui ira el metodo de borrado del usuario. Se necesita introducir el email correctamente
        var email = req.body.email;

        if (email!=''){
            User.findOneAndDelete({'local.email': email}, (err, result) => {
                if (err) console.log(err);
                else console.log(result)
            })
            res.redirect('/');
        } else {
            console.log('whoops')
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

    function getPassword(password) {

        let resultado = User.findOne({
            'local.password': password
        }).exec(function (err, pass) {
            return pass;
        });
    }

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }

};