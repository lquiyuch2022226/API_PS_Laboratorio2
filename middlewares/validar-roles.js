const { response } = require('express');

const esAlumnoRole = (req, res, next) =>{
    if(!req.alumno){
        return res.status(500).json({
            msg: 'Se desea validar un alumno sin validar token primero'
        });
    }

    const { role, nombre } = req.alumno;

    if(role !== 'STUDENT_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es un estudiante, no puede usar este endpoint`
        });
    }
    next();
}

const tieneRolAutorizado = (...roles) =>{
    return (req, res, next) =>{
        if(!req.alumno){
            return res.status(500).json({
                msg: 'Se desea validar un alumno sin validar token primero'
            });
        }

        if(!roles.includes(req.alumno.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de los siguientes roles autorizados ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    esAlumnoRole,
    tieneRolAutorizado
}