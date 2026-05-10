<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://npmcdn.com/leaflet-editable@1.2.0/src/Leaflet.Editable.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// 1. CONFIGURACIÓN DE TU SUPABASE
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- LÓGICA DE PERSISTENCIA (PARA NO PERDER EL AVANCE AL REFRESCAR) ---
window.addEventListener('load', () => {
    const estadoGuardado = localStorage.getItem('pantalla_activa');

    if (estadoGuardado === 'sistema-principal') {
        const pantallaReg = document.getElementById('pantalla-registro');
        const sistemaPrinc = document.getElementById('sistema-principal');
        if(pantallaReg) pantallaReg.style.display = 'none';
        if(sistemaPrinc) sistemaPrinc.style.display = 'flex';
    } else if (estadoGuardado === 'admin') {
        cambiarSeccion('admin');
    }
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
    const camposDinamicos = document.getElementById('campos-dinamicos-registro');
    if (valor === "" && camposDinamicos) {
        camposDinamicos.style.display = 'none';
    }
}

// 3. FUNCIÓN PARA GUARDAR (CORREGIDA: SIN ERROR DE CONFLICTO)
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
        // USAMOS .insert PARA PERMITIR MÚLTIPLES REGISTROS Y EVITAR EL ERROR DE LA FOTO
        const { data, error } = await _supabase
            .from('registross_voceros') 
            .insert([datos]); 

        if (error) throw error;

        alert("¡Registro exitoso! Bienvenido al sistema.");

        // Guardamos el estado para mantener la pantalla al refrescar
        localStorage.setItem('pantalla_activa', 'sistema-principal');

        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';

    } catch (error) {
        console.error("Error:", error.message);
        alert("Hubo un problema al guardar: " + error.message);
    }
}

// 4. LÓGICA DE INTERFAZ (TUS AVANCES MANTENIDOS)
function cambiarSeccion(tipo) {
    const formReg = document.getElementById('form-registro-principal');
    const formAdmin = document.getElementById('form-admin-acceso');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tipo === 'registro') {
        if(formReg) formReg.style.display = 'grid';
        if(formAdmin) formAdmin.style.display = 'none';
        if(tabs[0]) tabs[0].classList.add('active');
        if(tabs[1]) tabs[1].classList.remove('active');
        localStorage.setItem('pantalla_activa', 'registro');
    } else {
        if(formReg) formReg.style.display = 'none';
        if(formAdmin) formAdmin.style.display = 'grid';
        if(tabs[1]) tabs[1].classList.add('active');
        if(tabs[0]) tabs[0].classList.remove('active');
        localStorage.setItem('pantalla_activa', 'admin');
    }
}

function controlarOtro(valor) {
    const segmentoOtro = document.getElementById('segmento-otro');
    if(segmentoOtro) segmentoOtro.style.display = (valor === 'Otro') ? 'block' : 'none';
}

function confirmarSalida() {
    if (confirm("¿Deseas cerrar la sesión?")) {
        localStorage.removeItem('pantalla_activa'); 
        window.location.reload(); 
    }
}
</script>
