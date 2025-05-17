// Inicializar el gestor de personas
const gestorPersonas = new GestorPersonas();

// Elementos del DOM
const personasList = document.getElementById('personas-list');
const personaForm = document.getElementById('persona-form');
const personaSelect = document.getElementById('persona-select');
const editPersonaForm = document.getElementById('edit-persona-form');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Función para cambiar entre pestañas
function setupTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Activar la pestaña seleccionada
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostrar el contenido de la pestaña seleccionada
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });

            // Si cambiamos a la pestaña de editar, actualizamos la lista de personas
            if (tabId === 'edit-persona') {
                actualizarSelectPersonas();
            }
        });
    });
}

// Función para mostrar las personas en la tabla
function mostrarPersonas() {
    personasList.innerHTML = '';
    
    const personas = gestorPersonas.obtenerTodas();
    
    if (personas.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="empty-message">No hay personas registradas</td>';
        personasList.appendChild(row);
        return;
    }
    
    personas.forEach(persona => {
        const row = document.createElement('tr');
        
        // Formatear la fecha para mostrarla
        const fechaNac = persona.getFechaNacimiento();
        const fechaFormateada = fechaNac instanceof Date ? 
            `${fechaNac.getDate()}/${fechaNac.getMonth() + 1}/${fechaNac.getFullYear()}` : 
            'Fecha inválida';
        
        row.innerHTML = `
            <td>${persona.getCodigo()}</td>
            <td>${persona.getNombre()}</td>
            <td>${persona.getApellido()}</td>
            <td>${fechaFormateada}</td>
            <td>${persona.getGenero()}</td>
            <td>${persona.getCargo()}</td>
            <td>
                <button class="btn-edit" data-codigo="${persona.getCodigo()}">Editar</button>
                <button class="btn-delete" data-codigo="${persona.getCodigo()}">Eliminar</button>
            </td>
        `;
        
        personasList.appendChild(row);
    });
    
    // Agregar eventos a los botones de editar y eliminar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const codigo = btn.getAttribute('data-codigo');
            cargarPersonaParaEditar(codigo);
            
            // Cambiar a la pestaña de edición
            tabs.forEach(tab => {
                if (tab.getAttribute('data-tab') === 'edit-persona') {
                    tab.click();
                }
            });
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const codigo = btn.getAttribute('data-codigo');
            eliminarPersona(codigo);
        });
    });
}

// Función para guardar una nueva persona
function guardarPersona(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
    const genero = document.getElementById('genero').value;
    const cargo = document.getElementById('cargo').value;
    
    try {
        const nuevaPersona = new Persona(codigo, nombre, apellido, fechaNacimiento, genero, cargo);
        
        if (gestorPersonas.agregarPersona(nuevaPersona)) {
            alert('Persona agregada correctamente');
            personaForm.reset();
            mostrarPersonas();
            
            // Cambiar a la pestaña de ver personas
            tabs.forEach(tab => {
                if (tab.getAttribute('data-tab') === 'view-personas') {
                    tab.click();
                }
            });
        } else {
            alert('Error: No se pudo agregar la persona. El código podría estar duplicado.');
        }
    } catch (error) {
        alert(`Error al crear la persona: ${error.message}`);
    }
}

// Función para actualizar el select de personas en la pestaña de edición
function actualizarSelectPersonas() {
    personaSelect.innerHTML = '<option value="">Seleccione una persona...</option>';
    
    const personas = gestorPersonas.obtenerTodas();
    
    personas.forEach(persona => {
        const option = document.createElement('option');
        option.value = persona.getCodigo();
        option.textContent = `${persona.getCodigo()} - ${persona.getNombreCompleto()}`;
        personaSelect.appendChild(option);
    });
}

// Función para cargar los datos de una persona en el formulario de edición
function cargarPersonaParaEditar(codigo) {
    const persona = gestorPersonas.buscarPorCodigo(codigo);
    
    if (!persona) {
        alert('No se encontró la persona seleccionada');
        return;
    }
    
    // Seleccionar la persona en el dropdown
    personaSelect.value = codigo;
    
    // Cargar los datos en el formulario
    document.getElementById('edit-codigo').value = persona.getCodigo();
    document.getElementById('edit-nombre').value = persona.getNombre();
    document.getElementById('edit-apellido').value = persona.getApellido();
    
    // Formatear la fecha para el input date
    const fechaNac = persona.getFechaNacimiento();
    const fechaFormateada = fechaNac instanceof Date ? 
        fechaNac.toISOString().split('T')[0] : '';
    document.getElementById('edit-fechaNacimiento').value = fechaFormateada;
    
    document.getElementById('edit-genero').value = persona.getGenero();
    document.getElementById('edit-cargo').value = persona.getCargo();
}

// Función para actualizar una persona
function actualizarPersona(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('edit-codigo').value;
    const persona = gestorPersonas.buscarPorCodigo(codigo);
    
    if (!persona) {
        alert('No se encontró la persona seleccionada');
        return;
    }
    
    persona.setNombre(document.getElementById('edit-nombre').value);
    persona.setApellido(document.getElementById('edit-apellido').value);
    persona.setFechaNacimiento(new Date(document.getElementById('edit-fechaNacimiento').value));
    persona.setGenero(document.getElementById('edit-genero').value);
    persona.setCargo(document.getElementById('edit-cargo').value);
    
    alert('Persona actualizada correctamente');
    mostrarPersonas();
    
    // Cambiar a la pestaña de ver personas
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === 'view-personas') {
            tab.click();
        }
    });
}

// Función para eliminar una persona
function eliminarPersona(codigo) {
    if (confirm('¿Está seguro de que desea eliminar esta persona?')) {
        if (gestorPersonas.eliminarPersona(codigo)) {
            alert('Persona eliminada correctamente');
            mostrarPersonas();
            actualizarSelectPersonas();
        } else {
            alert('Error: No se pudo eliminar la persona');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configurar las pestañas
    setupTabs();
    
    // Mostrar la lista inicial de personas (vacía)
    mostrarPersonas();
    
    // Event listener para el formulario de creación
    personaForm.addEventListener('submit', guardarPersona);
    
    // Event listener para el select de personas
    personaSelect.addEventListener('change', () => {
        const codigo = personaSelect.value;
        if (codigo) {
            cargarPersonaParaEditar(codigo);
        } else {
            editPersonaForm.reset();
        }
    });
    
    // Event listener para el formulario de edición
    editPersonaForm.addEventListener('submit', actualizarPersona);
    
    // Event listener para el botón de eliminar en el formulario de edición
    document.getElementById('delete-persona').addEventListener('click', () => {
        const codigo = document.getElementById('edit-codigo').value;
        if (codigo) {
            eliminarPersona(codigo);
        }
    });
    
    // Agregar algunas personas de ejemplo para pruebas
    const persona1 = new Persona('P001', 'Bryan', 'Ibarra', new Date('1990-05-15'), 'Masculino', 'Desarrollador');
    const persona2 = new Persona('P002', 'Gustav', 'Hooker', new Date('1985-10-20'), 'Masculino', 'Diseñador');
    const persona3 = new Persona('P003', 'Mauricio', 'Rivero', new Date('1984-01-02'), 'Masculino', 'Desarrollador');
    const persona4 = new Persona('P004', 'Ana', 'Gonzalez', new Date('1992-07-25'), 'Femenino', 'Gerente');
    
    
    gestorPersonas.agregarPersona(persona1);
    gestorPersonas.agregarPersona(persona2);
    gestorPersonas.agregarPersona(persona3);
    gestorPersonas.agregarPersona(persona4);
    
    // Actualizar la vista
    mostrarPersonas();
});

//crea objetos de la clase proyectos para llenar en lista de proyectos de acuerdo a la clase Proyecto y agrega al atributo array participantes dos instancias de la clase persona
const proyecto1 = new Proyecto('P001', 'Proyecto Alpha', new Date('2023-01-01'), new Date('2023-12-31'));
const proyecto2 = new Proyecto('P002', 'Proyecto Beta', new Date('2023-02-01'), new Date('2023-11-30'));
const proyecto3 = new Proyecto('P003', 'Proyecto Gamma', new Date('2023-03-01'), new Date('2023-10-31'));
const proyecto4 = new Proyecto('P004', 'Proyecto Delta', new Date('2023-04-01'), new Date('2023-09-30'));

