// ==========================================
// 1. FUNCIONES DE VALIDACIÓN (Evitan errores en consola)
// ==========================================

function limpiarSiVacio(input) {
    if (input.value.trim() === "") {
        input.classList.remove('error'); // Opcional: quita clase de error visual
    }
}

function verificarCorreo() {
    const correoInput = document.getElementById('correo-electronico');
    if (!correoInput) return false;
    
    const email = correoInput.value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (regex.test(email)) {
        correoInput.style.borderColor = "green";
        return true;
    } else {
        correoInput.style.borderColor = "red";
        return false;
    }
}

// ==========================================
// 2. CONFIGURACIÓN DE SUPABASE
// ==========================================

const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 3. FUNCIÓN PRINCIPAL DE GUARDADO
// ==========================================

async function guardarDatos(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Recolectamos los datos de los inputs
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

    console.log("Intentando guardar:", datos);

    try {
        // Usamos la tabla 'registross_voceros' como me confirmaste
        const { data, error } = await _supabase
            .from('registross_voceros') 
            .upsert(datos, { onConflict: 'correo' });

        if (error) throw error;

        alert("¡Excelente! Registro guardado o actualizado con éxito.");
        event.target.reset(); // Limpia el formulario después de guardar

    } catch (error) {
        console.error("Error al conectar con Supabase:", error.message);
        alert("No se pudo guardar: " + error.message);
    }
}

// ==========================================
// 4. INICIALIZACIÓN DE EVENTOS
// ==========================================

// Usamos DOMContentLoaded para asegurar que el HTML cargó antes de buscar el ID
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-registro');
    
    if (formulario) {
        formulario.addEventListener('submit', guardarDatos);
        console.log("Sistema listo y escuchando el formulario.");
    } else {
        console.error("ERROR: No se encontró el formulario con id='form-registro'");
    }
});
