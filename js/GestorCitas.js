// Nombre de la cookie donde guardamos las citas
var NOMBRE_COOKIE = "citasDavanteDent";

// Guarda el array de citas en la cookie
function guardarCitas(citas) {
    var texto = JSON.stringify(citas);
    document.cookie = NOMBRE_COOKIE + "=" + texto + ";path=/;max-age=31536000";
}

// Lee las citas de la cookie y las devuelve como array
function cargarCitas() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(NOMBRE_COOKIE + "=") === 0) {
            var texto = c.substring(NOMBRE_COOKIE.length + 1);
            var datos = JSON.parse(texto);
            var citas = [];
            for (var j = 0; j < datos.length; j++) {
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
    var citas = cargarCitas();
    citas.push(cita);
    guardarCitas(citas);
}

// Elimina la cita con el id indicado
function eliminarCita(id) {
    var citas = cargarCitas();
    var nuevas = [];
    for (var i = 0; i < citas.length; i++) {
        if (citas[i].id !== id) {
            nuevas.push(citas[i]);
        }
    }
    guardarCitas(nuevas);
}

// Modifica la cita que tenga ese id
function modificarCita(citaModificada) {
    var citas = cargarCitas();
    for (var i = 0; i < citas.length; i++) {
        if (citas[i].id === citaModificada.id) {
            citas[i] = citaModificada;
        }
    }
    guardarCitas(citas);
}

// Comprueba si ya existe una cita en esa fecha y hora
function haySolapamiento(cita, idIgnorar) {
    var citas = cargarCitas();
    for (var i = 0; i < citas.length; i++) {
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