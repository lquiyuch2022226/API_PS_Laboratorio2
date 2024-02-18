const Curso = require('../models/curso');
const Alumno = require('../models/alumno');
const jwt = require('jsonwebtoken');

const { response, request } = require('express');

const cursoPost = async (req, res) =>{
    const token = req.header('x-token');

    const { aid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { nombreCurso, descripcion}= req.body;
    const curso = new Curso({nombreCurso, descripcion, profesorId: aid});

    await curso.save();
    res.status(202).json({
        aid,
        curso
    });
}

const cursosGet = async (req, res) => {
    const { limite, desde } = req.query;
    const token = req.header('x-token');

    try {
        const { aid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const query = {estado: true, profesorId: aid };

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            cursos,
            msg: 'Id del profe logeado', aid
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Error al mostra los cursos'
        });
    }
};


const cursosGetForAlumno = async (req, res) => {
    const { limite, desde } = req.query;

    try {
        const query = {estado: true};

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            cursos,
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Error al mostra los cursos'
        });
    }
};

const cursoPut = async (req, res) =>{
    const { id } = req.params;
    const {_id, profesorId, ...resto } = req.body;

    const cursoActualizado = await Curso.findByIdAndUpdate(id, resto, {new:true});

    try {
        await actualizarCursosEnAlumnos(id, cursoActualizado._id);
    } catch (error) {
        console.error('Error al actualizar el curso:', error);
    }

    res.status(202).json({
        msg: 'Este Curso fue actualizado',
        cursoActualizado
    });
}


const actualizarCursosEnAlumnos = async (cursoAnteriorId, nuevoCursoId) => {
    try {
        console.log('Se llama a la funcion de actualizar los cursos');
        // Encuentra todos los alumnos que tienen el curso anterior en su array de cursos
        const alumnosConCursoAnterior = await Alumno.find({ cursos: cursoAnteriorId });
        console.log({ cursos: cursoAnteriorId });
        console.log(alumnosConCursoAnterior);
        // Actualiza el curso específico en el array de cursos del alumno
        await Promise.all(alumnosConCursoAnterior.map(async (alumno) => {
            await Alumno.findOneAndUpdate( // Usa findOneAndUpdate en lugar de findAndUpdate
                { _id: alumno._id, cursos: cursoAnteriorId },
                { $set: { "cursos.$": nuevoCursoId } }
            );
        }));
    } catch (error) {
        console.error('Error al actualizar los cursos en los alumnos:', error);
        throw error;
    }
}


const cursoDelete = async(req,res)=>{
    const {id} = req.params;
    const curso = await Curso.findByIdAndUpdate(id, {estado: false});
    const cursoAutentificado = req.profesor;

    res.status(200).json({
        msg: 'Este curso fue eliminado',
        curso,
        cursoAutentificado
    });
}

module.exports = {
    cursoPost,
    cursosGet,
    cursosGetForAlumno,
    cursoPut,
    cursoDelete,
    actualizarCursosEnAlumnos
}