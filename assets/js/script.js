// URL de la API que devuelve el JSON
const url = 'http://bim.com/assets/php/obtenerUltimoFK.php';

// Función para obtener el último valor de la FK y actualizar el contador
async function obtenerUltimoValorFK() {
    try {
        const response = await fetch(url); // Realizamos la solicitud GET
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json(); // Parseamos la respuesta como JSON
        const ultimoValorFK = data.id_huella; // Obtenemos el último valor de FK

        // Actualizamos el contador en el HTML
        console.log(ultimoValorFK);
        const contadorElement = document.getElementById('contadorUsuarios');
        contadorElement.textContent = `Huellas calculadas: ${ultimoValorFK}`;
        
        // Agregamos la clase 'titulo__bim' al elemento
        contadorElement.classList.add('titulo__bim');
        
    } catch (error) {
        console.error('Error al obtener el valor de la FK:', error);
    }
}

// Llamamos a la función para actualizar el contador
obtenerUltimoValorFK();
