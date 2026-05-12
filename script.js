// 1. CONFIGURACIÓN
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- FUNCIÓN NUEVA: AUTO-COMPLETAR DATOS ---
// Esto hace que al poner tu correo, se carguen tus datos automáticamente
async function autoCompletarDatos() {
    const correoInput = document.getElementById('correo-electronico').value.trim();
    if (correoInput.length < 5) return;

    const { data, error } = await _supabase
        .from('registross_voceros')
        .select('*')
        .eq('correo', correoInput)
        .order('created_at', { ascending: false }) // Trae el registro más nuevo
        .limit(1)
        .maybeSingle();

    if (data) {
        document.getElementById('nombres').value = data.nombre || '';
        document.getElementById('apellidos').value = data.apellido || '';
        document.getElementById('cedula-de-identidad').value = data.cedula_de_identidad || '';
        document.getElementById('telefono').value = data.telefono || '';
        document.getElementById('sector').value = data.sector || '';
        document.getElementById('comuna').value = data.comuna || '';
        document.getElementById('voceria').value = data.voceria || '';
        console.log("Datos recuperados para facilitar el acceso.");
    }
}

// Escuchar cuando el usuario termina de escribir el correo
document.getElementById('correo-electronico').addEventListener('blur', autoCompletarDatos);


// 2. FUNCIÓN PARA GUARDAR (Modificada para evitar el error ON CONFLICT)
async function guardarDatos(event) {
    if (event) event.preventDefault();

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

    // ELIMINAMOS EL UPSERT Y USAMOS INSERT SIMPLE
    // Esto funciona porque quitaste el "Es único" en la tabla.
    const { data, error } = await _supabase
        .from('registross_voceros') 
        .insert([datos]); 

    if (error) {
        console.error("Hubo un error:", error.message);
        alert("Error al guardar en nube: " + error.message);
    } else {
        alert("¡Excelente! Cambios guardados con éxito.");
        // Si tienes una función para cerrar el mapa o salir, llámala aquí
    }
}

// 3. CONECTAR EL FORMULARIO
document.getElementById('form-registro').addEventListener('submit', guardarDatos);