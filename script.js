document.addEventListener("DOMContentLoaded", function() {
    // Buscamos el botón
    const boton = document.querySelector("button"); 

    boton.addEventListener("click", function(event) {
        event.preventDefault(); 

        // Intentamos capturar lo que escribiste (ajusta los nombres si son distintos)
        // Aquí suponemos que tus cuadros de texto tienen estos IDs:
        const nombre = document.querySelector("input[type='text']").value;
        const municipio = document.querySelector("select") ? document.querySelector("select").value : "No seleccionado";

        // ¡Aquí es donde pasa algo nuevo!
        alert("¡Hola! He capturado estos datos:\n\nNombre: " + nombre + "\nMunicipio: " + municipio + "\n\nEstado: Guardado temporalmente en la memoria del navegador.");
        
        console.log("Datos recibidos:", {nombre, municipio});
    });
});
