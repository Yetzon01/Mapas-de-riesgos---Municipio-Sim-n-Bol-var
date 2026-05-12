async function guardarDatos(event) {
    event.preventDefault();

    const correoInput = document.getElementById('correo-electronico').value.trim();
    
    const datos = {
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        cedula_de_identidad: document.getElementById('cedula-de-identidad').value,
        telefono: document.getElementById('telefono').value,
        correo: correoInput,
        sector: document.getElementById('sector').value,
        comuna: document.getElementById('comuna').value,
        voceria: document.getElementById('voceria').value
    };

    // PASO 1: Buscar si el correo ya existe
    const { data: existe, error: errorBusqueda } = await _supabase
        .from('registross_voceros')
        .select('correo')
        .eq('correo', correoInput)
        .maybeSingle();

    if (errorBusqueda) {
        alert("Error al consultar: " + errorBusqueda.message);
        return;
    }

    if (existe) {
        // PASO 2: Si existe, ACTUALIZAMOS (update)
        const { error: errorUpdate } = await _supabase
            .from('registross_voceros')
            .update(datos)
            .eq('correo', correoInput);

        if (errorUpdate) {
            alert("Error al actualizar: " + errorUpdate.message);
        } else {
            alert("¡Bienvenido de nuevo! Datos actualizados correctamente.");
        }
    } else {
        // PASO 3: Si no existe, INSERTAMOS (insert)
        const { error: errorInsert } = await _supabase
            .from('registross_voceros')
            .insert([datos]);

        if (errorInsert) {
            alert("Error al registrar: " + errorInsert.message);
        } else {
            alert("¡Registro exitoso! Bienvenido al sistema.");
        }
    }
}
