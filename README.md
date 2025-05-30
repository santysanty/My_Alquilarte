# Inmobiliaria "Alquilarte" - Sistema de Gestión Backend



## 1. Introducción al Proyecto

Este repositorio contiene la primera entrega del trabajo integrador de la materia "Desarrollo Web Backend".
 Hemos desarrollado una aplicación web backend para la gestión integral de la inmobiliaria "Alquilarte", 
siguiendo los principios de la modularización, Programación Orientada a Objetos (POO) y utilizando Node.js, 
Express y Pug. Para esta primera fase, los datos se persisten en archivos JSON, simulando una base de datos.

El objetivo principal de este sistema es abordar las problemáticas internas de la inmobiliaria,
 como el registro manual, el control de pagos, la coordinación de visitas y tareas de mantenimiento, 
optimizando así la organización y eficiencia operativa.

## 2. Requisitos de la Primera Entrega

La aplicación ha sido desarrollada para cumplir con los siguientes requisitos funcionales y 
técnicos, conforme a los documentos "NodeJS - Primer Entrega.pdf" y 
"IFST 29 - Caso 1_ Inmobiliaria _Alquilarte_.pdf":

### 2.1. Funcionalidades Mínimas Implementadas (Módulo de Primera Entrega):

CRUD de Tareas:
    * Implementación completa de la creación, lectura, actualización y eliminación de tareas.
    * Tareas organizadas por área (se definen al menos 2 áreas).
    * (Pendiente de implementar) Filtros de búsqueda de tareas por estado, prioridad o fecha.
 Gestión de Usuarios (Login):
    * Sistema de login básico para acceder a diferentes paneles según el rol del usuario (administrador,
       empleado, propietario, inquilino).
    * Los usuarios se almacenan y gestionan en un archivo JSON (`data/usuarios.json`).
 Alta de Empleados:
    * Se ha provisto la estructura y la base para el alta de empleados con asignación de rol y sector, 
      incluyendo la capacidad de subir fotos (gestionado por Multer).

### 2.2. Requisitos Técnicos y Buenas Prácticas Aplicadas:

-Tecnologías Principales:** Node.js y el framework Express.js.
-Base de Datos Provisional:Archivos JSON para la persistencia de datos en esta primera entrega.
-Motor de Plantillas: Pug para la renderización dinámica de las vistas.
-Asincronía:Uso extensivo de `async/await` para el manejo de operaciones asíncronas (ej. lectura/escritura 
            de archivos JSON).
-Modularización y POO:
    * Código altamente modularizado con una estructura de carpetas clara y coherente (`controllers`, 
       `routes`, `models`, `utils`, `views`, `middlewares`).
    * Aplicación de Programación Orientada a Objetos (POO) con clases para las entidades principales 
        del sistema (ej. `Empleado.js`, `Tarea.js`).
    * Separación de responsabilidades clara entre los módulos.
-Rutas: Implementación de rutas dinámicas y uso de middleware (ej. `method-override` 
        para simular métodos HTTP PUT/DELETE en formularios, `multer` para subida de archivos).
-Control de Versiones: Uso de Git y GitHub para la colaboración y el control de versiones del proyecto.
-Pruebas:La aplicación está diseñada para ser probada con herramientas como Thunder Client o Postman 
          para sus rutas API REST.

## 3. Estructura del Proyecto

La arquitectura del proyecto sigue un patrón MVC (Modelo-Vista-Controlador) 
adaptado para una aplicación Node.js, lo que garantiza una clara separación de responsabilidades:
alquilarte-app/
├── public/                 # Archivos estáticos accesibles públicamente (CSS, JS del lado del cliente, imágenes)
│   └── uploads/            # Directorio para subir fotos de empleados (gestionado por Multer)
├── data/                   # Archivos JSON que simulan nuestra base de datos para esta entrega
│   ├── empleados.json      # Datos de los empleados
│   ├── tareas.json         # Datos de las tareas
│   └── usuarios.json       # Datos de los usuarios y sus credenciales para el login
├── src/                    # Código fuente principal de la aplicación
│   ├── controllers/        # Contiene la lógica de negocio. Interactúa con modelos y utilidades, y renderiza vistas.
│   │   ├── authController.js    # Lógica de autenticación (login, logout)
│   │   ├── empleadoController.js # Lógica CRUD para empleados
│   │   ├── indexController.js   # Lógica para rutas generales (inicio, dashboards)
│   │   └── tareaController.js   # Lógica CRUD para tareas
│   ├── middlewares/        # Funciones middleware personalizadas o configuraciones de middleware
│   │   └── multerConfig.js      # Configuración de Multer para subida de archivos
│   ├── models/             # Clases POO que representan las entidades del negocio
│   │   ├── Empleado.js
│   │   └── Tarea.js
│   │   # (Manuel creará Propietario.js e Inquilino.js aquí)
│   ├── routes/             # Define las rutas URL y las asocia a las funciones de los controladores
│   │   ├── authRoutes.js        # Rutas relacionadas con la autenticación
│   │   ├── empleadoRoutes.js    # Rutas para la gestión de empleados
│   │   ├── indexRoutes.js       # Rutas generales y de navegación principal
│   │   └── tareaRoutes.js       # Rutas para la gestión de tareas
│   │   # (Manuel creará propietarioRoutes.js e inquilinoRoutes.js aquí)
│   ├── utils/              # Funciones de utilidad auxiliares
│   │   └── jsonHandler.js       # Funciones para leer y escribir archivos JSON
│   └── app.js              # Punto de entrada de la aplicación. Configura Express y monta todos los routers.
├── views/                  # Plantillas HTML dinámicas utilizando Pug
│   ├── layouts/            # Plantillas base o layouts comunes para las vistas
│   ├── adminDashboard.pug  # Vista del panel de administrador
│   ├── dashboardEmpleado.pug # Vista del panel de empleado
│   ├── empleado.pug        # Vista de detalle de un empleado (ejemplo)
│   ├── error.pug           # Vista para errores 404 (página no encontrada)
│   ├── errorLogin.pug      # Vista para errores de autenticación
│   ├── inicio.pug          # Página de inicio
│   ├── listaEmpleado.pug   # Lista de empleados
│   ├── listaTareas.pug     # Lista de tareas
│   ├── login.pug           # Formulario de login
│   ├── nuevaEmpleado.pug   # Formulario para crear nuevo empleado
│   ├── nuevaTarea.pug      # Formulario para crear nueva tarea
│   # (Manuel y María añadirán más vistas para Inquilinos, Propietarios, etc.)
├── .gitignore              # Archivo que especifica qué archivos/carpetas ignorar en Git (ej. node_modules)
├── package.json            # Metadatos del proyecto y listado de dependencias
├── package-lock.json       # Registra las versiones exactas de las dependencias
└── README.md               # Este archivo de documentación

## 4. Instalación y Ejecución

Para levantar la aplicación en tu entorno local:

1.  Clonar el Repositorio:     Abre tu terminal y ejecuta: bash
    git clone [https://github.com/tu-usuario/nombre-del-repositorio.git]
     (https://github.com/tu-usuario/nombre-del-repositorio.git)     
2.   Instalar Dependencias:Descarga e instala todas las librerías necesarias definidas en `package.json`:
      npm install
3.  Ejecutar la Aplicación: Modo Desarrollo (Recomendado): Utiliza Nodemon para reiniciar automáticamente 
        el servidor cada vez que guardes un cambio en el código
       .npm run dev
       - npm start
4.  Acceder en el Navegador: http://localhost:3000`
5. Roles y Responsabilidades del Equipo
Nuestro equipo está organizado para maximizar la eficiencia y la colaboración, dividiendo las responsabilidades por módulos clave:

5.1. Daniel (Líder del Proyecto):

-Enfoque Principal:Arquitectura base del proyecto, 
  configuración del entorno (Node.js, Express, Pug), modularización inicial, `jsonHandler`, configuración 
   de `multer`, y la implementación completa del **CRUD de Tareas** y el **sistema de Login/Autenticación**. 
   También es responsable de la gestión de Git/GitHub, la estrategia de ramas y la documentación general.
-Módulos/Tareas clave: `app.js`, `utils/jsonHandler.js`, `middlewares/multerConfig.js`, todo el contenido 
  de `src/controllers/tareaController.js`, `src/routes/tareaRoutes.js`, `src/controllers/authController.js`,
    `src/routes/authRoutes.js`, `src/controllers/indexController.js`, `src/routes/indexRoutes.js`, 
     y las vistas Pug asociadas a Login/Tareas/Inicio.

5.2. María( colaboradora 1)

-Enfoque Principal: Desarrollo completo del módulo de Empleados y el Desarrollo completo del modulo de tarea .
-Módulos/Tareas clave: Completar el CRUD de Empleados en `src/controllers/empleadoController.js`
       (si Daniel no lo hizo completo).
-Definir y mapear todas las rutas relacionadas con empleados en `src/routes/empleadoRoutes.js` (ej. crear,
        listar, editar, eliminar, ver detalles de empleado), como asi tambien de los modulos de tarea.y
-Asegurarse de que la subida de fotos de empleados funcione correctamente utilizando `multerConfig.js`.
-Desarrollar las vistas Pug necesarias para el módulo de empleados (`listaEmpleado.pug`, `nuevaEmpleado.pug`,
          `empleado.pug`, `editarEmpleado.pug`) y de tareas.
-Interactuar con `empleados.json` y tareas.json para persistir los datos de empleados.

5.3. Manuel

-Enfoque Principal:Mejoras de la interfaz de usuario.
`  realizar mejoras generales en el layout y la navegación 
  de todas las vistas Pug para una experiencia de usuario consistente.

6. Estrategia de Ramas y Colaboración (Git & GitHub)

Para asegurar un desarrollo ordenado, colaborativo y sin conflictos, utilizaremos la siguiente estrategia de ramas en nuestro repositorio de Git:

-master` (o `main`):
    * Es la rama principal de nuestro proyecto.
    * Contendrá siempre el código más estable y funcional, listo para entrega o despliegue.
    *¡No se debe trabajar directamente sobre `master`! Solo se harán fusiones (merges) a 
     esta rama a través de Pull Requests aprobados.

-Daniel-base-estructural`:
    * Esta rama ha sido creada por Daniel (líder del proyecto) y contiene la estructura inicial de la aplicación, la configuración de Express, los módulos de `utils`, `middlewares`, y la implementación funcional del CRUD de Tareas y el sistema de Login.
    * Es el **punto de partida estable** para que los demás miembros del equipo comiencen su desarrollo.

-feature/<tu-nombre-modulo>` (e.g., `feature/maria-empleados`, `feature/manuel-inquilinos-propietarios`):
    * Cada integrante del equipo creará una nueva rama con un nombre descriptivo para cada funcionalidad
       mayor o módulo en el que trabaje.
    * Estas ramas se crearán a partir de la rama `master` (o `daniel-base-estructural` si `master` 
      aún no incluye esa base).
    * Todo el desarrollo, commits y pruebas individuales se realizarán dentro de estas ramas de `feature`.

6.1. Flujo de Trabajo Sugerido:

1.  Clonar el Repositorio:
    git clone <URL_DEL_REPOSOTORIO>
   
2.  Daniel: Subir la Rama Base: (Esto ya debería estar hecho)
    Daniel se asegura de que la rama `daniel-base-estructural` esté actualizada y subida al repositorio remoto.
    git checkout daniel-base-estructural
    git push -u origin daniel-base-estructural
   
3. Todos: Obtener la Rama Base:
    Antes de empezar a trabajar, asegúrense de tener la rama base.
     git pull origin daniel-base-estructural
 
4.  Crear tu Rama de Feature:
    Cada integrante crea su rama de trabajo a partir de la rama base (`daniel-base-estructural` por ahora, o `master` 
    si ya se fusionó).
     git checkout daniel-base-estructural # Asegúrate de estar en la base
     git pull # Trae los últimos cambios de la base
     git checkout -b feature/tu-nombre-modulo # Crea y cambia a tu nueva rama
    
    *Ejemplo para María: `git checkout -b feature/maria-empleados daniel-base-estructural`
    *Ejemplo para Manuel: `git checkout -b feature/manuel-inquilinos-propietarios daniel-base-estructural`

5. Desarrollar y Realizar Commits:
    Trabaja en tu rama de `feature`. Realiza commits pequeños y frecuentes con mensajes descriptivos.
   # Realiza tus cambios en el código
    git add .
    git commit -m "feat: Implementado formulario de creación de empleados"
    git push origin feature/tu-nombre-modulo # Sube tus cambios a GitHub
   

6.  Mantener tu Rama de Feature Actualizada:
    Regularmente (ej. al inicio de cada día o antes de empezar una nueva tarea), actualiza tu rama de `feature` con los últimos cambios de la rama `daniel-base-estructural` (o `master`) para evitar conflictos grandes.

    git checkout feature/tu-nombre-modulo
    git pull origin daniel-base-estructural --rebase # Recomendado para un historial más limpio
    # Si hay conflictos, resuélvelos y luego `git rebase --continue`
    git push origin feature/tu-nombre-modulo --force # Usa --force solo después de un rebase
    si los commits cambian
   
    *Alternativa a `rebase`:** Si prefieres un historial de merges explícito, usa `git merge
       daniel-base-estructural`.

7.  Crear un Pull Request (PR):**
    Una vez que tu funcionalidad esté completa y probada localmente, sube tu rama a GitHub y crea un Pull Request desde tu rama de `feature` hacia la rama `master`.
    -Descripción del PR:** Detalla los cambios, las funcionalidades implementadas y cualquier instrucción de prueba.
    -Asigna revisores:** Etiqueta a Daniel o a otro compañero para que revise tu código.

8.  **Revisión y Fusión (Merge):
    * Daniel (o el revisor asignado) revisará el código del PR, ofrecerá comentarios y solicitará cambios si es necesario.
    * Una vez que el PR sea aprobado, se fusionará en la rama `master`.

9.  Limpieza de Ramas:
    Después de que tu rama de `feature` haya sido fusionada en `master` y 
    ya no sea necesaria, elimínala (tanto localmente como en GitHub).
  
    git checkout master # Cambia a la rama master
    git pull origin master # Asegúrate de tener la última versión de master
    git branch -d feature/tu-nombre-modulo # Elimina la rama localmente
    git push origin --delete feature/tu-nombre-modulo # Elimina la rama del remoto
    ```

---

## Avances de la Primera Entrega: Módulo de Gestión de Tareas

Esta sección detalla los avances realizados en el proyecto para cumplir con los requisitos de la Primera Entrega, enfocándose en el módulo de Gestión de Tareas.

### **Características Implementadas:**

Hemos completado la implementación del **Módulo de Gestión de Tareas**, cubriendo los siguientes puntos clave de los requisitos:

* **CRUD Completo de Tareas:**
    * **Crear (Create):** Funcionalidad para dar de alta nuevas tareas, incluyendo campos como título, descripción, área, estado, prioridad, fecha y asignación a un empleado (empleadoId).
    * **Leer (Read):** Visualización de todas las tareas existentes en una tabla, con opciones de paginación y ordenamiento (si se implementó).
    * **Actualizar (Update):** Edición de tareas existentes a través de un formulario precargado con los datos actuales.
    * **Eliminar (Delete):** Borrado de tareas individuales de la base de datos.
* **Filtros de Búsqueda Avanzados:**
    * Implementación de filtros para buscar y visualizar tareas por:
        * **Estado** (ej., Pendiente, En Proceso, Finalizada).
        * **Prioridad** (ej., Alta, Media, Baja).
        * **Área** (ej., Ventas, Administración, Contabilidad, Mantenimiento).
        * **Búsqueda general** por título o descripción.
* **Persistencia de Datos en JSON:**
    * Todos los datos de las tareas se almacenan y gestionan a través de archivos `.json` en el servidor, cumpliendo con el requisito de almacenamiento no relacional.
* **Vistas Dinámicas con Pug:**
    * Se han desarrollado las interfaces de usuario para el CRUD de tareas utilizando el motor de plantillas Pug, incluyendo vistas para listar, crear y editar tareas, así como un layout administrativo base.
* **Modularización y Arquitectura:**
    * El código está modularizado siguiendo una estructura clara (controladores, rutas, modelos, utilidades), aplicando principios de Programación Orientada a Objetos (POO) y el patrón MVC (Modelo-Vista-Controlador).
    * Uso de **asincronía con promesas y `async/await`** para operaciones de I/O.
    * Implementación de **rutas dinámicas** y uso de **middleware** (`method-override`) para manejar métodos HTTP avanzados en formularios.

### **Trabajo Pendiente para la Primera Entrega:**

Los siguientes puntos, esenciales para la Primera Entrega, están actualmente **en progreso** o requieren atención:

* **Alta de Empleados con Asignación de Rol y Sector:**
    * Esta funcionalidad (CRUD de Empleados) está siendo desarrollada por el equipo (María). Una vez completa, se integrará con el módulo de tareas para permitir la asignación de tareas a empleados y futuros filtros por empleado.
    * Se asegurará la inclusión de campos para `rol` (administrador, empleado, supervisor) y `sector` para cada empleado.
* **Panel de Administración (Usuarios):**
    * La base para el panel de administración de usuarios (empleados) se construirá una vez que el CRUD de Empleados esté completo.
* **Autenticación y Autorización (Preparación para Segunda Entrega):**
    * Aunque la funcionalidad de sesiones no es obligatoria para esta entrega, se garantizará que la estructura del sistema soporte la futura implementación de acceso restringido por tipo de usuario (`rol`).
    * Los empleados ya tienen un campo `empleadoId` asociado a la tarea, lo que facilita futuras integraciones.

---