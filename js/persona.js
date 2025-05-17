// 1. Clase Persona
class Persona {
    // Atributos privados usando # (característica moderna de JavaScript)
    #codigo;
    #nombre;
    #apellido;
    #fechaNacimiento;
    #genero;
    #cargo;

    /**
     * Constructor de la clase Persona
     * @param {string} codigo - Código identificador único
     * @param {string} nombre - Nombre de la persona
     * @param {string} apellido - Apellido de la persona
     * @param {Date} fechaNacimiento - Fecha de nacimiento
     * @param {string} genero - Género de la persona
     * @param {string} cargo - Cargo o puesto que ocupa
     */
    constructor(codigo, nombre, apellido, fechaNacimiento, genero, cargo) {
        this.#codigo = codigo;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#fechaNacimiento = fechaNacimiento;
        this.#genero = genero;
        this.#cargo = cargo;
    }

    // Métodos getter y setter para cada atributo
    
    // Getters
    getCodigo() {
        return this.#codigo;
    }

    getNombre() {
        return this.#nombre;
    }

    getApellido() {
        return this.#apellido;
    }

    getFechaNacimiento() {
        return this.#fechaNacimiento;
    }

    getGenero() {
        return this.#genero;
    }

    getCargo() {
        return this.#cargo;
    }

    // Método adicional para obtener nombre completo
    getNombreCompleto() {
        return `${this.#nombre} ${this.#apellido}`;
    }

    // Método para calcular la edad
    getEdad() {
        const hoy = new Date();
        const edad = hoy.getFullYear() - this.#fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - this.#fechaNacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < this.#fechaNacimiento.getDate())) {
            return edad - 1;
        }
        
        return edad;
    }

    // Setters
    setCodigo(codigo) {
        this.#codigo = codigo;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    setApellido(apellido) {
        this.#apellido = apellido;
    }

    setFechaNacimiento(fechaNacimiento) {
        this.#fechaNacimiento = fechaNacimiento;
    }

    setGenero(genero) {
        this.#genero = genero;
    }

    setCargo(cargo) {
        this.#cargo = cargo;
    }

    // Método para representar la persona como cadena de texto
    toString() {
        return `Persona: ${this.#codigo}, ${this.#nombre} ${this.#apellido}, ${this.getEdad()} años, ${this.#genero}, ${this.#cargo}`;
    }
}