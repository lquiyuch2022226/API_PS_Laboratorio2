const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRolAutorizado } = require('../middlewares');

const { existeProfesorById, cursoRepetido } = require('../helpers/db-validators');

const {
    cursoPost,
    cursosGet
} = require('../controllers/curso.controller');

const router = Router();

router.post(
    "/",
    [
        check("nombreCurso", "El nombre del curso puede estar vacío").not().isEmpty(),
        check("profesorId").custom(existeProfesorById),
        check("cursos").custom(cursoRepetido),
        validarCampos
    ], cursoPost);

router.get("/", cursosGet);

module.exports = router;