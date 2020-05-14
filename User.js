const mongoose = require('mongoose');
// Falta por configurar el acceso y los campos de la base de datos Mongo

const userSchema = new mongoose.Schema({
    nombre: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;