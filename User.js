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

const User = mongoose.model('User', userSchema);

function entrada(){}

function salida(){}


module.exports = User;