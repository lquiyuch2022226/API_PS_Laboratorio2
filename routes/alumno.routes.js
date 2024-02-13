const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRolAutorizado } = require('../middlewares');

const {  existenteEmail, existeAlumnoById, esCursoValido} = require('../helpers/db-validators');

const {
    alumnoPost,
    alumnosGet,
    alumnoGetById,
    alumnoPut,
    alumnoDelete
} = require('../controllers/alumno.controller');

const router = Router();

router.post(
    "/",
    [
        check("nombre", "El nombre no puede estar vacío").not().isEmpty(),
        check("password", "La contraseña no puede estar vacía").not().isEmpty(),
        check("password", "La contraseña debe ser mayor a 5 caracteres").not().isEmpty(),
        check("correo", "Debe de ser un correo valido").isEmail(),
        check("correo").custom(existenteEmail),
        check("cursos").custom(esCursoValido),
        validarCampos
    ], alumnoPost);

router.get("/", alumnosGet);

router.get(
    "/:id",
    [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeAlumnoById),
        validarCampos
    ], alumnoGetById);

router.put(
    "/:id",
    [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeAlumnoById),
        validarCampos
    ], alumnoPut);

router.delete(
    "/:id",
    [
        /*validarJWT,
        tieneRolAutorizado('STUDENT_ROLE'),*/
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existeAlumnoById),
        validarCampos
    ], alumnoDelete);

module.exports = router;


