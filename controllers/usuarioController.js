const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async (req, res) => {

    // Mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // verificar so el usuario ya esta registrado

    const { email, password } = req.body;

    let usuario = await Usuario.findOne({ email });

    if (usuario) {
        return res.status(400).json({ msg: 'EL usuario ya esta registrado' });
    }
    // Crear un nuevo usuario
    usuario = await Usuario(req.body);

    // hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    try {
        await usuario.save();
        res.json({ msg: 'Usuario creado correctamente' });

    } catch (error) {
        console.log(error);
    }


    res.json({ msg: 'usuario registrado correctamente' })
}