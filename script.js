<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://npmcdn.com/leaflet-editable@1.2.0/src/Leaflet.Editable.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// 1. CONFIGURACIÓN DE TU SUPABASE
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- NUEVA LÓGICA DE PERSISTENCIA ---
// Esta función se ejecuta automáticamente al refrescar la página
window.addEventListener('load', () => {
    const estadoGuardado = localStorage.getItem('pantalla_activa');
    
    if (estadoGuardado === 'sistema-principal') {
        // Si ya estaba adentro del sistema, lo mostramos directo
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';
    } else if (estadoGuardado === 'admin') {
        // Si estaba en la pestaña de administración
        cambiarSeccion('admin');
    }
    // Si no hay nada guardado, el HTML mostrará el menú inicial por defecto
});

// 2. LA FUNCIÓN: verificarCorreo
function verificarCorreo() {
    const correoInput = document.getElementById('regCor').value;
    const camposOcultos = document.getElementById('campos-dinamicos-registro');

    if (correoInput.includes('@') && correoInput.length > 5) {
        camposOcultos.style.display = 'flex';
        console.log("Correo validado: " + correoInput);
    } else {
        alert("Por favor, ingresa un correo electrónico válido para verificar.");
    }
}

function limpiarSiVacio(valor) {
    if (valor === "") {
        document.getElementById('campos-dinamicos-registro').style.display = 'none';
    }
}

// 3. FUNCIÓN PARA GUARDAR
async function registrarVocero() {
    const datos = {
        correo: document.getElementById('regCor').value,
        nombre: document.getElementById('regNom').value,
        apellido: document.getElementById('regApe').value,
        cedula_de_identidad: document.getElementById('regCed').value,
        telefono: document.getElementById('regTel').value,
        comuna: document.getElementById('regCom').value,
        sector: document.getElementById('regSec').value,
        voceria: document.getElementById('selectVoceria').value === "Otro" ? 
                 document.getElementById('inputOtro').value : 
                 document.getElementById('selectVoceria').value
    };

    try {
        const { data, error } = await _supabase
            .from('registross_voceros') 
            .upsert(datos, { onConflict: 'correo' });

        if (error) throw error;

        alert("¡Registro exitoso! Bienvenido al sistema.");

        // Guardamos que ahora estamos en el sistema principal
        localStorage.setItem('pantalla_activa', 'sistema-principal');

        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';

    } catch (error) {
        console.error("Error:", error.message);
        alert("Hubo un problema al guardar: " + error.message);
    }
}

// 4. LÓGICA DE INTERFAZ
function cambiarSeccion(tipo) {
    const formReg = document.getElementById('form-registro-principal');
    const formAdmin = document.getElementById('form-admin-acceso');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tipo === 'registro') {
        formReg.style.display = 'grid';
        formAdmin.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
        localStorage.setItem('pantalla_activa', 'registro'); // Guardamos pestaña registro
    } else {
        formReg.style.display = 'none';
        formAdmin.style.display = 'grid';
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
        localStorage.setItem('pantalla_activa', 'admin'); // Guardamos pestaña admin
    }
}

function controlarOtro(valor) {
    const segmentoOtro = document.getElementById('segmento-otro');
    segmentoOtro.style.display = (valor === 'Otro') ? 'block' : 'none';
}

function confirmarSalida() {
    if (confirm("¿Deseas cerrar la sesión?")) {
        localStorage.removeItem('pantalla_activa'); // Borramos el recuerdo al salir
        window.location.reload(); 
    }
}
</script>
