const { Router } = require('express');
const { check } = require('express-validator');

const { loginAlumno } = require('../controllers/loginAlumno.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post(
    '/loginAlumno',
    [
        check('correo', 'Este no es un correo valido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], loginAlumno);

module.exports = router;
