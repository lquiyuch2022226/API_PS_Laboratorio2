const bcryptjs = require('bcryptjs');
const Profesor = require('../models/profesor');
const { response, request } = require('express');

const profesorPost = async (req, res) =>{
    const { nombre, correo, password }= req.body;
    const profesor = new Profesor({nombre, correo, password});

    const salt = bcryptjs.genSaltSync();
    profesor.password = bcryptjs.hashSync(password, salt);

    await profesor.save();
    res.status(202).json({
        profesor
    });
}

const profesorGet = async (req, res) =>{
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, profesores] = await Promise.all([
        Profesor.countDocuments(query),
        Profesor.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        profesores
    });
}

const getProfesorById = async (req, res) =>{
    const {id} = req.params;
    const profesor = await Profesor.findOne({_id : id});

    res.status(200).json({
        profesor
    });
}

const profesorPut = async (req, res) =>{
    const { id } = req.params;
    const {_id, correo, password, role, ...resto } = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const profesorActualizado = await Profesor.findByIdAndUpdate(id, resto, {new:true});

    res.status(202).json({
        msg: 'Este profesor fue actualizado',
        profesorActualizado
    });
}

const profesorDelete = async(req,res)=>{
    const {id} = req.params;
    const profesor = await Profesor.findByIdAndUpdate(id, {estado: false});
    const profesorAutentificado = req.profesor;

    res.status(200).json({
        msg: 'Este profesor fue eliminado',
        profesor,
        profesorAutentificado
    });
}

module.exports = {
    profesorPost,
    profesorGet,
    getProfesorById,
    profesorPut,
    profesorDelete
}