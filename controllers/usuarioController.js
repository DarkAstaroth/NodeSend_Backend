const Usuario = require('../models/Usuario');

exports.nuevoUsuario = async (req, res) => {

    const usuario = await Usuario(req.body);
    usuario.save();
    res.json({ msg: 'usuario registrado correctamente' })
}