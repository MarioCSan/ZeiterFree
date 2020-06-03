const User = require('../app/models/user');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const json2csv = require('json2csv');
const fs = require('fs');
module.exports = (app, passport) => {
    app.use(function (req, res, next) {
        res.locals.message = req.flash('message');
        next();
    });

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
            req.flash('message', 'Las contraseñas no pueden estar vacías');
            res.redirect('/update');
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

                    } else {
                        req.flash('message', 'Contraseña actualizada')
                        res.redirect('/profile');
                        console.log(doc);
                    }
                });
        } else {
            req.flash('message', 'Las contraseñas no son iguales')
            res.redirect('/update');
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
        var email = req.body.emailHidden;

        if (email != '' && email === req.user.local.email) {
            User.findOneAndDelete({
                'local.email': email
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result != null) {
                    console.log(result)
                    req.flash('message', 'Cuenta eliminada')
                    res.redirect('/');
                }
            })
        } else {
            req.flash('message', 'El email no es el mismo que se introdujo para registrarse')
            res.redirect('/delete');
        }
    });


    app.post("/descarga", isLoggedIn, (req, res) => {
        // Aqui ira el metodo de borrado del usuario. Se necesita introducir el email correctamente
        var email = req.body.email;

        if (email != '' && email === req.user.local.email) {

            User.findOne({
                '_id': req.user.id
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result != null) {
                    //   var csvParser = json2csv({ header: true });
                    let csv;
                    var fields = ['email:' + req.user.local.email, 'password: ' + req.user.local.password];
                    try {
                        csv = json2csv.parse(User, {
                            fields
                        });
                    } catch (err) {
                        console.log(err);
                    }

                    fs.writeFile('export' + email + '.csv', csv, function (err) {
                        if (err) throw err;
                        var file = 'export.csv';


                        res.setHeader('Content-disposition', 'attachment; filename=' + file);
                        res.set('Content-Type', 'text/csv');
                        //res.attachment(file);
                        res.status(200).send('csv');

                    });
                }
            })

        } else {
            req.flash('message', 'El email no es el mismo que se introdujo para registrarse')
            res.redirect('/delete');
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

    // function getCsv(userId){
    //     let user = user.findById({'_id': userID});
    //     let csvStream = string
    // }

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