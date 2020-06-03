const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String,
        //Campos para reinicio de clave
        resetPasswordToken: String,
        resetPasswordExpires: Date
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

module.exports = mongoose.model('User', userSchema);