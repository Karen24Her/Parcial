document.addEventListener('DOMContentLoaded', () => {
    // Formulario y tabla de películas
    const movieForm = document.getElementById('movieForm');
    const moviesTable = document.getElementById('moviesTable');

    // Formulario y tabla de ubicaciones
    const departmentSelect = document.getElementById('department');
    const municipalitySelect = document.getElementById('municipality');
    const locationForm = document.getElementById('locationForm');
    const locationsTable = document.getElementById('locationsTable');

    // Obtener departamentos al cargar la página
    fetch('/api/departments')
        .then(response => response.json())
        .then(departments => {
            departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department;
                option.textContent = department;
                departmentSelect.appendChild(option);
            });
        });

    // Actualizar municipios al cambiar de departamento
    departmentSelect.addEventListener('change', () => {
        municipalitySelect.innerHTML = ''; // Limpiar municipios previos
        const selectedDepartment = departmentSelect.value;

        fetch(`/api/municipalities?department=${selectedDepartment}`)
            .then(response => response.json())
            .then(municipalities => {
                municipalities.forEach(municipality => {
                    const option = document.createElement('option');
                    option.value = municipality;
                    option.textContent = municipality;
                    municipalitySelect.appendChild(option);
                });
            });
    });

    // Manejar envío del formulario de películas
movieForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const movieName = document.getElementById('movieName').value;
    const director = document.getElementById('director').value;

    // Enviar datos al servidor
    fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieName, director })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Agregar la película a la tabla
        const row = document.createElement('tr');
        row.innerHTML = `<td>${data.movie.movieName}</td><td>${data.movie.director}</td>`;
        moviesTable.appendChild(row);
    })
    .catch(error => console.error('Error:', error));

    // Limpiar el formulario
    movieForm.reset();
});

// Manejar envío del formulario de ubicaciones
locationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const department = departmentSelect.value;
    const municipality = municipalitySelect.value;

    // Enviar datos al servidor
    fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department, municipality })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Verifica si la respuesta contiene la ubicación agregada
        if (data.location) {
            // Agregar la ubicación a la tabla
            const row = document.createElement('tr');
            row.innerHTML = `<td>${data.location.department}</td><td>${data.location.municipality}</td>`;
            locationsTable.appendChild(row);
        } else {
            console.error('Error en la respuesta del servidor:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));

    // Limpiar el formulario
    locationForm.reset();
    departmentSelect.dispatchEvent(new Event('change')); // Actualizar municipios
});
});
