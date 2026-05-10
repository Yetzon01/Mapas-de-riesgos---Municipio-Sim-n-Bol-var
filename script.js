// 1. CONFIGURACIÓN
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// VARIABLES GLOBALES
let correoUsuarioActual = ""; 
let stackElementos = []; // Lista donde se guardan los iconos del mapa

// 2. FUNCIÓN PARA GUARDAR DATOS DEL REGISTRO
async function guardarDatos(event) {
    if (event) event.preventDefault(); 

    // Intentamos capturar el correo de cualquiera de los dos posibles IDs
    const inputCorreo = document.getElementById('correo-electronico') || document.getElementById('regCor');
    
    if (!inputCorreo || !inputCorreo.value) {
        console.error("No se encontró el campo de correo");
        return;
    }

    correoUsuarioActual = inputCorreo.value.trim().toLowerCase();

    const datos = {
        nombre: document.getElementById('nombres')?.value || '',
        apellido: document.getElementById('apellidos')?.value || '',
        cedula_de_identidad: document.getElementById('cedula-de-identidad')?.value || '',
        telefono: document.getElementById('telefono')?.value || '',
        correo: correoUsuarioActual,
        sector: document.getElementById('sector')?.value || '',
        comuna: document.getElementById('comuna')?.value || '',
        voceria: document.getElementById('voceria')?.value || ''
    };

    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        console.error("Hubo un error en registro:", error.message);
    } else {
        console.log("Registro/Login exitoso para:", correoUsuarioActual);
        // Al registrarse con éxito, cargamos su mapa guardado si existe
        cargarMapaDesdeBD();
    }
}

// 3. FUNCIÓN DE GUARDADO AUTOMÁTICO (LEYENDA E ICONOS)
async function guardarProgresoMapa() {
    if (!correoUsuarioActual) {
        console.warn("No hay correo definido. No se puede guardar el mapa aún.");
        return;
    }

    // Recolectamos los iconos actuales del mapa
    const elementosMapa = stackElementos.map(obj => {
        // Verificamos si es un marcador o un trazo (línea/polígono)
        const esMarcador = obj instanceof L.Marker;
        return {
            tipo: esMarcador ? 'icono' : 'trazado',
            latlng: esMarcador ? obj.getLatLng() : obj.getLatLngs(),
            tipoId: obj.tipoId || 'general',
            emoji: obj.emojiTexto || ''
        };
    });

    const datosLeyenda = {
        correo_usuario: correoUsuarioActual,
        comuna_nombre: document.getElementById('comuna')?.value || document.getElementById('selectComuna')?.value || '',
        parroquia: document.querySelector('input[placeholder="Parroquia"]')?.value || '',
        sector_especifico: document.getElementById('sector')?.value || '',
        arbol_predominante: document.getElementById('inputArbolPredominante')?.value || '',
        elementos_mapa: elementosMapa 
    };

    const { error } = await _supabase
        .from('datos_mapa_comunitario')
        .upsert(datosLeyenda, { onConflict: 'correo_usuario' });

    if (error) {
        console.error("Error al autoguardar mapa:", error.message);
    } else {
        console.log("✅ Progreso del mapa sincronizado en Supabase.");
    }
}

// 4. FUNCIÓN PARA CARGAR EL MAPA GUARDADO
async function cargarMapaDesdeBD() {
    if (!correoUsuarioActual) return;

    const { data, error } = await _supabase
        .from('datos_mapa_comunitario')
        .select('*')
        .eq('correo_usuario', correoUsuarioActual)
        .maybeSingle();

    if (data && data.elementos_mapa) {
        console.log("Restaurando mapa previo...");
        
        // Aquí rellenamos los inputs de la leyenda con lo que había guardado
        if(document.getElementById('inputArbolPredominante')) 
            document.getElementById('inputArbolPredominante').value = data.arbol_predominante;
        
        // Limpiamos el mapa actual antes de cargar (opcional)
        // stackElementos.forEach(el => map.removeLayer(el));
        // stackElementos = [];

        // Dibujamos los iconos guardados
        data.elementos_mapa.forEach(item => {
            if (item.tipo === 'icono') {
                // Aquí deberías llamar a tu función existente para poner iconos
                // Ejemplo: restaurarIconoEnMapa(item.latlng, item.emoji, item.tipoId);
            }
        });
    }
}

// 5. CONEXIÓN CON LOS EVENTOS
const formRegistro = document.getElementById('form-registro') || document.getElementById('tu-id-de-formulario');
if (formRegistro) {
    formRegistro.addEventListener('submit', guardarDatos);
}

// --- PASO CLAVE: ESTO DEBE IR EN TU FUNCIÓN DONDE CREAS ICONOS ---
/* Busca la función donde haces el clic en el mapa para poner un emoji.
   Al final de esa función, debes asegurarte de que diga:
   
   stackElementos.push(nuevoMarcador); 
   guardarProgresoMapa(); // <--- ESTO ACTIVA EL GUARDADO AUTOMÁTICO
*/
 