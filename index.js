const express = require('express');
const conectarDB = require('./config/db');

// crear el servidor 
const app = express();

// conectar a la base de datos
conectarDB();

console.log('Comenzando Node Send');

// Puerto de la app
const port = process.env.PORT || 8081;

// Habilitar leer los valores de un body
app.use(express.json());

// rutas de la app
app.use('/api/usuarios', require('./router/usuarios'));

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
}); 