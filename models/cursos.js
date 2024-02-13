const { Schema, model} = require('mongoose');

const CursosSchema = Schema ({
    cursos:{
        type: String
    }
});

module.exports = model('Cursos', CursosSchema);