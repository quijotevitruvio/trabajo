# Sistema de Gestión de Personas

Este proyecto es una aplicación web para la gestión de personas, departamentos y proyectos, desarrollada utilizando JavaScript orientado a objetos. La aplicación permite crear, editar, eliminar y visualizar información de personas en un entorno web interactivo.

## Estructura del Proyecto

El proyecto está organizado en los siguientes archivos:

### Archivos HTML y CSS
- `index.html`: Contiene la estructura de la interfaz de usuario con formularios para gestionar personas.
- `css/styles.css`: Define los estilos visuales de la aplicación.

### Archivos JavaScript
- `js/persona.js`: Define la clase `Persona` con sus atributos y métodos.
- `js/GestorPersonas.js`: Implementa la clase `GestorPersonas` para manejar colecciones de personas.
- `js/Departamento.js`: Define la clase `Departamento` y su relación con las personas.
- `js/Proyecto.js`: Implementa la clase `Proyecto` y su relación muchos a muchos con personas.
- `js/control.js`: Contiene la lógica de control y manipulación del DOM.

## Funcionalidades Principales

### Gestión de Personas
- **Crear personas**: Permite registrar nuevas personas con código, nombre, apellido, fecha de nacimiento, género y cargo.
- **Visualizar personas**: Muestra una tabla con todas las personas registradas.
- **Editar personas**: Permite modificar la información de personas existentes.
- **Eliminar personas**: Permite eliminar personas del sistema.

### Características de Programación Orientada a Objetos
- **Encapsulamiento**: Uso de atributos privados con el prefijo `#` en JavaScript.
- **Relaciones entre clases**: 
  - Relación "tiene muchos" entre `Departamento` y `Persona`.
  - Relación muchos a muchos entre `Proyecto` y `Persona`.

## Clases Principales

### Clase Persona
Representa a una persona con sus atributos básicos:
- Código (identificador único)
- Nombre
- Apellido
- Fecha de nacimiento
- Género
- Cargo

Incluye métodos para obtener el nombre completo y calcular la edad.

### Clase GestorPersonas
Maneja una colección de objetos `Persona`:
- Agregar personas
- Eliminar personas
- Buscar personas por código o cargo
- Obtener todas las personas
- Contar personas

### Clase Departamento
Representa un departamento que puede tener múltiples personas:
- Agregar miembros
- Eliminar miembros
- Obtener todos los miembros
- Contar miembros

### Clase Proyecto
Representa un proyecto que puede tener múltiples participantes con diferentes roles:
- Agregar participantes con roles específicos
- Cambiar el rol de un participante
- Eliminar participantes
- Obtener participantes por rol

## Interfaz de Usuario
La interfaz está organizada en pestañas:
- **Ver Personas**: Muestra una tabla con todas las personas registradas.
- **Crear Persona**: Formulario para registrar nuevas personas.
- **Editar Persona**: Permite seleccionar una persona existente y modificar sus datos.

## Cómo Usar
1. Abra el archivo `index.html` en un navegador web.
2. Utilice las pestañas para navegar entre las diferentes funcionalidades.
3. Para crear una persona, vaya a la pestaña "Crear Persona", complete el formulario y haga clic en "Guardar".
4. Para editar o eliminar una persona, puede hacerlo desde la tabla en la pestaña "Ver Personas" o desde la pestaña "Editar Persona".

## Características Técnicas
- Implementación de programación orientada a objetos en JavaScript.
- Uso de características modernas de JavaScript como atributos privados.
- Manipulación dinámica del DOM para actualizar la interfaz de usuario.
- Gestión de eventos para interactuar con los formularios y botones.
- Validación básica de datos en los formularios.

## Datos de Prueba
La aplicación carga automáticamente dos personas de ejemplo para facilitar las pruebas:
- Bryan Ibarra (Desarrollador)
- Gustav Hooker (Diseñador) 