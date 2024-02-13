const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El Nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role:{
        type: String,
        default: 'STUDENT_ROLE'
    },
    estado:{
        type: Boolean,
        default: true
    },
    curso_1:{
        type: String,
        default: 'No asignado'
    },
    curso_2:{
        type: String,
        default: 'No asignado'
    },
    curso_3:{
        type: String,
        default: 'No asignado'
    }
});

AlumnoSchema.methods.toJSON = function(){
    const{ password, _id, ...alumno} = this.toObject();
    usuario.aId = _id;
    return alumno;
};

module.exports = model('Alumno', AlumnoSchema);