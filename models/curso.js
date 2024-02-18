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

CursosSchema.methods.toJSON = function(){
    const{ __v,password, _id, profesorId, ...curso} = this.toObject();
    curso.Id_del_Curso = _id;
    return curso;
};

module.exports = model('Curso', CursosSchema);