const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRolAutorizado } = require('../middlewares');

const {
    cursoPost,
    cursosGet,
    cursoPut,
    cursoDelete,
    cursosGetForAlumno
} = require('../controllers/curso.controller');

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check("nombreCurso", "El nombre del curso puede estar vacío").not().isEmpty(),
        validarCampos
    ], cursoPost);

router.get("/",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
    ], cursosGet);

router.get("/mostrarCursos", cursosGetForAlumno);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        validarCampos
    ], cursoPut);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        validarCampos
    ], cursoDelete);

module.exports = router;