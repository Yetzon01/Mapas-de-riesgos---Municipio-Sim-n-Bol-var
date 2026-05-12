// Cambia tu función actual por esta
async function guardarCambiosYSalir(event) {
    if (event) event.preventDefault();

    const datosMapa = {
        // Asegúrate de que estos IDs coincidan con los de tu formulario del mapa
        nombre: document.getElementById('nombres').value,
        correo: document.getElementById('correo-electronico').value,
        comuna: document.getElementById('comuna').value,
        sector: document.getElementById('sector').value,
        // Agrega aquí cualquier otro campo que estés capturando del mapa
    };

    // EL CAMBIO CLAVE: Solo .insert() sin nada de 'upsert' o 'onConflict'
    const { data, error } = await _supabase
        .from('registross_voceros')
        .insert([datosMapa]);

    if (error) {
        console.error("Error al guardar:", error.message);
        alert("Error al guardar en nube: " + error.message);
    } else {
        alert("¡Cambios guardados con éxito!");
        // Aquí puedes poner la lógica para salir o cerrar el mapa
        window.location.href = "index.html"; // O la página que prefieras
    }
}
