// 1. CONFIGURACIÓN (Aquí pones tus llaves de Supabase)
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNCIÓN PARA GUARDAR
async function guardarDatos(event) {
    event.preventDefault(); // Esto evita que la página se recargue sola

    // Recolectamos lo que el usuario escribió
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

    // EL TRUCO MÁGICO: .upsert en lugar de .insert
    // Esto le dice a Supabase: "Si el correo ya existe, cámbiale los datos pero no des error"
    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        console.error("Hubo un error:", error.message);
        alert("Error: " + error.message);
    } else {
        alert("¡Excelente! Registro guardado o actualizado con éxito.");
    }
}

// 3. CONECTAR EL FORMULARIO
// Asegúrate de que en tu HTML el <form> tenga id="form-registro"
document.getElementById('form-registro').addEventListener('submit', guardarDatos);
