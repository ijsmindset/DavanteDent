// Nombre de la cookie donde guardamos las citas
const NOMBRE_COOKIE = "citasDavanteDent";


// Guarda el array de citas en la cookie
function guardarCitas(citas) {
    let texto = JSON.stringify(citas);
    let contenidoCodificado = encodeURIComponent(texto);

    // max-age en segundos: 1 año = 365 * 24 * 60 * 60 = 31536000 leer https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Set-Cookie
    document.cookie = NOMBRE_COOKIE + "=" + contenidoCodificado + ";path=/;max-age=31536000";
}


// Lee las citas de la cookie y lo devuelve como array de objetos Cita
function cargarCitas() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(NOMBRE_COOKIE + "=") === 0) {
            let texto = c.substring(NOMBRE_COOKIE.length + 1);

            // Intento parsear la cookie. Si está corrupta, devuelvo array vacío
            let datos;
            try {
                datos = JSON.parse(decodeURIComponent(texto));
            } catch (error) {
                return [];
            }

            // Reconstruyo cada objeto Cita
            let citas = [];
            for (let j = 0; j < datos.length; j++) {
                citas.push(new Cita(
                    datos[j].id,
                    datos[j].dia,
                    datos[j].mes,
                    datos[j].anio,
                    datos[j].hora,
                    datos[j].minuto,
                    datos[j].nombre,
                    datos[j].apellidos,
                    datos[j].dni,
                    datos[j].telefono,
                    datos[j].fechaNacimiento,
                    datos[j].observaciones
                ));
            }
            return citas;
        }
    }
    return [];
}


// Añade una cita al array y lo guarda en la cookie
function anadirCita(cita) {
    let citas = cargarCitas();
    citas.push(cita);
    guardarCitas(citas);
}


// Elimina la cita con el id indicado
function eliminarCita(id) {
    let citas = cargarCitas();
    let nuevas = [];

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id !== id) {
            nuevas.push(citas[i]);
        }
    }

    guardarCitas(nuevas);
}


// Modifica la cita que tenga ese id
function modificarCita(citaModificada) {
    let citas = cargarCitas();

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id === citaModificada.id) {
            citas[i] = citaModificada;
        }
    }

    guardarCitas(citas);
}


// Comprueba si ya existe una cita en esa fecha y hora
function haySolapamiento(cita, idIgnorar) {
    let citas = cargarCitas();

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id !== idIgnorar &&
            citas[i].dia === cita.dia &&
            citas[i].mes === cita.mes &&
            citas[i].anio === cita.anio &&
            citas[i].hora === cita.hora &&
            citas[i].minuto === cita.minuto) {
            return true;
        }
    }
    return false;
}
