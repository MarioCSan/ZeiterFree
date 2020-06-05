'use strict'

const mongoose = require('mongoose');
//const esquema = mongoose.Schema;

const fichajeSchema = new mongoose.Schema({
    fichaje:{
        Tipo: String,
        Fecha: String,
        Hora: Number,    
    }
});
module.exports = mongoose.model('Fichaje', fichajeSchema);

fichajeSchema.methods.ToString = function(){
    var tipo = fichajeSchema.Tipo;
    var fecha = fichajeSchema.fecha;
    var hora = fichajeSchema.Hora;
    return 'Tipo: '+tipo+', fecha: '+fecha+', hora: '+hora;
}
//fichajeSchema.methods.HoraActual = function (){
//};



