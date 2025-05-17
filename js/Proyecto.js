
// Clase Proyecto - Demuestra relación muchos a muchos con Persona
class Proyecto {
    #id;
    #nombre;
    #fechaInicio;
    #fechaFin;
    #participantes; // Relación muchos a muchos con Persona

    constructor(id, nombre, fechaInicio, fechaFin = null) {
        this.#id = id;
        this.#nombre = nombre;
        this.#fechaInicio = fechaInicio;
        this.#fechaFin = fechaFin;
        this.#participantes = []; // Array de objetos {persona, rol}
    }

    // Getters y setters básicos
    getId() {
        return this.#id;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getFechaInicio() {
        return this.#fechaInicio;
    }

    getFechaFin() {
        return this.#fechaFin;
    }

    setFechaFin(fechaFin) {
        this.#fechaFin = fechaFin;
    }

    // Métodos para la relación muchos a muchos
    agregarParticipante(persona, rol) {
        if (!(persona instanceof Persona)) {
            console.error("Error: Se esperaba un objeto de tipo Persona");
            return false;
        }

        // Verificar si ya existe el participante
        if (this.#participantes.some(p => p.persona.getCodigo() === persona.getCodigo())) {
            console.error(`La persona con código ${persona.getCodigo()} ya participa en este proyecto`);
            return false;
        }

        // Agregar persona con su rol en el proyecto
        this.#participantes.push({
            persona: persona,
            rol: rol
        });
        
        return true;
    }

    cambiarRolParticipante(codigoPersona, nuevoRol) {
        const participante = this.#participantes.find(p => p.persona.getCodigo() === codigoPersona);
        
        if (!participante) {
            console.error(`No se encontró ninguna persona con el código ${codigoPersona} en este proyecto`);
            return false;
        }
        
        participante.rol = nuevoRol;
        return true;
    }

    eliminarParticipante(codigoPersona) {
        const indice = this.#participantes.findIndex(p => p.persona.getCodigo() === codigoPersona);
        
        if (indice === -1) {
            console.error(`No se encontró ninguna persona con el código ${codigoPersona} en este proyecto`);
            return false;
        }
        
        this.#participantes.splice(indice, 1);
        return true;
    }

    getParticipantes() {
        return [...this.#participantes]; // Devolvemos una copia
    }

    contarParticipantes() {
        return this.#participantes.length;
    }

    obtenerParticipantesPorRol(rol) {
        return this.#participantes
            .filter(p => p.rol === rol)
            .map(p => p.persona);
    }
}