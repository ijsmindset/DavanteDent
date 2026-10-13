// Variable para saber si estamos modificando una cita
var idModificando = null;

// Al cargar la pagina
window.onload = function () {
    cargarVistaCitas();
};

// Navegacion entre vistas
document.getElementById("botonPedirCita").onclick = function () {
    document.getElementById("vistaPedirCita").classList.remove("oculto");
    document.getElementById("vistaCitasDisponibles").classList.add("oculto");
};

document.getElementById("botonCitasDisponibles").onclick = function () {
    document.getElementById("vistaPedirCita").classList.add("oculto");
    document.getElementById("vistaCitasDisponibles").classList.remove("oculto");
    cargarVistaCitas();
};

// Boton cancelar - limpia el formulario
document.getElementById("botonCancelar").onclick = function () {
    limpiarFormulario();
    idModificando = null;
    document.getElementById("botonGuardar").innerText = "Guardar cita";
};

// Al enviar el formulario
document.getElementById("formularioCita").onsubmit = function (e) {
    e.preventDefault();
    guardarFormulario();
};

// Limpia el formulario y los mensajes de error
function limpiarFormulario() {
    document.getElementById("formularioCita").reset();
    var errores = document.getElementsByClassName("error");
    for (var i = 0; i < errores.length; i++) {
        errores[i].innerText = "";
    }
    document.getElementById("mensajeGlobal").innerText = "";
    document.getElementById("mensajeGlobal").classList.remove("visible");
}

// Recoge los datos del formulario y valida
function guardarFormulario() {
    // Recogemos los valores
    var dia = document.getElementById("campoDia").value;
    var mes = document.getElementById("campoMes").value;
    var anio = document.getElementById("campoAnio").value;
    var hora = document.getElementById("campoHora").value;
    var minuto = document.getElementById("campoMinuto").value;
    var nombre = document.getElementById("campoNombre").value;
    var apellidos = document.getElementById("campoApellidos").value;
    var dni = document.getElementById("campoDni").value;
    var telefono = document.getElementById("campoTelefono").value;
    var fechaNacimiento = document.getElementById("campoFechaNacimiento").value;
    var observaciones = document.getElementById("campoObservaciones").value;

    // Validamos cada campo
    var errorDia = validarDia(dia);
    var errorMes = validarMes(mes);
    var errorAnio = validarAnio(anio);
    var errorHora = validarHora(hora);
    var errorMinuto = validarMinuto(minuto);
    var errorNombre = validarNombre(nombre);
    var errorApellidos = validarApellidos(apellidos);
    var errorDni = validarDni(dni);
    var errorTelefono = validarTelefono(telefono);
    var errorFechaNacimiento = validarFechaNacimiento(fechaNacimiento);
    var errorObservaciones = validarObservaciones(observaciones);

    // Mostramos los mensajes de error
    document.getElementById("errorDia").innerText = errorDia;
    document.getElementById("errorMes").innerText = errorMes;
    document.getElementById("errorAnio").innerText = errorAnio;
    document.getElementById("errorHora").innerText = errorHora;
    document.getElementById("errorMinuto").innerText = errorMinuto;
    document.getElementById("errorNombre").innerText = errorNombre;
    document.getElementById("errorApellidos").innerText = errorApellidos;
    document.getElementById("errorDni").innerText = errorDni;
    document.getElementById("errorTelefono").innerText = errorTelefono;
    document.getElementById("errorFechaNacimiento").innerText = errorFechaNacimiento;
    document.getElementById("errorObservaciones").innerText = errorObservaciones;

    // Si hay algun error, no seguimos
    if (errorDia !== "" || errorMes !== "" || errorAnio !== "" ||
        errorHora !== "" || errorMinuto !== "" || errorNombre !== "" ||
        errorApellidos !== "" || errorDni !== "" || errorTelefono !== "" ||
        errorFechaNacimiento !== "" || errorObservaciones !== "") {
        return;
    }

    // Creamos la cita
    var id = idModificando !== null ? idModificando : Date.now();
    var cita = new Cita(
        id,
        parseInt(dia),
        parseInt(mes),
        parseInt(anio),
        parseInt(hora),
        parseInt(minuto),
        nombre,
        apellidos,
        dni,
        telefono,
        fechaNacimiento,
        observaciones
    );

    // Comprobamos solapamiento
    if (haySolapamiento(cita, id)) {
        document.getElementById("mensajeGlobal").innerText = "Ya existe una cita en esa fecha y hora";
        document.getElementById("mensajeGlobal").classList.add("visible");
        return;
    }

    // Guardamos o modificamos
    if (idModificando !== null) {
        modificarCita(cita);
        idModificando = null;
        document.getElementById("botonGuardar").innerText = "Guardar cita";
    } else {
        anadirCita(cita);
    }

    // Limpiamos el formulario y vamos a la vista de citas
    limpiarFormulario();
    document.getElementById("vistaPedirCita").classList.add("oculto");
    document.getElementById("vistaCitasDisponibles").classList.remove("oculto");
    cargarVistaCitas();
}

// Pinta la tabla de citas
function cargarVistaCitas() {
    var citas = cargarCitas();
    var cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = "";

    if (citas.length === 0) {
        document.getElementById("mensajeVacio").style.display = "block";
    } else {
        document.getElementById("mensajeVacio").style.display = "none";
    }

    for (var i = 0; i < citas.length; i++) {
        var c = citas[i];
        var fila = document.createElement("tr");

        var fecha = (c.dia < 10 ? "0" + c.dia : c.dia) + "/" +
                    (c.mes < 10 ? "0" + c.mes : c.mes) + "/" + c.anio;
        var hora = (c.hora < 10 ? "0" + c.hora : c.hora) + ":" +
                   (c.minuto < 10 ? "0" + c.minuto : c.minuto);

        fila.innerHTML =
            "<td>" + (i + 1) + "</td>" +
            "<td>" + fecha + "</td>" +
            "<td>" + hora + "</td>" +
            "<td>" + c.nombre + "</td>" +
            "<td>" + c.apellidos + "</td>" +
            "<td>" + c.dni + "</td>" +
            "<td>" + c.telefono + "</td>" +
            "<td>" +
                "<button class='boton-modificar' onclick='prepararModificar(" + c.id + ")'>Modificar</button>" +
                "<button class='boton-eliminar' onclick='prepararEliminar(" + c.id + ")'>Eliminar</button>" +
            "</td>";

        cuerpo.appendChild(fila);
    }
}

// Prepara los datos para modificar una cita
function prepararModificar(id) {
    var citas = cargarCitas();
    for (var i = 0; i < citas.length; i++) {
        if (citas[i].id === id) {
            var c = citas[i];
            document.getElementById("campoDia").value = c.dia;
            document.getElementById("campoMes").value = c.mes;
            document.getElementById("campoAnio").value = c.anio;
            document.getElementById("campoHora").value = c.hora;
            document.getElementById("campoMinuto").value = c.minuto;
            document.getElementById("campoNombre").value = c.nombre;
            document.getElementById("campoApellidos").value = c.apellidos;
            document.getElementById("campoDni").value = c.dni;
            document.getElementById("campoTelefono").value = c.telefono;
            document.getElementById("campoFechaNacimiento").value = c.fechaNacimiento;
            document.getElementById("campoObservaciones").value = c.observaciones;
            idModificando = id;
            document.getElementById("botonGuardar").innerText = "Modificar cita";
            document.getElementById("vistaPedirCita").classList.remove("oculto");
            document.getElementById("vistaCitasDisponibles").classList.add("oculto");
        }
    }
}

// Elimina una cita (pide confirmacion)
function prepararEliminar(id) {
    if (confirm("Seguro que quieres eliminar esta cita?")) {
        eliminarCita(id);
        cargarVistaCitas();
    }
}