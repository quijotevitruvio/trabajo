// js/controlDepartamentos.js

// Asumiendo que gestorPersonas y gestorProyectos ya están instanciados globalmente
// y son accesibles (ej. definidos en control.js o directamente en el scope global).
// Si no es así, deberás obtener/instanciar gestorPersonas y gestorProyectos aquí.
// const gestorPersonas = new GestorPersonas(); // Si se instancia aquí
// const gestorProyectos = new GestorProyectos(); // Si se instancia aquí

const gestorDepartamentos = new GestorDepartamentos();

document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de Elementos HTML (ajusta los IDs a tu HTML) ---
    const formCrearDepartamento = document.getElementById('form-crear-departamento');
    const selectProyectoParaDepto = document.getElementById('select-proyecto-para-depto');
    const inputDeptoId = document.getElementById('input-depto-id');
    const inputDeptoNombre = document.getElementById('input-depto-nombre');
    const listaDepartamentosDiv = document.getElementById('lista-departamentos-div'); // Div para mostrar la lista

    const formAgregarMiembroDepto = document.getElementById('form-agregar-miembro-depto');
    const selectDepartamentoParaMiembro = document.getElementById('select-departamento-para-miembro');
    const selectPersonaParaMiembroDepto = document.getElementById('select-persona-para-miembro-depto');

    // --- Funciones para Cargar Datos en Selects ---
    function cargarProyectosEnSelect() {
        if (!gestorProyectos || !selectProyectoParaDepto) {
            console.warn('Gestor de proyectos o select de proyectos no encontrado para cargar datos.');
            return;
        }
        selectProyectoParaDepto.innerHTML = '<option value="">Seleccione un Proyecto...</option>';
        gestorProyectos.obtenerTodos().forEach(proyecto => {
            const option = document.createElement('option');
            option.value = proyecto.getId();
            option.textContent = `${proyecto.getNombre()} (ID: ${proyecto.getId()})`;
            selectProyectoParaDepto.appendChild(option);
        });
    }

    function cargarDepartamentosEnSelect() {
        if (!selectDepartamentoParaMiembro) {
            console.warn('Select de departamentos para miembro no encontrado.');
            return;
        }
        selectDepartamentoParaMiembro.innerHTML = '<option value="">Seleccione un Departamento...</option>';
        gestorDepartamentos.obtenerTodos().forEach(depto => {
            const option = document.createElement('option');
            option.value = depto.getId();
            const proyecto = gestorProyectos.buscarPorId(depto.getProyectoId());
            const nombreProyecto = proyecto ? proyecto.getNombre() : 'Proyecto Desconocido';
            option.textContent = `${depto.getNombre()} (Proyecto: ${nombreProyecto}, ID: ${depto.getId()})`;
            selectDepartamentoParaMiembro.appendChild(option);
        });
    }
    
    function cargarPersonasEnSelectMiembros() {
        if (!gestorPersonas || !selectPersonaParaMiembroDepto) {
            console.warn('Gestor de personas o select de personas para miembro no encontrado.');
            return;
        }
        selectPersonaParaMiembroDepto.innerHTML = '<option value="">Seleccione una Persona...</option>';
        gestorPersonas.obtenerTodas().forEach(persona => {
            const option = document.createElement('option');
            option.value = persona.getCodigo();
            option.textContent = `${persona.getNombreCompleto()} (Código: ${persona.getCodigo()})`;
            selectPersonaParaMiembroDepto.appendChild(option);
        });
    }

    // --- Función para Mostrar Departamentos en el DOM ---
    function mostrarDepartamentos() {
        if (!listaDepartamentosDiv) {
            console.warn('Div para lista de departamentos no encontrado.');
            return;
        }
        listaDepartamentosDiv.innerHTML = '<h4>Departamentos Actuales</h4>';
        const departamentos = gestorDepartamentos.obtenerTodos();

        if (departamentos.length === 0) {
            listaDepartamentosDiv.innerHTML += '<p>Aún no hay departamentos creados.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'lista-items'; // Para aplicar estilos si tienes una clase general
        departamentos.forEach(depto => {
            const li = document.createElement('li');
            const proyecto = gestorProyectos.buscarPorId(depto.getProyectoId());
            const nombreProyecto = proyecto ? proyecto.getNombre() : `ID Proyecto: ${depto.getProyectoId()}`;
            
            li.innerHTML = `<strong>${depto.getNombre()} (ID: ${depto.getId()})</strong><br>
                            <small>Proyecto: ${nombreProyecto}</small>`;
            
            const miembrosUl = document.createElement('ul');
            miembrosUl.style.marginLeft = "20px";
            miembrosUl.innerHTML = '<small>Miembros:</small>';
            depto.getMiembros().forEach(miembro => {
                const miembroLi = document.createElement('li');
                miembroLi.innerHTML = `<small>${miembro.getNombreCompleto()} (Cód: ${miembro.getCodigo()})</small> `;
                
                const botonEliminarMiembro = document.createElement('button');
                botonEliminarMiembro.textContent = 'Quitar';
                botonEliminarMiembro.className = 'btn-eliminar-inline'; // Estilo para botón pequeño
                botonEliminarMiembro.onclick = () => {
                    if (confirm(`¿Quitar a ${miembro.getNombreCompleto()} del departamento ${depto.getNombre()}?`)) {
                        if (gestorDepartamentos.eliminarMiembroDeDepartamento(depto.getId(), miembro.getCodigo())) {
                            mostrarDepartamentos(); // Re-render
                        } else {
                            alert('Error al quitar miembro.');
                        }
                    }
                };
                miembroLi.appendChild(botonEliminarMiembro);
                miembrosUl.appendChild(miembroLi);
            });
            if (depto.getMiembros().length === 0) {
                 miembrosUl.innerHTML += '<li><small>No hay miembros asignados.</small></li>';
            }
            li.appendChild(miembrosUl);

            const botonEliminarDepto = document.createElement('button');
            botonEliminarDepto.textContent = 'Eliminar Departamento';
            botonEliminarDepto.className = 'btn-accion'; // Estilo general para botones de acción
            botonEliminarDepto.style.marginTop = '5px';
            botonEliminarDepto.onclick = () => {
                if (confirm(`¿Eliminar el departamento ${depto.getNombre()}? (Los miembros no se eliminan del sistema)`)) {
                    if (gestorDepartamentos.eliminarDepartamento(depto.getId())) {
                        mostrarDepartamentos();
                        cargarDepartamentosEnSelect(); 
                    } else {
                        alert('Error al eliminar departamento.');
                    }
                }
            };
            li.appendChild(botonEliminarDepto);
            ul.appendChild(li);
        });
        listaDepartamentosDiv.appendChild(ul);
    }

    // --- Event Listeners para Formularios ---
    if (formCrearDepartamento) {
        formCrearDepartamento.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = inputDeptoId.value.trim();
            const nombre = inputDeptoNombre.value.trim();
            const proyectoId = selectProyectoParaDepto.value;

            if (!id || !nombre || !proyectoId) {
                alert('Todos los campos son requeridos, incluyendo seleccionar un proyecto.');
                return;
            }
            // Es buena práctica verificar que el proyecto exista, si tienes acceso al gestorProyectos
            if (typeof gestorProyectos !== 'undefined' && !gestorProyectos.buscarPorId(proyectoId)) {
                alert('El proyecto seleccionado no es válido o no existe.');
                return;
            }

            const nuevoDepartamento = new Departamento(id, nombre, proyectoId);
            if (gestorDepartamentos.agregarDepartamento(nuevoDepartamento)) {
                alert('Departamento creado con éxito.'); // Mensaje de éxito
                formCrearDepartamento.reset(); // Limpiar formulario
                mostrarDepartamentos(); // Actualizar la lista de departamentos mostrada
                cargarDepartamentosEnSelect(); // Actualizar los selects que listan departamentos
                // Cambiar a la pestaña de ver departamentos
                const tabVerDepartamentos = document.querySelector('.tab[data-tab="view-departamentos"]');
                if (tabVerDepartamentos) {
                    // Simular clic en la pestaña si la lógica de tabs está centralizada
                    // o directamente manipular clases si es necesario.
                    // Esto asume que tienes una función global para manejar tabs o que .click() funciona.
                    tabVerDepartamentos.click(); 
                }
            } else {
                alert('No se pudo crear el departamento. Verifique que el ID no esté repetido.'); // Mensaje de error
            }
        });
    }

    if (formAgregarMiembroDepto) {
        formAgregarMiembroDepto.addEventListener('submit', (e) => {
            e.preventDefault();
            const idDepartamento = selectDepartamentoParaMiembro.value;
            const codigoPersona = selectPersonaParaMiembroDepto.value;

            if (!idDepartamento || !codigoPersona) {
                alert('Debe seleccionar un departamento y una persona.');
                return;
            }

            const persona = gestorPersonas.buscarPorCodigo(codigoPersona);
            if (!persona) {
                alert('La persona seleccionada no fue encontrada.');
                return;
            }

            if (gestorDepartamentos.agregarMiembroADepartamento(idDepartamento, persona, gestorPersonas)) {
                alert('Miembro agregado al departamento.');
                mostrarDepartamentos(); 
                formAgregarMiembroDepto.reset();
            } else {
                alert('No se pudo agregar el miembro (puede que ya exista en el departamento).');
            }
        });
    }

    // --- Carga Inicial de Datos y Visualización ---
    // Asegúrate que gestorPersonas y gestorProyectos estén disponibles y poblados.
    // Si se inicializan en otro archivo (ej. control.js), ya deberían estar listos.
    // Si necesitas cargar datos de ejemplo aquí, hazlo antes de llamar a estas funciones.
    
    if (typeof gestorProyectos !== 'undefined' && typeof gestorPersonas !== 'undefined') {
        cargarProyectosEnSelect();
        cargarDepartamentosEnSelect(); 
        cargarPersonasEnSelectMiembros();
        mostrarDepartamentos();
    } else {
        console.error("Los gestores de personas y/o proyectos no están definidos globalmente. La UI de departamentos no funcionará completamente.");
    }
});