// 1. CONFIGURACIÓN (Tus llaves de Supabase)
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// VARIABLE GLOBAL PARA LA MEMORIA
let correoUsuarioActual = ""; 

// 2. FUNCIÓN PARA GUARDAR DATOS DEL REGISTRO (Tu función original mejorada)
async function guardarDatos(event) {
    if (event) event.preventDefault(); 

    const inputCorreo = document.getElementById('correo-electronico');
    correoUsuarioActual = inputCorreo.value.trim().toLowerCase();

    const datos = {
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        cedula_de_identidad: document.getElementById('cedula-de-identidad').value,
        telefono: document.getElementById('telefono').value,
        correo: correoUsuarioActual,
        sector: document.getElementById('sector').value,
        comuna: document.getElementById('comuna').value,
        voceria: document.getElementById('voceria').value
    };

    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        console.error("Hubo un error:", error.message);
    } else {
        console.log("Registro de vocero exitoso.");
        // Después de registrar, intentamos cargar si ya tenía un mapa guardado
        cargarMapaDesdeBD();
    }
}

// 3. NUEVA FUNCIÓN: GUARDAR LEYENDA E ICONOS AUTOMÁTICAMENTE
async function guardarProgresoMapa() {
    // Si el usuario no ha ingresado su correo, no podemos guardar
    if (!correoUsuarioActual) return;

    // A. Recolectamos los iconos del mapa (asumiendo que usas stackElementos para guardarlos)
    const elementosMapa = typeof stackElementos !== 'undefined' ? stackElementos.map(obj => ({
        tipo: obj instanceof L.Marker ? 'icono' : 'trazado',
        latlng: obj instanceof L.Marker ? obj.getLatLng() : obj.getLatLngs(),
        tipoId: obj.tipoId || 'general',
        emoji: obj.emojiTexto || ''
    })) : [];

    // B. Recolectamos los datos de los campos de la leyenda
    // Ajusta los IDs (comuna, parroquia, etc.) según los tengas en tu HTML
    const datosLeyenda = {
        correo_usuario: correoUsuarioActual,
        comuna_nombre: document.getElementById('comuna')?.value || '',
        parroquia: document.querySelector('input[placeholder="Parroquia"]')?.value || '',
        sector_especifico: document.getElementById('sector')?.value || '',
        arbol_predominante: document.getElementById('inputArbolPredominante')?.value || '',
        elementos_mapa: elementosMapa // Aquí se guardan todos los iconos
    };

    const { error } = await _supabase
        .from('datos_mapa_comunitario')
        .upsert(datosLeyenda, { onConflict: 'correo_usuario' });

    if (error) {
        console.error("Error al guardar mapa:", error.message);
    } else {
        console.log("✅ Mapa e iconos guardados automáticamente.");
    }
}

// 4. NUEVA FUNCIÓN: CARGAR MAPA AL INICIAR
async function cargarMapaDesdeBD() {
    if (!correoUsuarioActual) return;

    const { data, error } = await _supabase
        .from('datos_mapa_comunitario')
        .select('*')
        .eq('correo_usuario', correoUsuarioActual)
        .maybeSingle();

    if (data && data.elementos_mapa) {
        console.log("Restaurando mapa de:", correoUsuarioActual);
        // Aquí podrías recorrer data.elementos_mapa y volver a dibujarlos en el mapa
        // Ejemplo: data.elementos_mapa.forEach(item => { ... dibujar ... });
    }
}

// 5. CONECTAR EL FORMULARIO DE REGISTRO
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    formRegistro.addEventListener('submit', guardarDatos);
}

// 6. HACER QUE LOS ICONOS SE GUARDEN AL CREARLOS
// Debes llamar a guardarProgresoMapa() dentro de tus funciones de Leaflet
// Ejemplo: 
/* function alPonerIcono() { 
   ... tu código ...
   stackElementos.push(nuevoIcono);
   guardarProgresoMapa(); 
} 
*/
