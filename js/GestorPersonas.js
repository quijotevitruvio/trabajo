// 2. Clase GestorPersonas - Para manejar colecciones de personas
class GestorPersonas {
    #personas; // Colección de personas (Array)

    constructor() {
        this.#personas = []; // Inicializamos un array vacío
    }

    /**
     * Agrega una persona a la colección
     * @param {Persona} persona - Objeto de tipo Persona a agregar
     * @returns {boolean} - Resultado de la operación
     */
    agregarPersona(persona) {
        // Verificamos que sea una instancia de Persona
        if (!(persona instanceof Persona)) {
            console.error("Error: Se esperaba un objeto de tipo Persona");
            return false;
        }

        // Verificamos que no exista ya una persona con el mismo código
        if (this.buscarPorCodigo(persona.getCodigo())) {
            console.error(`Error: Ya existe una persona con el código ${persona.getCodigo()}`);
            return false;
        }

        // Agregamos la persona al array
        this.#personas.push(persona);
        return true;
    }

    /**
     * Elimina una persona de la colección por su código
     * @param {string} codigo - Código de la persona a eliminar
     * @returns {boolean} - Resultado de la operación
     */
    eliminarPersona(codigo) {
        const indice = this.#personas.findIndex(p => p.getCodigo() === codigo);
        
        if (indice === -1) {
            console.error(`Error: No se encontró ninguna persona con el código ${codigo}`);
            return false;
        }
        
        this.#personas.splice(indice, 1);
        return true;
    }

    /**
     * Busca una persona por su código
     * @param {string} codigo - Código de la persona a buscar
     * @returns {Persona|null} - La persona encontrada o null
     */
    buscarPorCodigo(codigo) {
        return this.#personas.find(p => p.getCodigo() === codigo) || null;
    }

    /**
     * Busca personas por su cargo
     * @param {string} cargo - Cargo a buscar
     * @returns {Array<Persona>} - Array con las personas que tienen ese cargo
     */
    buscarPorCargo(cargo) {
        return this.#personas.filter(p => p.getCargo() === cargo);
    }

    /**
     * Obtiene todas las personas de la colección
     * @returns {Array<Persona>} - Copia del array de personas
     */
    obtenerTodas() {
        return [...this.#personas]; // Devolvemos una copia para evitar modificaciones directas
    }

    /**
     * Cuenta el número de personas en la colección
     * @returns {number} - Cantidad de personas
     */
    contarPersonas() {
        return this.#personas.length;
    }
}