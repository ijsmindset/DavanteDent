// Valida el dia (1 a 31)
function validarDia(dia) {
    if (dia === "" || isNaN(dia)) {
        return "El dia es obligatorio";
    }
    if (dia < 1 || dia > 31) {
        return "El dia debe estar entre 1 y 31";
    }
    return "";
}

// Valida el mes (1 a 12)
function validarMes(mes) {
    if (mes === "" || isNaN(mes)) {
        return "El mes es obligatorio";
    }
    if (mes < 1 || mes > 12) {
        return "El mes debe estar entre 1 y 12";
    }
    return "";
}

// Valida el año (mayor o igual al actual)
function validarAnio(anio) {
    var anioActual = new Date().getFullYear();
    if (anio === "" || isNaN(anio)) {
        return "El año es obligatorio";
    }
    if (anio < anioActual) {
        return "El año no puede ser anterior a " + anioActual;
    }
    return "";
}

// Valida la hora (9 a 20)
function validarHora(hora) {
    if (hora === "" || isNaN(hora)) {
        return "La hora es obligatoria";
    }
    if (hora < 9 || hora > 20) {
        return "La hora debe estar entre 9 y 20";
    }
    return "";
}

// Valida el minuto (0 a 59)
function validarMinuto(minuto) {
    if (minuto === "" || isNaN(minuto)) {
        return "El minuto es obligatorio";
    }
    if (minuto < 0 || minuto > 59) {
        return "El minuto debe estar entre 0 y 59";
    }
    return "";
}

// Valida el nombre (solo letras, minimo 2)
function validarNombre(nombre) {
    if (nombre === "") {
        return "El nombre es obligatorio";
    }
    if (nombre.length < 2) {
        return "El nombre es demasiado corto";
    }
    var patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!patron.test(nombre)) {
        return "El nombre solo puede tener letras";
    }
    return "";
}

// Valida los apellidos (solo letras, minimo 2)
function validarApellidos(apellidos) {
    if (apellidos === "") {
        return "Los apellidos son obligatorios";
    }
    if (apellidos.length < 2) {
        return "Los apellidos son demasiado cortos";
    }
    var patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!patron.test(apellidos)) {
        return "Los apellidos solo pueden tener letras";
    }
    return "";
}

// Valida el DNI (8 numeros + letra correcta)
function validarDni(dni) {
    if (dni === "") {
        return "El DNI es obligatorio";
    }
    if (dni.length !== 9) {
        return "El DNI debe tener 9 caracteres";
    }
    var numeros = dni.substring(0, 8);
    var letra = dni.charAt(8).toUpperCase();
    if (isNaN(numeros)) {
        return "Los 8 primeros caracteres deben ser numeros";
    }
    var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    var indice = parseInt(numeros) % 23;
    if (letras.charAt(indice) !== letra) {
        return "La letra del DNI no es correcta";
    }
    return "";
}

// Valida el telefono (9 digitos, empieza por 6, 7 o 9)
function validarTelefono(telefono) {
    if (telefono === "") {
        return "El telefono es obligatorio";
    }
    if (telefono.length !== 9) {
        return "El telefono debe tener 9 digitos";
    }
    if (isNaN(telefono)) {
        return "El telefono solo puede tener numeros";
    }
    var primera = telefono.charAt(0);
    if (primera !== "6" && primera !== "7" && primera !== "9") {
        return "El telefono debe empezar por 6, 7 o 9";
    }
    return "";
}

// Valida la fecha de nacimiento (formato DD/MM/AAAA y anterior a hoy)
function validarFechaNacimiento(fecha) {
    if (fecha === "") {
        return "La fecha de nacimiento es obligatoria";
    }
    var partes = fecha.split("/");
    if (partes.length !== 3) {
        return "El formato debe ser DD/MM/AAAA";
    }
    var dia = parseInt(partes[0]);
    var mes = parseInt(partes[1]);
    var anio = parseInt(partes[2]);
    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) {
        return "La fecha no es valida";
    }
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 1900) {
        return "La fecha no es valida";
    }
    var hoy = new Date();
    var fechaNac = new Date(anio, mes - 1, dia);
    if (fechaNac >= hoy) {
        return "La fecha debe ser anterior a hoy";
    }
    return "";
}

// Valida las observaciones (opcional, maximo 200 caracteres)
function validarObservaciones(observaciones) {
    if (observaciones.length > 200) {
        return "Las observaciones no pueden superar 200 caracteres";
    }
    return "";
}