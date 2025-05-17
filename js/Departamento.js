// Clase Departamento - Relación "tiene muchos" (one-to-many) con Persona, y pertenece a un Proyecto
class Departamento {
    #id;
    #nombre;
    #proyectoId; // ID del proyecto al que pertenece el departamento
    #miembros; // Relación con Persona (composición)

    constructor(id, nombre, proyectoId) { // Añadido proyectoId
        this.#id = id;
        this.#nombre = nombre;
        this.#proyectoId = proyectoId; // Asignar proyectoId
        this.#miembros = []; // Array de personas que pertenecen al departamento
    }

    // Getters y setters
    getId() {
        return this.#id;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getProyectoId() { // Nuevo getter
        return this.#proyectoId;
    }

    // Métodos para gestionar los miembros
    agregarMiembro(persona) {
        if (!(persona instanceof Persona)) {
            console.error("Error: Se esperaba un objeto de tipo Persona");
            return false;
        }

        // Verificamos que no esté ya en el departamento
        if (this.#miembros.some(p => p.getCodigo() === persona.getCodigo())) {
            console.error(`La persona con código ${persona.getCodigo()} ya es miembro de este departamento`);
            return false;
        }

        this.#miembros.push(persona);
        return true;
    }

    eliminarMiembro(codigo) {
        const indice = this.#miembros.findIndex(p => p.getCodigo() === codigo);
        
        if (indice === -1) {
            console.error(`No se encontró ninguna persona con el código ${codigo} en este departamento`);
            return false;
        }
        
        this.#miembros.splice(indice, 1);
        return true;
    }

    getMiembros() {
        return [...this.#miembros]; // Devolvemos una copia
    }

    contarMiembros() {
        return this.#miembros.length;
    }
}