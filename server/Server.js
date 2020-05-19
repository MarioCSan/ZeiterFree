// Llamadas a otros componentes de node
require('../connection');
require('./User');


// configuracion conecction. Pruebas. Faltan modulos. 
const User = require('./User');
// Llamadas a variables locales
// user.save(); //guardar

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

    //Set the response HTTP header with HTTP status and Content type
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola Mundo\n');

// Prueba de usuarios con mongo. Separar en otro archivos
    // var fechaDia = new Date();
    // //Si los minutos son menos que 10 añade  un 0 delatnte
    // var minutos = (fechaDia.getMinutes() < 10 ? '0' : '') + fechaDia.getMinutes();
    // var horaString = fechaDia.getHours() + '' + minutos;
    // var horaNumber = parseInt(horaString);
    // console.log('hola')
    // const user = new User({
    //     nombre: 'nombre',
    //     password: 'pepe',
    //     fichajes: {
    //         fecha: fechaDia,
    //         hora: horaNumber
    //     }
    // });

    User.insertarUsuario();
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});