const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumnos');
const { response, request } = require('express');

const alumnoPost = async (req, res) =>{
    const {nombre, correo, password, curso_1, curso_2, curso_3} = req.body;
    const alumno = new Alumno({nombre, correo, password, curso_1, curso_2, curso_3});

    const salt = bcryptjs.genSaltSync();
    alumno.password = bcryptjs.hashSync(password, salt);

    await alumno.save();
    res.status(202).json({
        alumno
    });
}

const alumnosGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, alumnos] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        alumnos
    });
}

const alumnoGetById = async (req, res) =>{
    const {id} = req.params;
    const alumno = await Alumno.findOne({_id: id});

    res.status(200).json({
        alumno
    });
}

const alumnoPut = async (req, res) =>{
    const { id } = req.params;
    const {_id, correo, role, ...resto } = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await Alumno.findByIdAndUpdate(id, resto);

    const alumno = Alumno.findOne({id});

    res.status(200).json({
        msg: 'Este alumno fue actualizado',
        alumno
    });
}

const alumnoDelete = async (req, res) => {
    const {id} = req.params;
    const alumno = await Alumno.findByIdAndUpdate(id, {estado: false});
    const alumnoAutenticado = req.alumno;

    res.status(200).json({
        msg: 'Alumno a eliminar:',
        alumno,
        alumnoAutenticado
    });
}

module.exports = {
    alumnoPost,
    alumnosGet,
    alumnoGetById,
    alumnoPut,
    alumnoDelete
}