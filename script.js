async function guardarOEntrar(event) {
    event.preventDefault();

    const email = document.getElementById('correo-electronico').value.trim();
    const datos = {
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        cedula_de_identidad: document.getElementById('cedula-de-identidad').value,
        telefono: document.getElementById('telefono').value,
        correo: email,
        sector: document.getElementById('sector').value,
        comuna: document.getElementById('comuna').value,
        voceria: document.getElementById('voceria').value
    };

    // 1. Buscamos si ya existe el correo
    const { data: existe } = await _supabase
        .from('registross_voceros')
        .select('id')
        .eq('correo', email)
        .maybeSingle();

    if (existe) {
        // 2. Si ya existe, ACTUALIZAMOS su información
        await _supabase.from('registross_voceros').update(datos).eq('correo', email);
        alert("¡Datos actualizados con éxito!");
    } else {
        // 3. Si es nuevo, lo INSERTAMOS
        await _supabase.from('registross_voceros').insert([datos]);
        alert("¡Registro exitoso por primera vez!");
    }
}
 