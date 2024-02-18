const { Schema, model} = require('mongoose');

const CursosSchema = Schema ({
    nombreCurso:{
        type: String,
        required: [true, 'El nombre del curso es obligatorio']
    },
    descripcion:{
        type: String,
        default: 'No se ha agregado una descripción'
    },
    profesorId:{
        type: String
    },
    estado:{
        type: Boolean,
        default: true
    }


});

module.exports = model('Cursos', CursosSchema);