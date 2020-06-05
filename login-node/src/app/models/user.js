const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String,
        //Campos para reinicio de clave
        resetPasswordToken: String,
        resetPasswordExpires: Date,
       fichajes: [{
           fichaje: {
               Tipo: String,
               Fecha: String,
               Hora: Number
           }
       }]
    },
    facebook: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    twitter: {
        email: String,
        password: String,
        id: String,
        token: String
    },
    google: {
        email: String,
        password: String,
        id: String,
        token: String
    },
});

// const fichajeSchema = new mongoose.Schema({
//     fichaje: {
//         Tipo: String,
//         Fecha: String,
//         Hora: Number,
//     }
// });

//encripta la contraseña para almacenarla
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Compara la contraseña proporcionada con la almacenada
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

//modificar la contraseña
userSchema.methods.updatePassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//Añadir un fichaje
userSchema.methods.ToString = function () {
   
    var tipo = fichajeSchema.Tipo;
    var fecha = fichajeSchema.fecha;
    var hora = fichajeSchema.Hora;
    var fichajes = {'Tipo': tipo, 'fecha': fecha, 'hora': hora};
    return fichajes;
}

//Exports
module.exports = mongoose.model('User', userSchema);
// module.exports = mongoose.model('Fichaje', fichajeSchema);
