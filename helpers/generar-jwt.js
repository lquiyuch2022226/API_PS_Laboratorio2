const jwt = require('jsonwebtoken');

const generarJWT = (aid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { aid };
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '2h',
            },
            (err, token) => {
                err ? (console.log(err),reject('No se puede generar el token')) : (resolve(token));
            }
        );
    });
};

module.exports = {
    generarJWT
}