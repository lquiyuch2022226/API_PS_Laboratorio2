const Alumno = require('../models/alumnos');

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

module.exports = {
    existenteEmail,
    existeAlumnoById
}