const Usuario = require('../models/Usuario');

exports.nuevoUsuario = async (req, res) => {

    // verificar so el usuario ya esta registrado

    const { email } = req.body;

    let usuario = await Usuario.findOne({ email });

    if (usuario) {
        return res.status(400).json({ msg: 'EL usuario ya esta registrado' });
    }

    usuario = await Usuario(req.body);
    usuario.save();
    res.json({ msg: 'usuario registrado correctamente' })
}