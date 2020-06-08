const User = require('../app/models/user');
const Fichaje = require('../app/models/fichar');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const json2csv = require('json2csv');
const {
    Parser,
    transforms: {
        unwind
    }
} = require('json2csv');
const flatten = require('lodash.flatten');
const fs = require('fs');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
/*
Este fichero es largo, pero no te asustes, existen comentarios para ayudarte.
Cada ruta incluye su algoritmo dentro, por ello es un fichero largo.
En futuras versiones se debe adelgazar el código aquí presente y utilizar funciones externas. Por falta de tiempo no pudo hacerse y se quedo así.
Buena suerte 
*/
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
        // Cambia la contraseña del usuario conectado con la confirmación de las nuevas contraseñas
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

    //Rutas Contraseña olvidada
    app.get('/forgot', (req, res) => {
        res.render('forgot', {
            message: req.flash('forgotMessage')
        });
    });

    app.post('/forgot', function (req, res, next) {
            async.waterfall([
                function (done) {
                    crypto.randomBytes(20, function (err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function (token, done) {
                    User.findOne({
                        'local.email': req.body.email
                    }, function (err, user) {
                        if (!user) {
                            req.flash('forgotMessage', 'No hay registrado un usuario con esa dirección de correo.');
                            return res.redirect('/forgot');
                        }

                        user.local.resetPasswordToken = token;
                        user.local.resetPasswordExpires = Date.now() + 3600000; // !!!! 1 hora revisar!!!

                        user.save(function (err) {
                            done(err, token, user);
                        });
                    });
                },
                function (token, user, done) {
                    var smtpTransport = nodemailer.createTransport( /*'SMTP'*/ {
                        service: 'SendGrid',
                        // host: ,
                        // port: 25,
                        // secure: false,
                        auth: {
                            user: 'noReplyZeiterFree',
                            pass: 'Zeiterfree0'
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    var mailOptions = {
                        to: user.local.email,
                        //to: 'amarvie85@gmail.com',

                        from: 'amarvie85@gmail.com',
                        subject: 'Solicitud de reinicio de contraseña',
                        text: 'Está recibiendo este aviso porque usted (o un tercero) ha solicitado el reinicio de la contraseña de su cuenta.\n\n' +
                            'Por favor pulse sobre el siguiente enlace, o copie esta ruta en su navegador para completar el proceso:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'Si no ha realizado dicha petición, por favor ignore este mensaje y su contraseña permanecerá sin cambios.\n'
                    };
                    smtpTransport.sendMail(mailOptions, function (err) {
                        req.flash('forgotMessage', 'Se ha enviado un correo a ' + user.local.email + ' indicando instrucciones.');
                        done(err, 'done');
                    });
                }
            ], function (err) {
                if (err) return next(err);
                res.redirect('/forgot');
            });
        },
        function (token, done) {
            User.findOne({
                email: req.body.email
            }, function (err, user) {});
        });

    // Rutas reinicio de contraseña
    app.get('/reset/:token', function (req, res) {
        User.findOne({
            'local.resetPasswordToken': req.params.token /*, resetPasswordExpires: { $gt: Date.now() }*/
        }, function (err, user) {
            if (!user) {
                console.log('parametro: ' + req.params.token);
                //console.log('token bbdd usuario: '+ user.local.resetPasswordToken);
                req.flash('errorMessage', 'El token para cambiar la contraseña no es correcto o ha caducado.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user,
            });
        });
    });

    app.post('/reset/:token', function (req, res) {
        async.waterfall([
            function (done) {
                if (req.body.newpassword == '' || req.body.confpassword == '') {
                    req.flash('errorMessage', 'Los campos han de estar rellenos.');
                    return res.redirect('back');
                } else if (req.body.newpassword !== req.body.confpassword) {
                    req.flash('errorMessage', 'Las contraseñas no coinciden.');
                    return res.redirect('back');
                }
                User.findOne({
                    'local.resetPasswordToken': req.params.token /*, resetPasswordExpires: { $gt: Date.now() }*/
                }, function (err, user) {
                    if (!user) {
                        req.flash('errorMessage', 'El token para cambiar la contraseña no es correcto.');
                        return res.redirect('/');

                    }
                    user.local.password = user.generateHash(req.body.newpassword);
                    user.local.resetPasswordToken = undefined;
                    user.local.resetPasswordExpires = undefined;


                    user.save(function (err) {
                        done(err, user);
                    });

                });
            },
            function (user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'SendGrid',
                    //host: ,
                    // port: 25,
                    // secure: false,
                    auth: {
                        user: 'noReplyZeiterFree',
                        pass: 'Zeiterfree0'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                var mailOptions = {
                    to: user.local.email,
                    from: 'amarvie85@gmail.com',
                    subject: 'Su contraseña ha sido cambiada',
                    text: 'Estimado usuario,\n\n' +
                        'Le confirmamos que la contraseña de su cuenta ha sido modificada.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash('successMessage', 'La contraseña se ha modificado correctamente.');
                    done(err);
                });
            }
        ], function (err) {
            res.redirect('/');
        });
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
    });


    app.post("/descarga", isLoggedIn, (req, res) => {
        // Se genera un documento csv con json2csv y que se descargara. La llamada a este metodo solo se hará en la descarga en el momento de borrar
        var email = req.body.email;

        if (email != '' && email === req.user.local.email) {

            User.findById({
                '_id': req.user.id
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result != null) {
                    console.log('query busqueda: ' + result)
                    //  const fields = ['fichajes.fichaje.Tipo:', 'fichajes.fichaje.Fecha', 'fichajes.fichaje.Hora'];
                    //  const transforms = [unwind({
                    //      paths: ['fichajes', 'fichajes'],
                    //      blankOut: true
                    //  })];

                    //  const json2csvParser = new Parser({
                    //      fields,
                    //      transforms
                    //  });

                     let csv
                     try {
                        //  csv = json2csv.parse(User, {
                        //      fields
                        //  });
                        
                        csv = json2csv.parse(result);
                        
                     } catch (err) {
                         console.log(csv)
                     }
                     
                    fs.writeFile(req.user.email + '.csv', csv, function (err) {
                        if (err) throw err;
                        var file = req.user.local.email + '.csv';
                        res.setHeader('Content-disposition', 'attachment; filename=' + file);
                        res.set('Content-Type', 'text/csv');
                        res.attachment(file);
                        res.status(200).send(csv);
                            console.log('exportado: ' + file)
                            console.log('contenido: ' + csv)
                    });
                    
                }
            })
        } else {
            req.flash('message', 'El email no es el mismo que se introdujo para registrarse')
            res.redirect('/delete');
        }
    });

    /*
        El código siguiente se encarga de los fichajes del usurio
    */

    app.get('/consulta', isLoggedIn, (req, res) => {
        res.render('consulta', {
            user: req.user
        })
    });

    app.post('/fichajeE', isLoggedIn, (req, res) => {
        var fichaje = fichar('Entrada');
        if (req.user.id == null || req.user.id == '') {
            console.log('El id del usuario no ha llegado a fichajeE');
        } else {
            console.log(fichaje.fichaje.Tipo);
            console.log(fichaje.fichaje.Hora);
            console.log(fichaje.fichaje.Fecha);
            var usu = req.user.id;
            guardaFichaje(usu, fichaje);
        }
    });
    const Fichaje = require('./models/fichar');
    const User = require('./models/user');
    app.post('/fichajeS', isLoggedIn, (req, res) => {
        var fichaje = fichar('Salida');
        var usu = req.user.id;
        guardaFichaje(usu, fichaje);
    });

    function fichar(Entrada_salida) {
        var fichaje = new Fichaje();
        var fecha = new Date();
        var hora = HoraActual(fecha);
        var tipo = Entrada_salida;
        fichaje.fichaje.Tipo = tipo;
        fichaje.fichaje.Hora = HoraNumber(hora);
        fichaje.fichaje.Fecha = fecha.toString().substring(4, 15);

        return fichaje;
    }

    function HoraActual(fecha) {
        var min;
        if (fecha.getMinutes() < 10) {
            min = '0' + fecha.getMinutes();
        } else {
            min = fecha.getMinutes();
        }
        var horaString = fecha.getHours() + '' + min;

        return horaString;
    }

    function HoraNumber(horaString) {
        return parseInt(horaString);
    }

    function guardaFichaje(usuID, fichaje) {
        User.findOne({
            _id: usuID
        }, function (err, doc) {
            if (doc) {
                doc.local.fichajes.push({
                    fichaje: {
                        Tipo: fichaje.fichaje.Tipo,
                        Fecha: fichaje.fichaje.Fecha,
                        Hora: fichaje.fichaje.Hora
                    }
                });
                doc.save(function () {
                    err != null ? console.log(err) : console.log('Fichaje Actualizado');
                });
            }
        });
    }

    //Fin de los fichajes

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
        //encripta la contraseña introducida con un bcrypt de 8 vueltas
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