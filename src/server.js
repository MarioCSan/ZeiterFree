/*
    Madrid 2020
    Repositorio del proyecto: https: //github.com/DrunkPsyduck/ZeiterFree/
    Desarrollado por:
    Adrián Marina Viera: https: //github.com/Amarvie
    Sergio Tejera de la Torre:
    Mario Canales Sánchez: https: //github.com/DrunkPsyduck
*/
const express = require('express');
const app = express();
const socketIO = require('socket.io');

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const { url } = require('./config/database');


mongoose.connect(url, {
    useMongoClient: true
});

require('./config/passport')(passport);

// settings
app.use(flash());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'miSecreto',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



//routes
require('./app/routes')(app, passport);


//static files
app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(app.get('port'), () => {
    console.log('Servidor escuchando en puerto: ', app.get('port'));
});

// Socket
const io = socketIO(server);

io.sockets.on('connection', function (socket) {
    socket.emit('datetime', {
        datetime: new Date().getTime()
    });
});