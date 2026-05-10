// 1. CONFIGURACIÓN (Aquí pones tus llaves de Supabase)
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- LÓGICA DE PERSISTENCIA (NUEVO) ---
// Esta función revisa si ya habías iniciado sesión antes de refrescar
function verificarSesionAlCargar() {
    const sesion = localStorage.getItem('sesion_activa');
    if (sesion) {
        // Si existe la sesión, ocultamos el registro y mostramos el sistema
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';
        
        // Si el usuario era admin, mantenemos su rol
        if (sesion === 'admin') {
            if (typeof rolActual !== 'undefined') rolActual = 'admin';
            if (typeof mostrarLeyendaAdmin === 'function') mostrarLeyendaAdmin();
        }
        
        // Inicializamos el mapa si la función existe
        if (typeof inicializarMapa === 'function') inicializarMapa();
    }
}

// Ejecutar la revisión apenas cargue la página
window.addEventListener('load', verificarSesionAlCargar);

// 2. FUNCIÓN PARA GUARDAR (Tu función original mejorada con persistencia)
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

    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        console.error("Hubo un error:", error.message);
        alert("Error: " + error.message);
    } else {
        // MARCAMOS LA SESIÓN COMO ACTIVA ANTES DE ENTRAR
        localStorage.setItem('sesion_activa', 'usuario');
        
        alert("¡Excelente! Registro guardado o actualizado con éxito.");
        
        // Llamamos a tu animación si existe
        if (typeof reproducirAnimacion === 'function') {
            reproducirAnimacion('usuario');
        }
    }
}

// 3. CONECTAR EL FORMULARIO
document.getElementById('form-registro').addEventListener('submit', guardarDatos);

// 4. FUNCIÓN PARA CERRAR SESIÓN Y LIMPIAR EL RASTRO (NUEVO)
// Así, al darle a salir, el LocalStorage se limpia y pedirá registro de nuevo
function confirmarSalidaSegura() {
    const comunaSeleccionada = document.getElementById('selectComuna')?.value;

    if (!comunaSeleccionada || comunaSeleccionada === "") {
        alert("⚠️ ERROR: Debe seleccionar obligatoriamente una COMUNA antes de salir.");
        return;
    }

    if (confirm(`¿Confirma que desea guardar y salir?`)) {
        // LIMPIAMOS EL LOCAL STORAGE PARA QUE NO ENTRE AUTOMÁTICAMENTE
        localStorage.removeItem('sesion_activa'); 
        
        if (typeof publicarMapaAdmin === 'function') publicarMapaAdmin();
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}
