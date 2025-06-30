├── .env                 # Variables de entorno (¡NO SUBIR A GIT!)
├── app.js               # Archivo principal de la aplicación Express
├── package.json         # Dependencias del proyecto
├── package-lock.json    # Bloqueo de versiones de dependencias
├── README.md            # Documentación del proyecto
├── .gitignore           # Archivos y carpetas a ignorar por Git
└── src/                 # Código fuente del backend (protegido, no accesible directamente desde el navegador)
    ├── config/          # Configuraciones de la aplicación
    │   ├── db.js            # Conexión y configuración de la base de datos (MongoDB)
    │   ├── passport.js      # Estrategias de autenticación (JWT, Local, etc.)
    │   ├── email.js         # Configuración del servicio de envío de correos (Nodemailer)
    │   ├── digitalSignature.js # Configuración de claves o proveedores para firma digital (si aplica)
    │   └── storage.js       # Configuración de almacenamiento de archivos (ej. Multer, Cloud Storage)
    │
    ├── models/              # Definiciones de esquemas de la base de datos (Mongoose)
    │   ├── User.js          # Modelo para Usuarios (incluye roles: admin, propietario, inquilino, empleado)
    │   ├── Property.js      # Modelo para Propiedades
    │   ├── Tenant.js        # Modelo para Inquilinos
    │   ├── Contract.js      # ¡Nuevo Modelo para Contratos! (con referencias a Property, Owner, Tenant, estado de firmas)
    │   ├── Department.js    # Modelo para Departamentos
    │   ├── Task.js          # Modelo para Tareas (referencias a Empleado, Departamento)
    │   ├── Payment.js       # Modelo para Pagos
    │   └── ...              # Otros modelos que puedas necesitar
    │
    ├── controllers/         # Lógica de negocio principal para manejar las peticiones HTTP
    │   ├── authController.js       # Registro, login, logout, verificación, reseteo de contraseña
    │   ├── adminController.js      # Lógica CRUD específica para Admin (ej. gestión de usuarios globales)
    │   ├── ownerController.js      # Lógica CRUD específica para Propietarios (sus propiedades, sus inquilinos)
    │   ├── tenantController.js     # Lógica específica para Inquilinos (ver propiedades disponibles, historial, etc.)
    │   ├── employeeController.js   # Lógica específica para Empleados (sus tareas, etc.)
    │   ├── propertyController.js   # CRUD general de propiedades (usado por Admin/Owner)
    │   ├── contractController.js   # ¡Nuevo! Lógica para crear, actualizar estado y gestionar firmas de contratos
    │   ├── departmentController.js # CRUD de departamentos
    │   ├── taskController.js       # CRUD de tareas
    │   ├── paymentController.js    # CRUD de pagos
    │   └── ...                     # Otros controladores si hay más entidades CRUD
    │
    ├── services/            # Lógica de negocio reutilizable, interactúa con modelos y servicios externos
    │   ├── authService.js          # Servicios de autenticación (creación de usuarios, validación)
    │   ├── userService.js          # CRUD de usuarios (si es diferente al de autenticación)
    │   ├── propertyService.js      # Lógica compleja de propiedades (ej. buscar propiedades con criterios avanzados)
    │   ├── tenantService.js        # Lógica compleja de inquilinos
    │   ├── contractService.js      # ¡Nuevo! Lógica para la creación, envío y gestión de estados de contratos, interacción con firma digital
    │   ├── departmentService.js
    │   ├── taskService.js
    │   ├── paymentService.js
    │   ├── emailService.js         # Envío de correos (verificación, tokens de firma)
    │   ├── tokenService.js         # Generación y validación de tokens (para email, firma)
    │   ├── digitalSignatureService.js # ¡Nuevo! Lógica para procesar la firma digital (validación, incrustación en PDF)
    │   ├── pdfGeneratorService.js  # ¡Nuevo! Generación de PDFs de contratos
    │   └── ...
    │
    ├── routes/              # Definición de rutas (API y vistas)
    │   ├── api/                 # Rutas de la API REST (para que el frontend interactúe)
    │   │   ├── authApiRoutes.js       # API de autenticación (login, register, etc.)
    │   │   ├── propertiesApiRoutes.js # CRUD API para propiedades
    │   │   ├── tenantsApiRoutes.js    # CRUD API para inquilinos
    │   │   ├── contractsApiRoutes.js  # ¡Nuevo! API para contratos (crear, obtener, actualizar estado de firma)
    │   │   ├── departmentsApiRoutes.js
    │   │   ├── tasksApiRoutes.js
    │   │   ├── usersApiRoutes.js
    │   │   └── ...
    │   │
    │   ├── views/               # Rutas que renderizan las vistas Pug
    │   │   ├── authViewRoutes.js      # Vistas de login, registro, etc.
    │   │   ├── adminViewRoutes.js     # Vistas del panel de administración
    │   │   ├── ownerViewRoutes.js     # Vistas del panel de propietario
    │   │   ├── tenantViewRoutes.js    # Vistas del panel de inquilino (solo lectura, contacto)
    │   │   ├── employeeViewRoutes.js  # Vistas del panel de empleado
    │   │   ├── contractViewRoutes.js  # ¡Nuevo! Vistas específicas para la firma de contratos (ej. /sign-contract/:token)
    │   │   └── indexViewRoutes.js     # Rutas de la página principal
    │   │
    ├── middlewares/         # Funciones que se ejecutan antes de los controladores
    │   ├── authMiddleware.js    # Verificación de autenticación y autorización por rol
    │   ├── errorHandler.js      # Manejo centralizado de errores
    │   ├── uploadMiddleware.js  # Para manejar subida de archivos (Multer)
    │   └── ...
    │
    ├── utils/               # Funciones auxiliares generales
    │   ├── generateToken.js     # Generador de tokens (para verificación, firma)
    │   ├── validators.js        # Funciones de validación de datos
    │   └── ...
    │
    └── views/               # Archivos de plantillas Pug (renderizados por Express)
        ├── layouts/         # Plantillas base
        │   ├── layoutAdmin.pug
        │   ├── layoutLogin.pug
        │   ├── layoutPublic.pug # Para páginas de acceso público (landing, contacto)
        │   └── ...
        │
        ├── admin/           # Vistas específicas del panel de administración
        │   ├── adminDashboard.pug
        │   ├── userManagement.pug # Gestión de usuarios
        │   ├── departmentManagement.pug # Gestión de departamentos
        │   ├── contractsOverview.pug # ¡Nuevo! Vista general de contratos para admin
        │   └── ...
        │
        ├── propietario/     # Vistas específicas del panel de propietario
        │   ├── ownerDashboard.pug # Tu dashboard actual con tabs de Propiedades e Inquilinos
        │   ├── propertyDetails.pug # Para ver detalles de una propiedad
        │   ├── contractListOwner.pug # ¡Nuevo! Listado de contratos para el propietario
        │   ├── contractSignPage.pug # ¡Nuevo! Página para que el propietario firme
        │   └── ...
        │
        ├── inquilino/       # Vistas específicas del panel de inquilino
        │   ├── tenantDashboard.pug      # Dashboard del inquilino
        │   ├── availableProperties.pug  # Vista de propiedades disponibles para alquiler
        │   ├── tenantContractList.pug   # ¡Nuevo! Listado de contratos para el inquilino
        │   ├── tenantContractSignPage.pug # ¡Nuevo! Página para que el inquilino firme
        │   ├── contactOwnerForm.pug     # Formulario de contacto
        │   └── ...
        │
        ├── empleado/        # Vistas específicas del panel de empleado
        │   ├── employeeDashboard.pug
        │   ├── assignedTasks.pug # Tareas asignadas
        │   ├── departmentTasks.pug # Tareas por departamento
        │   └── ...
        │
        ├── auth/            # Vistas de autenticación
        │   ├── login.pug
        │   ├── register.pug
        │   ├── verifyEmail.pug
        │   ├── resetPassword.pug
        │   └── ...
        │
        └── shared/          # Componentes Pug reutilizables (mixins, includes)
            ├── forms/
            │   ├── propertyForm.pug
            │   ├── tenantForm.pug
            │   ├── contractForm.pug # ¡Nuevo! Formulario para crear contrato
            │   └── ...
            ├── tables/
            │   ├── propertiesTable.pug
            │   ├── tenantsTable.pug
            │   ├── contractsTable.pug # ¡Nuevo! Tabla de contratos
            │   └── ...
            └── modals/
                ├── confirmModal.pug
                └── ...
Explicación de la Lógica por Perfil y Contenido
Perfiles Protegidos (Admin, Empleado, Propietario)
Para estos perfiles, toda la lógica de negocio y acceso a la base de datos reside en la carpeta src/. Los archivos JavaScript que se ejecuten en el navegador (en public/js) solo contendrán lógica de interfaz de usuario, manipulación del DOM, y llamadas a las rutas de tu API REST (src/routes/api/).

src/controllers: Cada perfil tendrá su propio controlador (ej. adminController.js, ownerController.js) para manejar las peticiones que llegan a sus dashboards y las acciones específicas de su rol.

src/services: La lógica de negocio más compleja y reutilizable se ubica aquí. Por ejemplo, propertyService.js contendrá la lógica de cómo se crean, editan o borran propiedades, y será utilizado por adminController.js y ownerController.js.

src/routes/api: Aquí defines los endpoints a los que el JavaScript del frontend hará peticiones. Por ejemplo, propertiesApiRoutes.js tendrá /api/properties para GET, POST, PUT, DELETE. Estos endpoints estarán protegidos por authMiddleware.js para asegurar que solo los usuarios autorizados (ej. admin o propietario) puedan acceder.

src/routes/views: Estas rutas solo renderizan los archivos .pug correspondientes a cada dashboard o vista específica del rol.

public/js/admin/adminDashboard.js: Contendría el JS para la interacción del adminDashboard.pug, pero las peticiones de datos las haría a /api/properties, /api/users, etc., sin saber cómo se manejan esos datos en el backend.

public/js/propietario/ownerDashboard.js: Similar, JS para el ownerDashboard.pug, interactuando con /api/properties (pero solo para las propiedades del propietario logueado, lo que se controlaría en el backend).

Inquilino (Vista y Contratos Protegidos)
El inquilino tendrá una lógica dividida:

Vistas de Propiedades Disponibles (inquilino/availableProperties.pug):

Esta vista mostrará propiedades que estén disponibles para alquiler. La información de las propiedades se obtendría a través de una ruta API específica para inquilinos (ej. api/properties/available) que no expondría datos sensibles.

El JavaScript asociado (ej. public/js/inquilino/availableProperties.js) se enfocaría en cargar esas propiedades, aplicar filtros de búsqueda y mostrar un formulario de contacto para el administrador o propietario.

Contratos y Diálogos Protegidos (inquilino/tenantContractList.pug, inquilino/tenantContractSignPage.pug):

Estas secciones deben estar protegidas por autenticación y autorización. Un inquilino solo puede ver y firmar sus propios contratos.

La lógica para la firma digital, como mencionamos, es principalmente backend. El frontend (public/js/inquilino/contractSign.js) solo manejaría la interfaz del canvas para dibujar la firma y enviar los datos de la firma al backend (a src/routes/api/contractsApiRoutes.js).

El backend (src/controllers/contractController.js y src/services/digitalSignatureService.js) se encargaría de la validación, seguridad y almacenamiento de la firma.

Empleados (Tareas Asignadas por Departamento)
src/models/Task.js: Tendrá campos para el empleado asignado, el departamento, la descripción de la tarea, el estado, etc.

src/controllers/taskController.js: Manejará la lógica para crear, asignar, actualizar y listar tareas.

src/routes/api/tasksApiRoutes.js: Endpoints para que el frontend del empleado interactúe con sus tareas.

public/js/empleado/employeeTasks.js: JavaScript que cargará las tareas asignadas al empleado (desde el backend) y permitirá interactuar con ellas (marcar como completada, etc.). La lógica de asignación y filtrado por departamento la manejará el backend.