const jwt = require('jsonwebtoken');
const Alumno = require('../models/alumno');
const Profesor = require('../models/profesor');
const { request, response } = require('express');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }


    try {
        const { aid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        let usuario = await Alumno.findById(aid);

        if (!usuario) {
            usuario = await Profesor.findById(aid);
            if (!usuario) {
                return res.status(400).json({
                    aid,
                    msg: "Este usuario no existe en la base de datos :/ pid",
                    usuario,
                });
            }
        }
        console.log(usuario);

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido, este usuario fue eliminado (estado false)'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}