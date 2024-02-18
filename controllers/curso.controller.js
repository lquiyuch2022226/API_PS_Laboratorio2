const Curso = require('../models/curso');
const Profesor = require('../models/profesor');

const { response, request } = require('express');

const cursoPost = async (req, res) =>{
    const { nombreCurso, descripcion, profesorId}= req.body;
    const curso = new Curso({nombreCurso, descripcion, profesorId});

    await curso.save();
    res.status(202).json({
        curso
    });
}

const cursosGet = async (req, res) =>{
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        cursos
    });
}

module.exports = {
    cursoPost,
    cursosGet
}