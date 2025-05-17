// Inicializar el gestor de proyectos
const gestorProyectos = new GestorProyectos();

// Elementos del DOM para proyectos
const proyectosList = document.getElementById('proyectos-list');
const proyectoForm = document.getElementById('proyecto-form');
const proyectoSelect = document.getElementById('proyecto-select');
const participantesProyectoSelect = document.getElementById('participantes-proyecto-select');
const editProyectoForm = document.getElementById('edit-proyecto-form');
const participantesContainer = document.getElementById('participantes-container');
const participantesList = document.getElementById('participantes-list');
const addParticipanteForm = document.getElementById('add-participante-form');
const participantePersonaSelect = document.getElementById('participante-persona-select');
// Nueva declaración para el select de proyectos en la creación de departamentos
const selectProyectoParaDepto = document.getElementById('select-proyecto-para-depto');

// Referencia al gestor de personas existente (definido en control.js)
// Asumimos que ya existe una instancia de gestorPersonas

// Función para mostrar los proyectos en la tabla
function mostrarProyectos() {
    proyectosList.innerHTML = '';
    
    const proyectos = gestorProyectos.obtenerTodos();
    
    if (proyectos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="empty-message">No hay proyectos registrados</td>';
        proyectosList.appendChild(row);
        return;
    }
    
    proyectos.forEach(proyecto => {
        const row = document.createElement('tr');
        
        // Formatear las fechas para mostrarlas
        const fechaInicio = proyecto.getFechaInicio();
        const fechaInicioFormateada = fechaInicio instanceof Date ? 
            `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}` : 
            'Fecha inválida';
        
        const fechaFin = proyecto.getFechaFin();
        const fechaFinFormateada = fechaFin instanceof Date ? 
            `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}` : 
            'En curso';
        
        // Contar participantes
        const numParticipantes = proyecto.contarParticipantes();
        
        row.innerHTML = `
            <td>${proyecto.getId()}</td>
            <td>${proyecto.getNombre()}</td>
            <td>${fechaInicioFormateada}</td>
            <td>${fechaFinFormateada}</td>
            <td>${numParticipantes} participante(s)</td>
            <td>
                <button class="btn-edit" data-id="${proyecto.getId()}">Editar</button>
                <button class="btn-delete" data-id="${proyecto.getId()}">Eliminar</button>
                <button class="btn-manage" data-id="${proyecto.getId()}">Participantes</button>
            </td>
        `;
        
        proyectosList.appendChild(row);
    });
    
    // Agregar eventos a los botones
    document.querySelectorAll('#proyectos-list .btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            cargarProyectoParaEditar(id);
            
            // Cambiar a la pestaña de edición
            document.querySelector('.tab[data-tab="edit-proyecto"]').click();
        });
    });
    
    document.querySelectorAll('#proyectos-list .btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            eliminarProyecto(id);
        });
    });
    
    document.querySelectorAll('#proyectos-list .btn-manage').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            participantesProyectoSelect.value = id;
            cargarParticipantes(id);
            
            // Cambiar a la pestaña de gestión de participantes
            document.querySelector('.tab[data-tab="manage-participantes"]').click();
        });
    });
}

// Función para guardar un nuevo proyecto
function guardarProyecto(event) {
    event.preventDefault();
    
    const id = document.getElementById('proyecto-id').value;
    const nombre = document.getElementById('proyecto-nombre').value;
    const fechaInicio = new Date(document.getElementById('proyecto-fecha-inicio').value);
    
    // La fecha de fin es opcional
    const fechaFinInput = document.getElementById('proyecto-fecha-fin').value;
    const fechaFin = fechaFinInput ? new Date(fechaFinInput) : null;
    
    try {
        const nuevoProyecto = new Proyecto(id, nombre, fechaInicio, fechaFin);
        
        if (gestorProyectos.agregarProyecto(nuevoProyecto)) {
            alert('Proyecto agregado correctamente');
            proyectoForm.reset();
            mostrarProyectos();
            actualizarSelectsProyectos();
            
            // Cambiar a la pestaña de ver proyectos
            document.querySelector('.tab[data-tab="view-proyectos"]').click();
        } else {
            alert('Error: No se pudo agregar el proyecto. El ID podría estar duplicado.');
        }
    } catch (error) {
        alert(`Error al crear el proyecto: ${error.message}`);
    }
}

// Función para actualizar los selects de proyectos
function actualizarSelectsProyectos() {
    // Limpiar los selects
    if (proyectoSelect) {
        proyectoSelect.innerHTML = '<option value="">Seleccione un proyecto...</option>';
    }
    if (participantesProyectoSelect) {
        participantesProyectoSelect.innerHTML = '<option value="">Seleccione un proyecto...</option>';
    }
    // Limpiar también el select de proyecto para departamento, si existe
    if (selectProyectoParaDepto) {
        selectProyectoParaDepto.innerHTML = '<option value="">Seleccione un Proyecto...</option>';
    }
    
    const proyectos = gestorProyectos.obtenerTodos();
    
    proyectos.forEach(proyecto => {
        // Para el select de edición
        if (proyectoSelect) {
            const optionEdit = document.createElement('option');
            optionEdit.value = proyecto.getId();
            optionEdit.textContent = `${proyecto.getId()} - ${proyecto.getNombre()}`;
            proyectoSelect.appendChild(optionEdit);
        }
        
        // Para el select de gestión de participantes
        if (participantesProyectoSelect) {
            const optionParticipantes = document.createElement('option');
            optionParticipantes.value = proyecto.getId();
            optionParticipantes.textContent = `${proyecto.getId()} - ${proyecto.getNombre()}`;
            participantesProyectoSelect.appendChild(optionParticipantes);
        }

        // Para el select de proyecto al crear un departamento
        if (selectProyectoParaDepto) {
            const optionDepto = document.createElement('option');
            optionDepto.value = proyecto.getId();
            optionDepto.textContent = `${proyecto.getNombre()} (ID: ${proyecto.getId()})`; // Formato consistente con controlDepartamentos.js
            selectProyectoParaDepto.appendChild(optionDepto);
        }
    });
}

// Función para cargar los datos de un proyecto en el formulario de edición
function cargarProyectoParaEditar(id) {
    const proyecto = gestorProyectos.buscarPorId(id);
    
    if (!proyecto) {
        alert('No se encontró el proyecto seleccionado');
        return;
    }
    
    // Seleccionar el proyecto en el dropdown
    proyectoSelect.value = id;
    
    // Cargar los datos en el formulario
    document.getElementById('edit-proyecto-id').value = proyecto.getId();
    document.getElementById('edit-proyecto-nombre').value = proyecto.getNombre();
    
    // Formatear las fechas para los inputs date
    const fechaInicio = proyecto.getFechaInicio();
    const fechaInicioFormateada = fechaInicio instanceof Date ? 
        fechaInicio.toISOString().split('T')[0] : '';
    document.getElementById('edit-proyecto-fecha-inicio').value = fechaInicioFormateada;
    
    const fechaFin = proyecto.getFechaFin();
    const fechaFinFormateada = fechaFin instanceof Date ? 
        fechaFin.toISOString().split('T')[0] : '';
    document.getElementById('edit-proyecto-fecha-fin').value = fechaFinFormateada;
}

// Función para actualizar un proyecto
function actualizarProyecto(event) {
    event.preventDefault();
    
    const id = document.getElementById('edit-proyecto-id').value;
    const proyecto = gestorProyectos.buscarPorId(id);
    
    if (!proyecto) {
        alert('No se encontró el proyecto seleccionado');
        return;
    }
    
    proyecto.setNombre(document.getElementById('edit-proyecto-nombre').value);
    proyecto.setFechaInicio(new Date(document.getElementById('edit-proyecto-fecha-inicio').value));
    
    // La fecha de fin es opcional
    const fechaFinInput = document.getElementById('edit-proyecto-fecha-fin').value;
    proyecto.setFechaFin(fechaFinInput ? new Date(fechaFinInput) : null);
    
    alert('Proyecto actualizado correctamente');
    mostrarProyectos();
    
    // Cambiar a la pestaña de ver proyectos
    document.querySelector('.tab[data-tab="view-proyectos"]').click();
}

// Función para eliminar un proyecto
function eliminarProyecto(id) {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
        if (gestorProyectos.eliminarProyecto(id)) {
            alert('Proyecto eliminado correctamente');
            mostrarProyectos();
            actualizarSelectsProyectos();
        } else {
            alert('Error: No se pudo eliminar el proyecto');
        }
    }
}

// Función para cargar los participantes de un proyecto
function cargarParticipantes(id) {
    const proyecto = gestorProyectos.buscarPorId(id);
    
    if (!proyecto) {
        participantesContainer.classList.add('hidden');
        return;
    }
    
    participantesContainer.classList.remove('hidden');
    
    // Mostrar los participantes en la tabla
    participantesList.innerHTML = '';
    
    const participantes = proyecto.getParticipantes();
    
    if (participantes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="empty-message">No hay participantes registrados</td>';
        participantesList.appendChild(row);
    } else {
        participantes.forEach(participante => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${participante.persona.getCodigo()}</td>
                <td>${participante.persona.getNombreCompleto()}</td>
                <td>${participante.rol}</td>
                <td>
                    <button class="btn-remove-participante" data-codigo="${participante.persona.getCodigo()}">Eliminar</button>
                </td>
            `;
            
            participantesList.appendChild(row);
        });
    }
    
    // Agregar eventos a los botones de eliminar participante
    document.querySelectorAll('.btn-remove-participante').forEach(btn => {
        btn.addEventListener('click', () => {
            const codigo = btn.getAttribute('data-codigo');
            eliminarParticipante(id, codigo);
        });
    });
    
    // Actualizar el select de personas disponibles
    actualizarSelectPersonasDisponibles(proyecto);
}

// Función para actualizar el select de personas disponibles para agregar como participantes
function actualizarSelectPersonasDisponibles(proyecto) {
    participantePersonaSelect.innerHTML = '<option value="">Seleccione una persona...</option>';
    
    const todasLasPersonas = gestorPersonas.obtenerTodas();
    const participantesActuales = proyecto.getParticipantes().map(p => p.persona.getCodigo());
    
    // Filtrar las personas que no son participantes actuales
    const personasDisponibles = todasLasPersonas.filter(persona => 
        !participantesActuales.includes(persona.getCodigo())
    );
    
    personasDisponibles.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.getCodigo();
        option.textContent = `${persona.getCodigo()} - ${persona.getNombreCompleto()}`;
        participantePersonaSelect.appendChild(option);
    });
}

// Función para agregar un participante a un proyecto
function agregarParticipante(event) {
    event.preventDefault();
    
    const proyectoId = participantesProyectoSelect.value;
    const proyecto = gestorProyectos.buscarPorId(proyectoId);
    
    if (!proyecto) {
        alert('Seleccione un proyecto válido');
        return;
    }
    
    const personaCodigo = participantePersonaSelect.value;
    const persona = gestorPersonas.buscarPorCodigo(personaCodigo);
    
    if (!persona) {
        alert('Seleccione una persona válida');
        return;
    }
    
    const rol = document.getElementById('participante-rol').value;
    
    if (proyecto.agregarParticipante(persona, rol)) {
        alert('Participante agregado correctamente');
        addParticipanteForm.reset();
        cargarParticipantes(proyectoId);
        mostrarProyectos(); // Actualizar la tabla de proyectos para reflejar el nuevo número de participantes
    } else {
        alert('Error: No se pudo agregar el participante');
    }
}

// Función para eliminar un participante de un proyecto
function eliminarParticipante(proyectoId, personaCodigo) {
    if (confirm('¿Está seguro de que desea eliminar este participante del proyecto?')) {
        const proyecto = gestorProyectos.buscarPorId(proyectoId);
        
        if (!proyecto) {
            alert('Proyecto no encontrado');
            return;
        }
        
        if (proyecto.eliminarParticipante(personaCodigo)) {
            alert('Participante eliminado correctamente');
            cargarParticipantes(proyectoId);
            mostrarProyectos(); // Actualizar la tabla de proyectos
        } else {
            alert('Error: No se pudo eliminar el participante');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Los tabs ya están configurados en control.js, así que no necesitamos duplicar esa lógica
    
    // Mostrar la lista inicial de proyectos (vacía)
    mostrarProyectos();
    
    // Event listener para el formulario de creación de proyectos
    proyectoForm.addEventListener('submit', guardarProyecto);
    
    // Event listener para el select de proyectos (edición)
    proyectoSelect.addEventListener('change', () => {
        const id = proyectoSelect.value;
        if (id) {
            cargarProyectoParaEditar(id);
        } else {
            editProyectoForm.reset();
        }
    });
    
    // Event listener para el formulario de edición de proyectos
    editProyectoForm.addEventListener('submit', actualizarProyecto);
    
    // Event listener para el botón de eliminar en el formulario de edición
    document.getElementById('delete-proyecto').addEventListener('click', () => {
        const id = document.getElementById('edit-proyecto-id').value;
        if (id) {
            eliminarProyecto(id);
        }
    });
    
    // Event listener para el select de proyectos (gestión de participantes)
    participantesProyectoSelect.addEventListener('change', () => {
        const id = participantesProyectoSelect.value;
        if (id) {
            cargarParticipantes(id);
        } else {
            participantesContainer.classList.add('hidden');
        }
    });
    
    // Event listener para el formulario de agregar participante
    addParticipanteForm.addEventListener('submit', agregarParticipante);
    
    // Agregar un proyecto de ejemplo para pruebas
    const proyectoEjemplo = new Proyecto(
        'P001', 
        'Sistema de Gestión', 
        new Date('2023-01-15'), 
        new Date('2023-12-31')
    );
    
    gestorProyectos.agregarProyecto(proyectoEjemplo);
    
    // Agregar algunos participantes de ejemplo
    const persona1 = gestorPersonas.buscarPorCodigo('P001'); // Bryan Ibarra
    const persona2 = gestorPersonas.buscarPorCodigo('P002'); // Gustav Hooker
    
    if (persona1) {
        proyectoEjemplo.agregarParticipante(persona1, 'Desarrollador Backend');
    }
    
    if (persona2) {
        proyectoEjemplo.agregarParticipante(persona2, 'Diseñador UI/UX');
    }
    
    // Actualizar la interfaz
    mostrarProyectos();
    actualizarSelectsProyectos();
});