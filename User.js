const mongoose = require('mongoose');
// Falta por configurar el acceso y los campos de la base de datos Mongo

const userSchema = new mongoose.Schema({
    nombre: String,
    password: String,
    fichajes: Array

});

const fichajesSchema = new mongoose.Schema({
    fecha: [Date],
    tipo: [String],
    observaciones: [String],
    hora: [Number]
});

const User = mongoose.model('User', userSchema);
const Fichajes = mongoose.model('Fichaje', fichajesSchema);

module.exports = User;