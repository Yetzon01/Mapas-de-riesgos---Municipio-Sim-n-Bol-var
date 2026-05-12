async function manejarAcceso(event) {
    event.preventDefault();

    const correoIngresado = document.getElementById('correo-electronico').value;
    
    // 1. INTENTAMOS BUSCAR SI EL VOCERO YA EXISTE
    let { data: voceroExistente, error: errorBusqueda } = await _supabase
        .from('registross_voceros')
        .select('*')
        .eq('correo', correoIngresado)
        .single(); // Esto busca un solo registro

    if (voceroExistente) {
        // CASO A: EL VOCERO YA EXISTE (LOGIN)
        alert("¡Bienvenido de nuevo, " + voceroExistente.nombre + "!");
        // Aquí puedes redireccionarlo a otra página o mostrar el mapa
        // window.location.href = "dashboard.html"; 
    } else {
        // CASO B: EL VOCERO NO EXISTE (REGISTRO)
        const nuevosDatos = {
            nombre: document.getElementById('nombres').value,
            apellido: document.getElementById('apellidos').value,
            correo: correoIngresado,
            cedula_de_identidad: document.getElementById('cedula-de-identidad').value,
            comuna: document.getElementById('comuna').value
            // ... agrega los demás campos aquí
        };

        const { error: errorInsert } = await _supabase
            .from('registross_voceros')
            .insert([nuevosDatos]);

        if (errorInsert) {
            alert("Error al registrar: " + errorInsert.message);
        } else {
            alert("Registro exitoso. ¡Bienvenido por primera vez!");
        }
    }
}
