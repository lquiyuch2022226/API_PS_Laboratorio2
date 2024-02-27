const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');
const Curso = require('../models/curso');


const alumnoPost = async (req, res) => {
    const { nombre, correo, password, cursos } = req.body;
    const cursosIds = [];
    const cursosNombres = [];
    if (cursos) {
        for (const nombreCurso of cursos) {
            const curso = await Curso.findOne({ nombreCurso: nombreCurso });
            cursosIds.push(curso._id);
            cursosNombres.push(curso.nombre);
        }
    }

    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const alumno = new Alumno({ nombre, correo, password: hashedPassword, cursos: cursosIds });
    await alumno.save();

    res.status(202).json({
        alumno,
        cursosAsignados: cursosNombres
    });
};

const alumnosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, profesores] = await Promise.all([
        Alumno.countDocuments(query),
        Alumno.find(query)
            .populate('cursos')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        profesores
    });
}


const alumnoGetById = async (req, res) => {
    const { id } = req.params;

        const alumno = await Alumno.findOne({ _id: id })
            .populate('cursos');


        res.status(200).json({
            alumno
        });
}

const alumnoPut = async (req, res = response) => {
    const { id } = req.params;
    const { password, cursos, ...resto } = req.body;

        const idCursos = [];
        const cursosActu = [];
        if (cursos) {
            for (const nombreCurso of cursos) {
                const curso = await Curso.findOne({ nombreCurso: nombreCurso });
                idCursos.push(curso._id);
                cursosActu.push(curso.nombreCurso);
            }
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        await Alumno.findByIdAndUpdate(id, { ...resto, cursos: idCursos });

        const alumno = await Alumno.findOne({ _id: id });

        res.status(200).json({
            msg: 'Alumno a actualizar',
            alumno,
            cursosActu
        });
};


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