// 1. CONFIGURACIÓN DE SUPABASE
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. INICIALIZAR EL MAPA (Asegúrate de que esto esté antes de las funciones)
// Si ya tienes estas líneas en otra parte, no las dupliques.
const map = L.map('map').setView([10.13, -64.68], 13); // Coordenadas de Barcelona, Anzoátegui
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. FUNCIÓN PARA CARGAR LA MEMORIA (Traer puntos antiguos de la nube)
async function cargarPuntosPrevios(correo) {
    console.log("Buscando puntos para:", correo);
    const { data, error } = await _supabase
        .from('memoria_mapa')
        .select('*')
        .eq('creado_por', correo);

    if (error) {
        console.error("Error al cargar puntos:", error.message);
    } else if (data) {
        data.forEach(punto => {
            L.marker([punto.latitud, punto.longitud])
                .addTo(map)
                .bindPopup(punto.informacion);
        });
    }
}

// 4. FUNCIÓN PARA GUARDAR DATOS DEL FORMULARIO
async function guardarDatos(event) {
    event.preventDefault();
    const correoInput = document.getElementById('correo-electronico').value;

    const datos = {
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        cedula_de_identidad: document.getElementById('cedula-de-identidad').value,
        telefono: document.getElementById('telefono').value,
        correo: correoInput,
        sector: document.getElementById('sector').value,
        comuna: document.getElementById('comuna').value,
        voceria: document.getElementById('voceria').value
    };

    const { error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        alert("Error al registrar: " + error.message);
    } else {
        alert("¡Sesión iniciada con éxito! Cargando tus puntos...");
        cargarPuntosPrevios(correoInput); // Carga los puntos al iniciar sesión
    }
}

// 5. EVENTO DE CLIC EN EL MAPA (Guardar nuevos puntos)
map.on('click', async function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const correoActivo = document.getElementById('correo-electronico').value;

    if (!correoActivo) {
        alert("Primero debes ingresar tu correo en el formulario.");
        return;
    }

    const info = prompt("¿Qué quieres reportar en este punto?");

    if (info) {
        // Ponemos el marcador en la pantalla
        L.marker([lat, lng]).addTo(map).bindPopup(info).openPopup();

        // Enviamos a Supabase
        const { error } = await _supabase
            .from('memoria_mapa')
            .insert([
                {
                    latitud: lat,
                    longitud: lng,
                    informacion: info,
                    creado_por: correoActivo 
                }
            ]);

        if (error) {
            console.error("Error al guardar en memoria_mapa:", error.message);
            alert("No se pudo guardar el punto en la base de datos.");
        } else {
            console.log("¡Punto guardado exitosamente!");
        }
    }
});

// 6. ASOCIAR EL BOTÓN DEL FORMULARIO
document.getElementById('form-registro').addEventListener('submit', guardarDatos);
