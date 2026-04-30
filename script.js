// 1. Configuración de conexión (Asegúrate de que estas variables ya existan en tu HTML o agrégalas aquí)
const supabaseUrl = 'TU_URL_DE_SUPABASE'; // Reemplaza con tu URL
const supabaseKey = 'TU_API_KEY_DE_SUPABASE'; // Reemplaza con tu Key
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Función principal para registrar o actualizar
async function enviarDatos(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Capturamos los datos del formulario (asegúrate de que los IDs coincidan con tu HTML)
    const datos = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        cedula_de_identidad: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('email').value, // Esta es la clave única
        sector: document.getElementById('sector').value,
        comuna: document.getElementById('comuna').value
    };

    // Usamos UPSERT para que si el correo existe, solo actualice y no dé error
    const { data, error } = await _supabase
        .from('registross_voceros') // El nombre de tu tabla en Supabase
        .upsert(datos, { onConflict: 'correo' }); 

    if (error) {
        console.error("Error:", error.message);
        alert("Hubo un error al registrar: " + error.message);
    } else {
        console.log("¡Listo! Datos guardados:", data);
        alert("Registro completado con éxito.");
        document.getElementById('tu-formulario-id').reset(); // Limpia el formulario
    }
}

// 3. Escuchar cuando el usuario haga clic en el botón
document.getElementById('tu-formulario-id').addEventListener('submit', enviarDatos);
