const Alumno = require('../models/alumnos');
const Cursos = require('../models/cursos');

const existenteEmail = async (correo = '') => {
    const existeEmail = await Alumno.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${ correo } ya está registrado`);
    }
}

const existeAlumnoById = async (id = '') => {
    const existeAlumno = await Alumno.findOne({id});
    if(existeAlumno){
        throw new Error(`El Alumno con el ${ id } no existe`)
    }
}

const esCursoValido = async (cursos = ['']) =>{
    for (const curso of cursos) {
        const cursoExistente = await Cursos.findOne({ cursos: curso });
        if (!cursoExistente) {
            throw new Error(`El curso ${curso} no existe en la base de datos`);
        }
    }
}

const cursoRepetido = async (cursos = ['']) =>{
    const cursosSet = new Set(cursos);

    if (cursosSet.size !== cursos.length) {
        throw new Error(`Hay cursos repetidos en la lista`);
    }
}

module.exports = {
    existenteEmail,
    existeAlumnoById,
    esCursoValido
}