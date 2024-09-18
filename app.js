const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Número de puerto

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // Asegúrate de que este middleware esté presente para manejar JSON
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const apiRoutes = require('./routes/api'); // Asegúrate de que esta ruta es correcta
app.use('/api', apiRoutes);  // Asegúrate de que el prefijo '/api' esté configurado correctamente

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
