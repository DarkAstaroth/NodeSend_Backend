const Enlaces = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { nombre_original, password } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;
    enlace.password = password;

    // Si el usuario esta autenticado
    if (req.usuario) {
        const { password, descargas } = req.body;
        // Asignar a enlace el numero de descargas
        if (descargas) {
            enlace.descargas = descargas;
        }
        // asignar el password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        // Asignar el autor
        enlace.autor = req.usuario.id
    }

    // Almacenar en la BD
    try {

        await enlace.save();
        return res.json({ msg: `${enlace.url}` });
        next();

    } catch (error) {
        console.log(error);
    }
}

// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

    console.log(req.params.url);
    const { url } = req.params;

    // verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });
    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    // si el enlace existe
    res.json({ archivo: enlace.nombre });

    // Si las descargas son igual a 1- Borrar la entrada y borrar el archivo

    // Si las descargas son > a 1 - Restar 1
}