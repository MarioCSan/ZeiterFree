const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // registro
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                'local.email': email
            }, function (err, user) {
                
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'El e-mail ya existe.'));
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            })
        }));

    // login
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'Ese usuario no existe.'));
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Contraseña equivocada'));
                }
                return done(null, user);
            })
        }));

    //update
//    passport.use('local-update', new LocalStrategy({
//            usernameField: 'email',
//            passwordField: 'newPassword',
//            passReqToCallback: true
//        },
//        function (req, email, password, done) {
//            User.findOne({
//                '_id': req.user.id
//            }, function (err, user) {
//                if (err) {
//                    return done(err);
//                }
//                if (!user) {
//                    var user = new User();
//                    user.local.password = password;
//                    user.local.password = user.generateHash(password);
//                    user.save(function (err) {
//                        if (err) {
//                            throw err;
//                        }
//                        return done(null, user);
//                    });
//                }
//            })
//        }));
}