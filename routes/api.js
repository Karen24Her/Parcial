const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Importar datos de departamentos y municipios
const departmentsData = require('../data/departments.json');
const townsData = require('../data/towns.json');

// Ruta para obtener departamentos
router.get('/departments', (req, res) => {
    const departments = departmentsData.map(dep => dep.name).sort();
    res.json(departments);
});

// Ruta para obtener municipios por departamento
router.get('/municipalities', (req, res) => {
    const departmentName = req.query.department;
    const department = departmentsData.find(dep => dep.name === departmentName);
    if (department) {
        const municipalities = townsData
            .filter(town => town.department === department.code)
            .map(town => town.name)
            .sort();
        res.json(municipalities);
    } else {
        res.status(404).send('Departamento no encontrado');
    }
});

// Ruta para agregar una nueva película
router.post('/movies', (req, res) => {
    const { movieName, director } = req.body;
    const newMovie = { movieName, director };

    const moviesFilePath = path.join(__dirname, '../data/movies.json');

    // Leer el archivo de películas
    fs.readFile(moviesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de películas:', err);
            return res.status(500).json({ error: 'Error al leer el archivo de películas' });
        }

        const movies = JSON.parse(data);
        movies.push(newMovie);

        // Escribir el nuevo archivo de películas
        fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir el archivo de películas:', err);
                return res.status(500).json({ error: 'Error al escribir el archivo de películas' });
            }

            res.json({ message: 'Película agregada correctamente', movie: newMovie });
        });
    });
});

// Ruta para agregar una nueva ubicación
router.post('/locations', (req, res) => {
    const { department, municipality } = req.body;
    const newLocation = { department, municipality };

    const locationsFilePath = path.join(__dirname, '../data/locations.json');

    // Leer el archivo de ubicaciones
    fs.readFile(locationsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de ubicaciones:', err);
            return res.status(500).json({ error: 'Error al leer el archivo de ubicaciones' });
        }

        const locations = JSON.parse(data);
        locations.push(newLocation);

        // Escribir el nuevo archivo de ubicaciones
        fs.writeFile(locationsFilePath, JSON.stringify(locations, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir el archivo de ubicaciones:', err);
                return res.status(500).json({ error: 'Error al escribir el archivo de ubicaciones' });
            }

            res.json({ message: 'Ubicación agregada correctamente', location: newLocation });
        });
    });
});

module.exports = router;
