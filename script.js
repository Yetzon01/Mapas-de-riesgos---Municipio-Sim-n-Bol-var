async function accesoSeguro(event) {
    event.preventDefault();

    const email = document.getElementById('correo-electronico').value.trim();
    const nombre = document.getElementById('nombres').value;

    // 1. Intentamos actualizar primero
    const { data, error } = await _supabase
        .from('registross_voceros')
        .update({ nombre: nombre, /* agrega los otros campos aquí */ })
        .eq('correo', email)
        .select();

    // 2. Si el resultado está vacío, es que el correo NO existe, entonces lo creamos
    if (data.length === 0) {
        const { error: insertError } = await _supabase
            .from('registross_voceros')
            .insert([{ correo: email, nombre: nombre /* y los demás */ }]);
        
        if (insertError) {
            alert("Error al registrar: " + insertError.message);
        } else {
            alert("¡Registrado con éxito!");
        }
    } else {
        alert("¡Acceso concedido! Bienvenido " + nombre);
    }
}
 