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

    function validaPass(newPassword, confirmPassword) {
        //comprueba que se ha introducido bien la contraseña
        return iguales = newPassword === confirmPassword ? true : false;
    }

    passport.use('update', new LocalStrategy({
            email: 'email',
            oldPassword: 'oldPassword',
            newPassword: 'newPassword',
            confirmPassword: 'confirmPassword',
            passReqToCallback: true
        },
        function (req, email, oldPassword, newPassword, confirmPassword, done) {
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                var updateUser = new User();
                if (user) {
                    var passwordConfirm = validaPass(newPassword, confirmPassword);
                    if (email === '') {
                        //Actualizar la contraseña solo
                        if (passwordConfirm) {
                            updateUser.local.password = updateUser.generateHash(newPassword);
                           
                        } else {
                            return done(null, false, req.flash('Las contraseñas no coinciden.'));
                        }
                    } else {
                        // Actualizar todo
                        if (passwordConfirm) {
                            updateUser.local.email = email;
                            updateUser.local.password = updateUser.generateHash(newPassword);
                            
                        } else {
                            return done(null, false, req.flash('updateMessage', 'Las contraseñas no coinciden.'));
                        }
                    }

                }
            })
        }));

}