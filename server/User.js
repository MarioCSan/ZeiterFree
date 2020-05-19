var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/pruebas";

var fechaDia = new Date();
   var minutos = (fechaDia.getMinutes() < 10 ? '0' : '') + fechaDia.getMinutes();
   var horaString = fechaDia.getHours() + '' + minutos;
   var horaNumber = parseInt(horaString);

//Conexion con la base de datos de mongo. Todo dentro de esta funcion

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Conexion satisfactoria!");

    var dbo= db.db('pruebas');
    var user = { nombre: 'pepe', password: 'asasasasas', fichajes: {fecha: fechaDia , tipo:'entrada', hora: horaNumber}}

     dbo.collection("pruebas").insertOne(user, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
     });

     //find

     dbo.collection("pruebas").find({}, function (err, result) {
         if (err) throw err;
         console.log(result.name);
         db.close();
     });


});


// // Falta por configurar el acceso y los campos de la base de datos Mongo

// const userSchema = new mongoose.Schema({
//     nombre: String,
//     password: String,
//     fichajes: [{
//         fecha: Date, 
//         tipo: String, 
//         observaciones: String, 
//         hora: Number }]

// });

// const { User } = mongoose.model('User', userSchema);

function entrada(){}

function salida(){}


// module.exports = User;
// module.exports = {
//     test: function (){
//             var fechaDia = new Date();
//             //Si los minutos son menos que 10 añade  un 0 delatnte
//             var minutos = (fechaDia.getMinutes() < 10 ? '0' : '') + fechaDia.getMinutes();
//             var horaString = fechaDia.getHours() + '' + minutos;
//             var horaNumber = parseInt(horaString);
//             console.log('hola')
//             var user = ({
//                 nombre: 'nombre',
//                 password: 'pepe',
//                 fichajes: {
//                     fecha: fechaDia,
//                     hora: horaNumber
//                 }
//             });

//             console.log(user)
//             mongoose.isValidObjectId()
//     }
// }