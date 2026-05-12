async function guardarDatos(event) {
    event.preventDefault();

    const datos = {
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        cedula_de_identidad: document.getElementById('cedula-de-identidad').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo-electronico').value,
        sector: document.getElementById('sector').value,
        comuna: document.getElementById('comuna').value,
        voceria: document.getElementById('voceria').value
    };

    // INSERT puro: Directo a la base de datos sin restricciones
    const { data, error } = await _supabase
        .from('registross_voceros') 
        .insert([datos]);

    if (error) {
        console.error("Error:", error.message);
        alert("Lo sentimos, hubo un detalle técnico: " + error.message);
    } else {
        alert("¡Registro guardado con éxito! Gracias por tu participación.");
        event.target.reset(); // Esto limpia el formulario para el siguiente
    }
}
