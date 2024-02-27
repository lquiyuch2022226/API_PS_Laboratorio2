const Alumno = require('../models/alumno');
const Cursos = require('../models/curso');
const Profesor = require('../models/profesor')
const mongoose = require('mongoose');

// Alumnos
const existenteEmail = async (correo = '') => {
    const existeEmail = await Alumno.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

const existeAlumnoById = async (id = '') => {
    const existeAlumno = await Alumno.findOne({ id });
    if (existeAlumno) {
        throw new Error(`El Alumno con el ${id} no existe`);
    }
}

// Profesor
const existenteEmailProfesor = async (correo = '') => {
    const existeEmailProfe = await Profesor.findOne({ correo });
    if (existeEmailProfe) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

const existeProfesorById = async (id = '') => {
    const existeProfesor = await Profesor.findOne({ id });
    if (existeProfesor) {
        throw new Error(`El Profesor con el ${id} no existe`);
    }
}

// Cursos
const esCursoValido = async (cursos = []) => {
    for (const nombreCurso of cursos) {
        const cursoExistente = await Cursos.findOne({ nombreCurso });
 
        if (!cursoExistente) {
            throw new Error(`El curso '${nombreCurso}' no existe en la base de datos`);
        }
    }
};

const cursoRepetido = async (cursos = []) => {
    const cursosIngresados = new Set(cursos);

    if (cursosIngresados.size !== cursos.length) {
        throw new Error(`No se permite asignarse al mismo curso más de una vez`);
    }
}

const maximoTresCursos = async (cursos = []) => {
    if (cursos.length > 3) {
        throw new Error(`El máximo de cursos son 3, por favor elimine los cursos extra`);
    }
}


module.exports = {
    existenteEmail,
    existeAlumnoById,
    esCursoValido,
    cursoRepetido,
    maximoTresCursos,
    existeProfesorById,
    existenteEmailProfesor,
}