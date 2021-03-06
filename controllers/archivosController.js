const multer = require('multer');
const shorid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {

                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.lenght);
                cb(null, `${shorid.generate()}${extension}`);
            }
        })
    }

    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);
        if (!error) {
            res.json({ archivo: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error);
    }
}

// descarga un arhivo
exports.descargar = async (req, res, next) => {

    // Obtiene el enlace
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo });    

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    // ELiminar el aechivo y la entrada de la BD


    // Si las descargas son igual a 1- Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;
    console.log(descargas);

    if (descargas === 1) {

        // Eliminar el archivo
        req.archivo = nombre;

        // Eliminar la entrada de la base de datos
        await Enlaces.findOneAndRemove(enlace.id);
        next();

    } else {
        
        enlace.descargas--;
        console.log(enlace.descargas);
        await enlace.save();
    }
}