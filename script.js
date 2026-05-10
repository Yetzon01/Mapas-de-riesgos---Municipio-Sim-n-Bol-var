// 1. CONFIGURACIÓN
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNCIÓN DE SALTO AUTOMÁTICO (REVISADA)
function verificarSesionSegura() {
    const sesion = localStorage.getItem('sesion_activa');
    if (sesion) {
        console.log("Sesión detectada, intentando saltar registro...");
        
        const intervalo = setInterval(() => {
            const reg = document.getElementById('pantalla-registro');
            const sis = document.getElementById('sistema-principal');

            if (reg && sis) {
                reg.style.display = 'none';
                sis.style.display = 'flex';
                if (typeof inicializarMapa === 'function') inicializarMapa();
                clearInterval(intervalo);
            }
        }, 100);

        // Si después de 3 segundos no encuentra los IDs, te avisa el error
        setTimeout(() => {
            clearInterval(intervalo);
            if (!document.getElementById('pantalla-registro')) {
                alert("⚠️ Error: No encontré el ID 'pantalla-registro' en tu HTML");
            }
        }, 3000);
    }
}
verificarSesionSegura();

// 3. FUNCIÓN PARA GUARDAR
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
        alert("Error Supabase: " + error.message);
    } else {
        // GUARDAR MEMORIA
        localStorage.setItem('sesion_activa', 'usuario');
        alert("¡Registro Exitoso! Ahora puedes refrescar y no se saldrá.");
        
        // Cambio de pantalla manual
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';
        if (typeof inicializarMapa === 'function') inicializarMapa();
    }
}

document.getElementById('form-registro').addEventListener('submit', guardarDatos);

// 4. BOTÓN DE ESTADO FORZADO (ESTILO VISIBLE)
const btn = document.createElement('button');
btn.innerHTML = "VER MEMORIA";
btn.setAttribute('style', 'position:fixed !important; bottom:20px !important; left:20px !important; z-index:999999 !important; background:red !important; color:white !important; padding:15px !important; border-radius:10px !important;');
document.body.appendChild(btn);

btn.onclick = function() {
    const s = localStorage.getItem('sesion_activa');
    alert("Dato en memoria: " + s);
};
