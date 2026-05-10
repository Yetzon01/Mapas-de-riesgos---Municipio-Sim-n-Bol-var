// 1. CONFIGURACIÓN (Tus llaves de Supabase)
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- LÓGICA DE PERSISTENCIA (Para que no se salga al refrescar) ---
function verificarSesionSegura() {
    const sesion = localStorage.getItem('sesion_activa');
    
    if (sesion === 'usuario') {
        // En teléfonos, a veces los elementos tardan en aparecer, por eso usamos setInterval
        const checkExistencia = setInterval(function() {
            const reg = document.getElementById('pantalla-registro');
            const sis = document.getElementById('sistema-principal');
            
            if (reg && sis) {
                reg.style.display = 'none';
                sis.style.display = 'flex';
                
                // Si tienes la función para cargar el mapa, la ejecutamos
                if (typeof inicializarMapa === 'function') inicializarMapa();
                
                clearInterval(checkExistencia);
            }
        }, 100); 
    }
}

// Ejecutar la revisión apenas cargue el script
verificarSesionSegura();

// 2. FUNCIÓN PARA GUARDAR
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
        // --- GUARDAMOS LA SESIÓN AQUÍ ---
        localStorage.setItem('sesion_activa', 'usuario');

        alert("¡Excelente! Registro guardado o actualizado con éxito.");

        // Cambiamos la vista manualmente después del registro exitoso
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';
        
        if (typeof inicializarMapa === 'function') inicializarMapa();
    }
}

// 3. CONECTAR EL FORMULARIO
document.getElementById('form-registro').addEventListener('submit', guardarDatos);

// 4. BOTÓN DE ESTADO (Para probar en el teléfono)
const btnEspia = document.createElement('button');
btnEspia.innerText = "🔍 ESTADO";
btnEspia.style = "position:fixed; bottom:10px; left:10px; z-index:9999; background:rgba(0,0,0,0.8); color:white; font-size:10px; padding:8px; border-radius:5px; border:none;";
document.body.appendChild(btnEspia);

btnEspia.onclick = function() {
    const sesion = localStorage.getItem('sesion_activa');
    alert("Sesión en este teléfono: " + (sesion ? sesion : "VACÍA (null)"));
};
