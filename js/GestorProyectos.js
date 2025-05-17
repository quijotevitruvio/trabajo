// Clase GestorProyectos - Para manejar colecciones de proyectos
class GestorProyectos {
    #proyectos; // Colección de proyectos (Array)

    constructor() {
        this.#proyectos = []; // Inicializamos un array vacío
    }

    /**
     * Agrega un proyecto a la colección
     * @param {Proyecto} proyecto - Objeto de tipo Proyecto a agregar
     * @returns {boolean} - Resultado de la operación
     */
    agregarProyecto(proyecto) {
        // Verificamos que sea una instancia de Proyecto
        if (!(proyecto instanceof Proyecto)) {
            console.error("Error: Se esperaba un objeto de tipo Proyecto");
            return false;
        }

        // Verificamos que no exista ya un proyecto con el mismo ID
        if (this.buscarPorId(proyecto.getId())) {
            console.error(`Error: Ya existe un proyecto con el ID ${proyecto.getId()}`);
            return false;
        }

        // Agregamos el proyecto al array
        this.#proyectos.push(proyecto);
        return true;
    }

    /**
     * Elimina un proyecto de la colección por su ID
     * @param {string} id - ID del proyecto a eliminar
     * @returns {boolean} - Resultado de la operación
     */
    eliminarProyecto(id) {
        const indice = this.#proyectos.findIndex(p => p.getId() === id);
        
        if (indice === -1) {
            console.error(`Error: No se encontró ningún proyecto con el ID ${id}`);
            return false;
        }
        
        this.#proyectos.splice(indice, 1);
        return true;
    }

    /**
     * Busca un proyecto por su ID
     * @param {string} id - ID del proyecto a buscar
     * @returns {Proyecto|null} - El proyecto encontrado o null
     */
    buscarPorId(id) {
        return this.#proyectos.find(p => p.getId() === id) || null;
    }

    /**
     * Busca proyectos por su nombre (parcial o completo)
     * @param {string} nombre - Nombre a buscar
     * @returns {Array<Proyecto>} - Array con los proyectos que coinciden
     */
    buscarPorNombre(nombre) {
        const nombreLower = nombre.toLowerCase();
        return this.#proyectos.filter(p => 
            p.getNombre().toLowerCase().includes(nombreLower)
        );
    }

    /**
     * Obtiene todos los proyectos de la colección
     * @returns {Array<Proyecto>} - Copia del array de proyectos
     */
    obtenerTodos() {
        return [...this.#proyectos]; // Devolvemos una copia para evitar modificaciones directas
    }

    /**
     * Cuenta el número de proyectos en la colección
     * @returns {number} - Cantidad de proyectos
     */
    contarProyectos() {
        return this.#proyectos.length;
    }

    /**
     * Busca proyectos en los que participa una persona específica
     * @param {string} codigoPersona - Código de la persona
     * @returns {Array<Proyecto>} - Proyectos en los que participa la persona
     */
    buscarProyectosPorParticipante(codigoPersona) {
        return this.#proyectos.filter(proyecto => {
            const participantes = proyecto.getParticipantes();
            return participantes.some(p => p.persona.getCodigo() === codigoPersona);
        });
    }

    /**
     * Busca proyectos activos (sin fecha de fin o con fecha de fin posterior a hoy)
     * @returns {Array<Proyecto>} - Proyectos activos
     */
    obtenerProyectosActivos() {
        const hoy = new Date();
        return this.#proyectos.filter(p => {
            const fechaFin = p.getFechaFin();
            return !fechaFin || fechaFin > hoy;
        });
    }
} 