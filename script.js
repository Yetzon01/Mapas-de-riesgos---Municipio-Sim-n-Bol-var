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

    // USAMOS UPSERT: Si el correo existe, actualiza. Si no existe, crea.
    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' }); // <--- IMPORTANTE: 'correo' debe ser el nombre exacto de la columna

    if (error) {
        // Si el error persiste aquí, es porque el nombre de la columna en 'onConflict' no coincide con Supabase
        console.error("Error de Supabase:", error);
        alert("Error al conectar: " + error.message);
    } else {
        alert("¡Acceso correcto! Datos guardados/actualizados.");
        // Aquí podrías redirigir al usuario al mapa o sistema
    }
}
