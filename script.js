// Este código hará que el botón nos avise cuando alguien lo presiona
document.addEventListener("DOMContentLoaded", function() {
    console.log("¡El sistema ambiental está listo!");

    // Aquí buscamos el botón. (Asegúrate de que tu botón en el HTML tenga id='btnRegistrar')
    const boton = document.querySelector("button"); 

    boton.addEventListener("click", function(event) {
        event.preventDefault(); // Esto evita que la página se recargue sola
        alert("¡Recibido! Estamos procesando tu reporte ambiental.");
    });
});
