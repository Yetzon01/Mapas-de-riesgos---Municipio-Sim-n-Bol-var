// 1. Asegúrate de que estas constantes tengan tus llaves de Supabase
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Esta función se activa al darle al botón de registro
async function enviarDatos(event) {
    event.preventDefault();

    // Capturamos lo que el usuario escribió en el formulario
    // IMPORTANTE: Los IDs deben coincidir con tu HTML (ej: id="correo")
    const datosParaGuardar = {
        correo: document.getElementById('correo').value, 
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        cedula_de_identidad: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        comuna: document.getElementById('comuna').value,
        sector: document.getElementById('sector').value
    };

    // Usamos UPSERT en lugar de INSERT
    // Esto le dice a Supabase: "Si el correo ya existe, actualiza la fila. No des error"
    const { data, error } = await _supabase
        .from('registross_voceros') // Nombre exacto de tu tabla en la imagen
        .upsert(datosParaGuardar, { onConflict: 'correo' });

    if (error) {
        console.error("Error:", error.message);
        alert("Error al conectar con Supabase: " + error.message);
    } else {
        alert("¡Registro exitoso o actualizado correctamente!");
        // Aquí puedes redirigir al usuario o limpiar el formulario
    }
}

// 3. Conectamos la función al formulario (cambia 'form-registro' por el ID de tu <form>)
document.getElementById('form-registro').addEventListener('submit', enviarDatos);
