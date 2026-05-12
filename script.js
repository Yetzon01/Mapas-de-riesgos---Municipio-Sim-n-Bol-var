// 1. FUNCIÓN PARA AUTO-COMPLETAR (Para que no sea tedioso)
async function verificarUsuario() {
    const correo = document.getElementById('correo-electronico').value.trim();
    if (correo.length < 5) return;

    // Buscamos si ya existe este correo para traernos tus datos
    const { data, error } = await _supabase
        .from('registross_voceros')
        .select('*')
        .eq('correo', correo)
        .order('id', { ascending: false }) // Trae el más reciente
        .limit(1)
        .maybeSingle();

    if (data) {
        // Si te encuentra, rellena los campos automáticamente
        document.getElementById('nombres').value = data.nombre || '';
        document.getElementById('apellidos').value = data.apellido || '';
        document.getElementById('cedula-de-identidad').value = data.cedula_de_identidad || '';
        document.getElementById('telefono').value = data.telefono || '';
        document.getElementById('sector').value = data.sector || '';
        document.getElementById('comuna').value = data.comuna || '';
        document.getElementById('voceria').value = data.voceria || '';
        console.log("Datos cargados automáticamente");
    }
}

// Escuchar cuando el usuario termina de escribir el correo
document.getElementById('correo-electronico').addEventListener('blur', verificarUsuario);

// 2. FUNCIÓN PARA GUARDAR (Sin errores de conflicto)
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

    // Usamos INSERT simple para evitar el error de "ON CONFLICT"
    const { error } = await _supabase
        .from('registross_voceros')
        .insert([datos]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("¡Datos guardados con éxito!");
    }
}
