const mongoose = require('mongoose');
// Falta por configurar el acceso y los campos de la base de datos Mongo

const userSchema = new mongoose.Schema({
    nombre: String,
    password: String,
    fichajes: [{
        fecha: Date, 
        tipo: String, 
        observaciones: String, 
        hora: Number }]

});

const { User } = mongoose.model('User', userSchema);

function entrada(){}

function salida(){}


module.exports = User;
module.exports = {
    test: function (){
            var fechaDia = new Date();
            //Si los minutos son menos que 10 añade  un 0 delatnte
            var minutos = (fechaDia.getMinutes() < 10 ? '0' : '') + fechaDia.getMinutes();
            var horaString = fechaDia.getHours() + '' + minutos;
            var horaNumber = parseInt(horaString);
            console.log('hola')
            var user = ({
                nombre: 'nombre',
                password: 'pepe',
                fichajes: {
                    fecha: fechaDia,
                    hora: horaNumber
                }
            });

            console.log(user)
    }
}