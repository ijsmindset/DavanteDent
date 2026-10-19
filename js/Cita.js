class Cita {

    constructor(id, dia, mes, anio, hora, minuto, nombre, apellidos, dni, telefono, fechaNacimiento, observaciones) {
        this.id = id;
        this.dia = dia;
        this.mes = mes;
        this.anio = anio;
        this.hora = hora;
        this.minuto = minuto;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.observaciones = observaciones;
    }

    // Devuelve la fecha en formato dd/mm/aaaa
    getFechaFormateada() {
        let dia = this.dia;
        let mes = this.mes;

        if (dia < 10) {
            dia = "0" + dia;
        }
        if (mes < 10) {
            mes = "0" + mes;
        }

        return dia + "/" + mes + "/" + this.anio;
    }

    // Devuelve la hora en formato hh:mm
    getHoraFormateada() {
        let hora = this.hora;
        let minuto = this.minuto;

        if (hora < 10) {
            hora = "0" + hora;
        }
        if (minuto < 10) {
            minuto = "0" + minuto;
        }

        return hora + ":" + minuto;
    }
}