const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRolAutorizado } = require('../middlewares');

const { existeProfesorById, cursoRepetido } = require('../helpers/db-validators');

const {
    cursoPost,
    cursosGet,
    cursoPut,
    cursoDelete
} = require('../controllers/curso.controller');

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check("nombreCurso", "El nombre del curso puede estar vacío").not().isEmpty(),
        check("profesorId").custom(existeProfesorById),
        check("cursos").custom(cursoRepetido),
        validarCampos
    ], cursoPost);

router.get("/",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
    ], cursosGet);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        //check('id').custom(existeProfesorById),
        check('cursos').custom(cursoRepetido),
        validarCampos
    ], cursoPut);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        //check('id').custom(existeProfesorById),
        validarCampos
    ], cursoDelete);

module.exports = router;