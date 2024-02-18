const { Schema, model} = require('mongoose');

const CursosSchema = Schema ({
    nombreCurso:{
        type: String,
        required: [true, 'El nombre del curso es obligatorio']
    },
    descripcion:{
        type: String,
    },
    profesorId:{
        type: String
    }


});

module.exports = model('Cursos', CursosSchema);