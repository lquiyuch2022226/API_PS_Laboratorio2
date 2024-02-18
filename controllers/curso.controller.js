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

const cursoPut = async (req, res) =>{
    const { id } = req.params;
    const {_id, profesorId, ...resto } = req.body;

    const cursoActualizado = await Curso.findByIdAndUpdate(id, resto, {new:true});

    await putCursosAlumnos(id, cursoActualizado._id);

    res.status(202).json({
        msg: 'Este Curso fue actualizado',
        cursoActualizado
    });
}


const putCursosAlumnos = async (cursoAnteriorId, nuevoCursoId) => {
    try {
        // Actualizar los cursos de los alumnos que tenían el curso anterior
        await Alumno.updateMany(
            { cursos: cursoAnteriorId },
            { $set: { "cursos.$[elemento]": nuevoCursoId } },
            { arrayFilters: [{ "elemento": cursoAnteriorId }] }
        );

        console.log('Cursos actualizados en los alumnos correctamente.');
        return true; // Indica que la actualización fue exitosa
    } catch (error) {
        console.error('Error al actualizar cursos en los alumnos:', error);
        throw error;
    }
};

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
    cursoPut,
    cursoDelete,
    putCursosAlumnos
}