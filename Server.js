// Llamadas a otros componentes de node
require('./connection');
// require('./server/User');

var mongo = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var db = mongo.MongoClient.connect('mongodb://127.0.0.1:27017/pruebas', {
    useUnifiedTopology: true
});

const url = "mongodb://localhost:27017/pruebas";

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.resolve(__dirname, '/public')));
app.use(express.static('public'));

console.log('Server-side code running');

app.listen(8080, () => {
    console.log('listening on 8080');
});

function guardar() {

}

// serve the homepage
app.get('/', (req, res) => {
    app.use('/static', express.static(__dirname + '/public'));
    res.sendFile(__dirname + '/public/registro.htm');
    db.then(function (db) {
        db.collection('pruebas').find({}).toArray().then(function (pruebas) {
            res.status(200).json(pruebas);
        });
    });
});

app.get('/index', (req, res) => {
        app.use('/static', express.static(__dirname + '/public'));
        res.sendFile(__dirname + '/public/index.html');

        var fechaDia = new Date();
        var minutos = (fechaDia.getMinutes() < 10 ? '0' : '') + fechaDia.getMinutes();
        var horaString = fechaDia.getHours() + '' + minutos;
        var horaNumber = parseInt(horaString);
        var entrada = {
            nombre: 'pepe',
            password: 'pepepepep',
            fichajes: [{
                entrada: fechaDia,
                tipo: 'entrada',
                hora: horaNumber,
            }]
        }
        console.log(entrada);

        db.collection('pruebas').insertOne(entrada);

    res.send('Recibido:\n' + JSON.stringify(req.body));
});