// Clase GestorDepartamentos - Para manejar colecciones de departamentos
class GestorDepartamentos {
    #departamentos;

    constructor() {
        this.#departamentos = [];
    }

    agregarDepartamento(departamento) {
        if (!(departamento instanceof Departamento)) {
            console.error("Error: Se esperaba un objeto de tipo Departamento.");
            return false;
        }
        if (this.#departamentos.some(d => d.getId() === departamento.getId())) {
            console.error(`Error: Ya existe un departamento con el ID ${departamento.getId()}.`);
            return false;
        }
        this.#departamentos.push(departamento);
        console.log('Departamento agregado:', departamento);
        return true;
    }

    eliminarDepartamento(idDepartamento) {
        const indice = this.#departamentos.findIndex(d => d.getId() === idDepartamento);
        if (indice === -1) {
            console.error(`Error: No se encontró departamento con ID ${idDepartamento}.`);
            return false;
        }
        this.#departamentos.splice(indice, 1);
        console.log('Departamento eliminado ID:', idDepartamento);
        return true;
    }

    buscarDepartamentoPorId(idDepartamento) {
        return this.#departamentos.find(d => d.getId() === idDepartamento) || null;
    }

    obtenerDepartamentosPorProyecto(proyectoId) {
        return this.#departamentos.filter(d => d.getProyectoId() === proyectoId);
    }

    obtenerTodos() {
        return [...this.#departamentos];
    }

    agregarMiembroADepartamento(idDepartamento, persona, gestorPersonas) {
        const departamento = this.buscarDepartamentoPorId(idDepartamento);
        if (!departamento) {
            console.error(`Error: Departamento con ID ${idDepartamento} no encontrado al intentar agregar miembro.`);
            return false;
        }
        // Es una buena práctica verificar que la persona exista, si tienes acceso al gestorPersonas
        if (gestorPersonas && !gestorPersonas.buscarPorCodigo(persona.getCodigo())) {
             console.error(`Error: Persona con código ${persona.getCodigo()} no encontrada en el gestor de personas.`);
             return false;
        }

        const resultado = departamento.agregarMiembro(persona);
        if(resultado) console.log(`Miembro ${persona.getCodigo()} agregado al depto ${idDepartamento}`);
        return resultado;
    }

    eliminarMiembroDeDepartamento(idDepartamento, codigoPersona) {
        const departamento = this.buscarDepartamentoPorId(idDepartamento);
        if (!departamento) {
            console.error(`Error: Departamento con ID ${idDepartamento} no encontrado al intentar eliminar miembro.`);
            return false;
        }
        const resultado = departamento.eliminarMiembro(codigoPersona);
        if(resultado) console.log(`Miembro ${codigoPersona} eliminado del depto ${idDepartamento}`);
        return resultado;
    }
}