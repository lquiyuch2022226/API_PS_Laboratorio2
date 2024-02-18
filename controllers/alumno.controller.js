const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');
const Curso = require('../models/curso');


const alumnoPost = async (req, res) => {
    const { nombre, correo, password, cursos } = req.body;
    const alumno = new Alumno({ nombre, correo, password, cursos });

    const salt = bcryptjs.genSaltSync();
    alumno.password = bcryptjs.hashSync(password, salt);

    await alumno.save();
    res.status(202).json({
        alumno
    });
}

const alumnosGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, alumnos] = await Promise.all([
        Alumno.countDocuments(query),
        Alumno.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'cursos',
                select: 'nombreCurso estado',
                transform: doc => {
                    if (doc.estado) {
                        return { nombreCurso: doc.nombreCurso };
                    } else {
                        return { nombreCurso: 'Curso no asignado' };
                    }
                }
            })
    ]);

    res.status(200).json({
        total,
        alumnos
    });
}


const alumnoGetById = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findOne({ _id: id });

    res.status(200).json({
        alumno
    });
}

const alumnoPut = async (req, res) => {
    const { id } = req.params;
    const { _id, correo, password, role, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const alumnoActualizado = await Alumno.findByIdAndUpdate(id, resto, { new: true });

    res.status(202).json({
        msg: 'Este alumno fue actualizado',
        alumnoActualizado
    });
}

const alumnoDelete = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findByIdAndUpdate(id, { estado: false });
    const alumnoAutenticado = req.alumno;

    res.status(200).json({
        msg: 'Alumno a eliminar:',
        alumno,
        alumnoAutenticado
    });
}

module.exports = {
    alumnoPost,
    alumnosGet,
    alumnoGetById,
    alumnoPut,
    alumnoDelete
}