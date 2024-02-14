const jwt = require('jsonwebtoken');
const Alumno = require('../models/alumno');
const { request, response } = require('express');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }


    try {
        const { aId } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const alumno = await Alumno.findById(aId);

        if(!alumno){
            return res.status(401).json({
                msg: 'Alumno no existe en la base de datos :('
            });
        }

        if(!alumno.estado){
            return res.status(401).json({
                msg: 'Token no valido, este alumno fue eliminado (estado false)'
            });
        }

        req.alumno = alumno;
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