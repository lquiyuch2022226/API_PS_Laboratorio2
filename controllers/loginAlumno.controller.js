const { request, response} = require('express');
const Alumno = require('../models/alumno');
const bycryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const loginAlumno = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        const alumno = await Alumno.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, el correo no existe en la base de datos.'
            });
        }

        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos (eliminado)'
            });
        }

        const validarPassword = bycryptjs.compareSync(password, alumno.password);

        if(!validarPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT(alumno.id)

        res.status(200).json({
            msg: 'Bienvenido',
            alumno,
            token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Comuniquese con el admin'
        });
    };

};

module.exports = {
    loginAlumno
}