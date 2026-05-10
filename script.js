// 1. CONFIGURACIÓN DE SUPABASE
const supabaseUrl = 'https://zezcmftcbbzplhtdqotd.supabase.co'; 
const supabaseKey = 'sb_publishable_bNaRcykfZaVdW67HsEf3Tw_rWemQCui';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNCIÓN PARA CARGAR LA MEMORIA DEL MAPA (Trae lo que ya existe)
async function cargarPuntosPrevios(correo) {
    const { data, error } = await _supabase
        .from('memoria_mapa')
        .select('*')
        .eq('creado_por', correo);

    if (!error && data) {
        data.forEach(punto => {
            // Dibujamos los marcadores que ya estaban guardados
            L.marker([punto.latitud, punto.longitud])
                .addTo(map)
                .bindPopup(punto.informacion);
        });
        console.log("Memoria del mapa cargada para: " + correo);
    }
}

// 3. FUNCIÓN PARA GUARDAR DATOS PERSONALES
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

    const { data, error } = await _supabase
        .from('registross_voceros') 
        .upsert(datos, { onConflict: 'correo' });

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("¡Sesión iniciada! Cargando tu mapa personal...");
        // Al tener éxito, cargamos sus puntos guardados anteriormente
        cargarPuntosPrevios(correoInput);
    }
}

// 4. FUNCIÓN PARA GUARDAR CLICS EN EL MAPA (La nueva memoria)
map.on('click', async function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const correoActivo = document.getElementById('correo-electronico').value;

    if (!correoActivo) {
        alert("Por favor, ingresa tu correo primero para poder guardar en el mapa.");
        return;
    }

    const info = prompt("¿Qué reporte o riesgo hay en este punto?");

    if (info) {
        // Ponemos el marcador visualmente
        L.marker([lat, lng]).addTo(map).bindPopup(info).openPopup();

        // GUARDAMOS EN LA TABLA QUE CREASTE (memoria_mapa)
        const { error } = await _supabase
            .from('memoria_mapa')
            .insert({
                latitud: lat,
                longitud: lng,
                informacion: info,
                creado_por: correoActivo 
            });

        if (error) console.error("No se pudo guardar el punto:", error.message);
    }
});

// 5. CONECTAR EL FORMULARIO
document.getElementById('form-registro').addEventListener('submit', guardarDatos);
 