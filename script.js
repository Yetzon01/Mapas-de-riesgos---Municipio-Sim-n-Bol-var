<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://npmcdn.com/leaflet-editable@1.2.0/src/Leaflet.Editable.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// 1. CONFIGURACIÓN DE TU SUPABASE (Se mantiene igual)
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. LA FUNCIÓN QUE TE FALTABA: verificarCorreo
// Esta es la que hace que el formulario "avance" y se muestre
function verificarCorreo() {
    const correoInput = document.getElementById('regCor').value;
    const camposOcultos = document.getElementById('campos-dinamicos-registro');

    if (correoInput.includes('@') && correoInput.length > 5) {
        // Mostramos los campos de Nombres, Apellidos, Cédula, etc.
        camposOcultos.style.display = 'flex';
        console.log("Correo validado: " + correoInput);
    } else {
        alert("Por favor, ingresa un correo electrónico válido para verificar.");
    }
}

// Función para limpiar si el usuario borra el correo
function limpiarSiVacio(valor) {
    if (valor === "") {
        document.getElementById('campos-dinamicos-registro').style.display = 'none';
    }
}

// 3. FUNCIÓN PARA GUARDAR (Ajustada a los IDs de tu HTML)
async function registrarVocero() {
    // Recolectamos los datos usando los IDs REALES de tu HTML (regNom, regApe, etc)
    const datos = {
        correo: document.getElementById('regCor').value,
        nombre: document.getElementById('regNom').value,
        apellido: document.getElementById('regApe').value,
        cedula_de_identidad: document.getElementById('regCed').value,
        telefono: document.getElementById('regTel').value,
        comuna: document.getElementById('regCom').value,
        sector: document.getElementById('regSec').value,
        // Si eligió "Otro", guardamos el texto manual; si no, el del select
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
        
        // Efecto visual para entrar al sistema
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';
        
    } catch (error) {
        console.error("Error:", error.message);
        alert("Hubo un problema al guardar: " + error.message);
    }
}

// 4. LÓGICA DE INTERFAZ (Tabs y Selects)
function cambiarSeccion(tipo) {
    const formReg = document.getElementById('form-registro-principal');
    const formAdmin = document.getElementById('form-admin-acceso');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tipo === 'registro') {
        formReg.style.display = 'grid';
        formAdmin.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        formReg.style.display = 'none';
        formAdmin.style.display = 'grid';
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
    }
}

function controlarOtro(valor) {
    const segmentoOtro = document.getElementById('segmento-otro');
    segmentoOtro.style.display = (valor === 'Otro') ? 'block' : 'none';
}

function confirmarSalida() {
    if (confirm("¿Deseas cerrar la sesión?")) {
        window.location.reload(); 
    }
}
</script>
