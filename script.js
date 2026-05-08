<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://npmcdn.com/leaflet-editable@1.2.0/src/Leaflet.Editable.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// 1. CONFIGURACIÓN DE SUPABASE
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNCIÓN PARA VERIFICAR (Hacer que el formulario "avance")
function verificarCorreo() {
    const correo = document.getElementById('regCor').value;
    const camposDinamicos = document.getElementById('campos-dinamicos-registro');

    if (correo.includes('@') && correo.length > 5) {
        // Mostramos los campos ocultos
        camposDinamicos.style.display = 'flex';
        // Pasamos el correo al campo que se guardará (opcional si usas el mismo ID)
        console.log("Correo verificado para: " + correo);
    } else {
        alert("Por favor, ingresa un correo electrónico válido para continuar.");
    }
}

// Limpiar si borran el correo
function limpiarSiVacio(valor) {
    if (valor === "") {
        document.getElementById('campos-dinamicos-registro').style.display = 'none';
    }
}

// 3. FUNCIÓN PARA GUARDAR (Ajustada a tus IDs del HTML)
async function registrarVocero() {
    // Recolectamos los datos usando los IDs reales de tu HTML
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

    // Enviamos a Supabase
    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        console.error("Error al guardar:", error.message);
        alert("Error: " + error.message);
    } else {
        alert("¡Registro guardado con éxito!");
        // Aquí podrías mostrar el sistema principal
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('sistema-principal').style.display = 'flex';
    }
}

// 4. FUNCIONES DE INTERFAZ
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
    if (confirm("¿Estás seguro de que deseas salir?")) {
        window.location.reload(); 
    }
}
</script>
 