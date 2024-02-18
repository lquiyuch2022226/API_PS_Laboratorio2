const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRolAutorizado, esProfesorRole } = require('../middlewares');

const { existenteEmailProfesor, existeProfesorById, cursoRepetido } = require('../helpers/db-validators');

const {
    profesorPost,
    profesorGet,
    getProfesorById,
    profesorPut,
    profesorDelete
} = require('../controllers/profesor.controller');

const router = Router();

router.post(
    "/",
    [
        check("nombre", "El nombre no puede estar vacío").not().isEmpty(),
        check("password", "La contraseña no puede estar vacía").not().isEmpty(),
        check("correo", "El correo no puede estar vacío"),
        check("password", "La contraseña debe ser mayor a 5 caracteres").isLength({min:5}),
        check("correo", "Debe de ser un correo valido").isEmail(),
        check("correo").custom(existenteEmailProfesor),
        check("cursos").custom(cursoRepetido),
        validarCampos
    ], profesorPost);

router.get("/", profesorGet);

router.get(
    "/:id",
    [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeProfesorById),
        validarCampos
    ], getProfesorById);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeProfesorById),
        check('cursos').custom(cursoRepetido),
        validarCampos
    ], profesorPut);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRolAutorizado('TEACHER_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeProfesorById),
        validarCampos
    ], profesorDelete);

module.exports = router;

