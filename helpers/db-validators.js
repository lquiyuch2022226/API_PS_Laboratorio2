const Alumno = require('../models/alumno');
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
        throw new Error(`El Alumno con el ${ id } no existe`);
    }
}

const esCursoValido = async (cursos = []) =>{
    for (const curso of cursos) {
        const cursoExistente = await Cursos.findOne({ cursos: curso });

        if (!cursoExistente) {
            throw new Error(`El curso ${ curso } no existe en la base de datos`);
        }
    }
}

const cursoRepetido = async (cursos = []) =>{
    const cursosIngresados = new Set(cursos);

    if (cursosIngresados.size !== cursos.length) {
        throw new Error(`No se permite asignarse al mismo curso más de una vez`);
    }
}

const maximoTresCursos = async (cursos = []) =>{
    if (cursos.length > 3) {
        throw new Error(`El máximo de cursos son 3, por favor elimine los cursos extra`);
    }
}

module.exports = {
    existenteEmail,
    existeAlumnoById,
    esCursoValido,
    cursoRepetido,
    maximoTresCursos
}