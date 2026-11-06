// Variable para saber si estamos modificando una cita
let idModificando = null;

// Empieza cuando el DOM esta cargado
window.addEventListener("DOMContentLoaded", function () {

    // Asigno los eventos de navegacion
    document.getElementById("botonPedirCita").addEventListener("click", mostrarVistaPedirCita);
    document.getElementById("botonCitasDisponibles").addEventListener("click", mostrarVistaCitasDisponibles);

    // Botón para cancelar
    document.getElementById("botonCancelar").addEventListener("click", cancelarFormulario);

    // Envío del formulario
    document.getElementById("formularioCita").addEventListener("submit", function (e) {
        e.preventDefault();
        guardarFormulario();
    });

    // Cargo la vista inicial
    cargarVistaCitas();
});

// Navegación entre las dos vistas
function mostrarVistaPedirCita() {
    document.getElementById("vistaPedirCita").classList.remove("oculto");
    document.getElementById("vistaCitasDisponibles").classList.add("oculto");
}

function mostrarVistaCitasDisponibles() {
    document.getElementById("vistaPedirCita").classList.add("oculto");
    document.getElementById("vistaCitasDisponibles").classList.remove("oculto");
    cargarVistaCitas();
}

// Formulario de pedir cita
function cancelarFormulario() {
    limpiarFormulario();
    idModificando = null;
    document.getElementById("botonGuardar").innerText = "Guardar cita";
}

function limpiarFormulario() {
    document.getElementById("formularioCita").reset();

    // Vacío los mensajes de error de cada campo
    document.getElementById("errorDia").innerText = "";
    document.getElementById("errorMes").innerText = "";
    document.getElementById("errorAnio").innerText = "";
    document.getElementById("errorHora").innerText = "";
    document.getElementById("errorMinuto").innerText = "";
    document.getElementById("errorNombre").innerText = "";
    document.getElementById("errorApellidos").innerText = "";
    document.getElementById("errorDni").innerText = "";
    document.getElementById("errorTelefono").innerText = "";
    document.getElementById("errorFechaNacimiento").innerText = "";
    document.getElementById("errorObservaciones").innerText = "";

    // Oculto también el mensaje global si estaba visible
    let mensajeGlobal = document.getElementById("mensajeGlobal");
    mensajeGlobal.innerText = "";
    mensajeGlobal.classList.remove("visible");
}


function guardarFormulario() {

    // Recojo los valores del formulario
    let dia = document.getElementById("campoDia").value;
    let mes = document.getElementById("campoMes").value;
    let anio = document.getElementById("campoAnio").value;
    let hora = document.getElementById("campoHora").value;
    let minuto = document.getElementById("campoMinuto").value;
    let nombre = document.getElementById("campoNombre").value;
    let apellidos = document.getElementById("campoApellidos").value;
    let dni = document.getElementById("campoDni").value;
    let telefono = document.getElementById("campoTelefono").value;
    let fechaNacimiento = document.getElementById("campoFechaNacimiento").value;
    let observaciones = document.getElementById("campoObservaciones").value;

    // Valido cada campo con su función
    let errorDia = validarDia(dia);
    let errorMes = validarMes(mes);
    let errorAnio = validarAnio(anio);
    let errorHora = validarHora(hora);
    let errorMinuto = validarMinuto(minuto);
    let errorNombre = validarNombre(nombre);
    let errorApellidos = validarApellidos(apellidos);
    let errorDni = validarDni(dni);
    let errorTelefono = validarTelefono(telefono);
    let errorFechaNacimiento = validarFechaNacimiento(fechaNacimiento);
    let errorObservaciones = validarObservaciones(observaciones);

    // Muestro los mensajes debajo de cada campo
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

    // Si hay algún error, no sigo
    if (errorDia !== "" || errorMes !== "" || errorAnio !== "" ||
        errorHora !== "" || errorMinuto !== "" || errorNombre !== "" ||
        errorApellidos !== "" || errorDni !== "" || errorTelefono !== "" ||
        errorFechaNacimiento !== "" || errorObservaciones !== "") {
        return;
    }

    // Creo la cita (si estamos modificando, mantengo el id)
    let id;
    if (idModificando !== null) {
        id = idModificando;
    } else {
        id = Date.now();
    }

    let cita = new Cita(
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

    // Compruebo si ya hay otra cita a la misma hora
    if (haySolapamiento(cita, id)) {
        let mensajeGlobal = document.getElementById("mensajeGlobal");
        mensajeGlobal.innerText = "Ya existe una cita en esa fecha y hora";
        mensajeGlobal.classList.add("visible");
        return;
    }

    // Guardo o modifico según el caso
    if (idModificando !== null) {
        modificarCita(cita);
        idModificando = null;
        document.getElementById("botonGuardar").innerText = "Guardar cita";
    } else {
        anadirCita(cita);
    }

    // Limpio el formulario y voy a la vista de citas
    limpiarFormulario();
    document.getElementById("vistaPedirCita").classList.add("oculto");
    document.getElementById("vistaCitasDisponibles").classList.remove("oculto");
    cargarVistaCitas();
}

// Pinta la tabla de citas
function cargarVistaCitas() {
    let citas = cargarCitas();
    let cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = "";

    // Muestro u oculto el mensaje de "no hay citas"
    if (citas.length === 0) {
        document.getElementById("mensajeVacio").style.display = "block";
    } else {
        document.getElementById("mensajeVacio").style.display = "none";
    }

    // Recorro las citas y creo una fila por cada una
    for (let i = 0; i < citas.length; i++) {
        let c = citas[i];
        let fila = document.createElement("tr");

        // Columna 1: orden
        let tdOrden = document.createElement("td");
        tdOrden.textContent = i + 1;
        fila.appendChild(tdOrden);

        // Columna 2: fecha
        let tdFecha = document.createElement("td");
        tdFecha.textContent = c.getFechaFormateada();
        fila.appendChild(tdFecha);

        // Columna 3: hora
        let tdHora = document.createElement("td");
        tdHora.textContent = c.getHoraFormateada();
        fila.appendChild(tdHora);

        // Columna 4: nombre
        let tdNombre = document.createElement("td");
        tdNombre.textContent = c.nombre;
        fila.appendChild(tdNombre);

        // Columna 5: apellidos
        let tdApellidos = document.createElement("td");
        tdApellidos.textContent = c.apellidos;
        fila.appendChild(tdApellidos);

        // Columna 6: DNI
        let tdDni = document.createElement("td");
        tdDni.textContent = c.dni;
        fila.appendChild(tdDni);

        // Columna 7: teléfono
        let tdTelefono = document.createElement("td");
        tdTelefono.textContent = c.telefono;
        fila.appendChild(tdTelefono);

        // Columna 8: acciones
        let tdAcciones = document.createElement("td");

        let btnModificar = document.createElement("button");
        btnModificar.className = "boton-modificar";
        btnModificar.textContent = "Modificar";
        btnModificar.setAttribute("data-id", c.id);
        btnModificar.addEventListener("click", function () {
            prepararModificar(parseInt(this.getAttribute("data-id")));
        });
        tdAcciones.appendChild(btnModificar);

        let btnEliminar = document.createElement("button");
        btnEliminar.className = "boton-eliminar";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.setAttribute("data-id", c.id);
        btnEliminar.addEventListener("click", function () {
            prepararEliminar(parseInt(this.getAttribute("data-id")));
        });
        tdAcciones.appendChild(btnEliminar);

        fila.appendChild(tdAcciones);
        cuerpo.appendChild(fila);
    }
}

// Prepara el formulario para modificar una cita
function prepararModificar(id) {
    let citas = cargarCitas();

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id === id) {
            let c = citas[i];
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

// Elimina la cita después de confirmar
function prepararEliminar(id) {
    if (confirm("Seguro que quieres eliminar esta cita?")) {
        eliminarCita(id);
        cargarVistaCitas();
    }
}