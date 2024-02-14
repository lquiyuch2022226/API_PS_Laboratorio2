const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El Nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role:{
        type: String,
        default: 'STUDENT_ROLE',
    },
    estado:{
        type: Boolean,
        default: true
    },
    cursos:{
        type: [String],
        default: ['Todavía no hay un curso asignado']
    }
});

AlumnoSchema.methods.toJSON = function(){
    const{ __v,password, _id, ...alumno} = this.toObject();
    alumno.aId = _id;
    return alumno;
};

module.exports = model('Alumno', AlumnoSchema);