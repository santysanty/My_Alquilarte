// public/js/admin/USERMANAGEMENT.JS
// Gestión de usuarios en el frontend (CRUD)

export function initializeUserManagement() {
    console.log('USERMANAGEMENT.JS: ---> Inicializando gestión de usuarios...');

    // --- Selectores del DOM ---
    const userCounter = document.getElementById('userCounter');
    const searchUsersInput = document.getElementById('searchUsersInput');
    const addUserBtn = document.getElementById('addUserBtn');
    const userFormCollapse = document.getElementById('userFormCollapse');
    const userForm = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('roleSelect');
    const functionSelect = document.getElementById('function'); // Ahora es un SELECT
    const isVerifiedInput = document.getElementById('isVerified');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const dniInput = document.getElementById('dni');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const cancelUserEditBtn = document.getElementById('cancelUserEditBtn');
    const usersTableBody = document.getElementById('usersTableBody');
    const filterRoleButtons = document.querySelectorAll('.d-flex.gap-2.mb-3.flex-wrap button');

    // Selectores para el nuevo modal de detalles
    const modal = document.getElementById('userDetailModal');
    const modalTitle = document.getElementById('userDetailModalLabel');
    const modalContent = document.getElementById('modalUserContent');
    const closeModalBtn = document.getElementById('closeUserModalBtn');

    // Selector para mensajes de la aplicación (en lugar de alert)
    const appMessagesContainer = document.getElementById('appMessages');
    if (!appMessagesContainer) {
        console.warn('USERMANAGEMENT.JS: Contenedor de mensajes de la aplicación (#appMessages) no encontrado. Los mensajes no se mostrarán.');
    }

    console.log('USERMANAGEMENT.JS: Elementos del DOM seleccionados.');

    // Instancia de Bootstrap Collapse (para el formulario)
    let userFormCollapseInstance = null;
    if (userFormCollapse && typeof window.bootstrap !== 'undefined' && typeof window.bootstrap.Collapse !== 'undefined') {
        userFormCollapseInstance = new window.bootstrap.Collapse(userFormCollapse, { toggle: false });
        console.log('USERMANAGEMENT.JS: Instancia de Bootstrap Collapse para el formulario de usuario creada.');
    } else if (userFormCollapse) {
        userFormCollapse.style.display = 'none';
        console.warn('USERMANAGEMENT.JS: Elemento userFormCollapse o Bootstrap JS no disponible. El formulario se manejará con display CSS.');
    }

    // Instancia de Bootstrap Modal (para el modal de detalles)
    let userDetailModalInstance = null;
    if (modal && typeof window.bootstrap !== 'undefined' && typeof window.bootstrap.Modal !== 'undefined') {
        userDetailModalInstance = window.bootstrap.Modal.getOrCreateInstance(modal);
        console.log('USERMANAGEMENT.JS: Instancia de Bootstrap Modal para detalles de usuario creada.');
    } else {
        console.warn('USERMANAGEMENT.JS: Elemento modal de detalles de usuario o Bootstrap JS no disponible. El modal se manejará con display CSS.');
    }

    // --- Funciones Auxiliares ---

    // Función para mostrar mensajes de la aplicación (sustituye a alert())
    function showAppMessage(message, type = 'success', duration = 5000) {
        if (!appMessagesContainer) {
            console.log(`Mensaje: ${message} (Tipo: ${type}, Contenedor de mensajes no encontrado)`);
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} alert-dismissible fade show`;
        messageDiv.setAttribute('role', 'alert');
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        appMessagesContainer.appendChild(messageDiv);

        setTimeout(() => {
            const bsAlert = window.bootstrap?.Alert.getInstance(messageDiv);
            if (bsAlert) {
                bsAlert.close();
            } else {
                messageDiv.remove();
            }
        }, duration);
    }

    // Función de confirmación custom (sustituye a window.confirm para evitar 'Illegal invocation')
    function customConfirm(message) {
        console.warn(`USERMANAGEMENT.JS: Confirmación requerida: "${message}". Asumiendo 'true' para continuar la depuración.`);
        return true; 
    }

    function resetUserForm() {
        console.log('USERMANAGEMENT.JS: Reseteando formulario de usuario.');
        if (userForm) userForm.reset();
        if (userIdInput) userIdInput.value = '';
        if (passwordInput) passwordInput.placeholder = "Dejar vacío para no cambiar";
        if (roleSelect) roleSelect.value = '';
        if (isVerifiedInput) isVerifiedInput.checked = false;
        toggleFunctionFieldVisibility(roleSelect.value); // Asegurar que la visibilidad inicial sea correcta
    }

    // Alterna la visibilidad y obligatoriedad del campo "Función"
    // y puebla el select si el rol es 'empleado'
    async function toggleFunctionFieldVisibility(role) {
        const functionFieldContainer = functionSelect ? functionSelect.closest('.mb-3') : null;
        if (functionFieldContainer) {
            if (role === 'empleado') {
                functionFieldContainer.style.display = 'block';
                if (functionSelect) {
                    functionSelect.required = true;
                    await loadFunctionsIntoSelect(); // <--- ¡Cargar funciones desde la API!
                }
            } else {
                functionFieldContainer.style.display = 'none';
                if (functionSelect) {
                    functionSelect.value = '';
                    functionSelect.required = false;
                }
            }
        }
    }

    // Cargar funciones desde la API de Funciones y poblar el select
    async function loadFunctionsIntoSelect() {
        if (!functionSelect) {
            console.warn('USERMANAGEMENT.JS: Elemento #function (select) no encontrado para cargar funciones.');
            return;
        }

        try {
            console.log('USERMANAGEMENT.JS: Realizando fetch a /api/admin/functions para cargar funciones...');
            const response = await fetch('/api/admin/functions'); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar funciones.');
            }
            const functions = await response.json();
            console.log('USERMANAGEMENT.JS: Funciones recibidas del API:', functions);

            // Limpiar opciones existentes (excepto la primera "Seleccione una función")
            functionSelect.innerHTML = '<option value="">Seleccione una función</option>';

            functions.forEach(func => {
                const option = document.createElement('option');
                option.value = func._id; // <--- ¡Guardar el _id de la función!
                option.textContent = func.name; // Mostrar el nombre de la función
                functionSelect.appendChild(option);
            });
            console.log('USERMANAGEMENT.JS: Select de funciones poblado desde la API.');

        } catch (error) {
            console.error('USERMANAGEMENT.JS: Error al cargar funciones para el select:', error);
            showAppMessage(`Error al cargar funciones: ${error.message}`, 'danger');
        }
    }


    function renderUsersTable(users) {
        console.log(`USERMANAGEMENT.JS: Intentando renderizar ${users.length} usuarios.`);
        if (!usersTableBody) {
            console.warn('USERMANAGEMENT.JS: Elemento #usersTableBody no encontrado. No se puede renderizar la tabla.');
            return;
        }

        usersTableBody.innerHTML = '';
        if (users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se encontraron usuarios.</td></tr>';
            if (userCounter) userCounter.textContent = '0 registrados';
            return;
        }

        users.forEach(user => {
            const firstName = user.personalData?.firstName?.trim() || '';
            const lastName = user.personalData?.lastName?.trim() || '';
            
            // Log para diagnosticar si personalData llega vacío desde el backend
            console.log(`USERMANAGEMENT.JS: User ${user.username}, personalData:`, user.personalData);
            console.log(`USERMANAGEMENT.JS: firstName: "${firstName}", lastName: "${lastName}"`);

            let fullName = '';
            if (lastName && firstName) {
                fullName = `${lastName} ${firstName}`; // Apellido Nombre
            } else if (lastName) {
                fullName = lastName;
            } else if (firstName) {
                fullName = firstName;
            } else {
                fullName = user.username; // Fallback si no hay datos personales
            }
            fullName = fullName.trim(); 

            // Obtener el nombre de la función si está populada
            const functionName = user.function ? user.function.name : 'N/A'; // <--- ¡Acceder a user.function.name!

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.role || ''}</td>
                <td>${fullName || ''}</td>
                <td>
                    <button class="btn btn-sm btn-success view-btn" data-id="${user._id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${user._id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${user._id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>`;
            usersTableBody.appendChild(row);
        });
        if (userCounter) userCounter.textContent = `${users.length} registrados`;
    }

    async function loadUsers(roleFilter = '', searchTerm = '') {
        console.log(`USERMANAGEMENT.JS: ---> loadUsers() ejecutado. Rol: "${roleFilter}", Búsqueda: "${searchTerm}".`);
        if (usersTableBody) {
            usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Cargando usuarios...</td></tr>';
        }

        let url = `/api/admin/users`;
        const params = new URLSearchParams();
        if (roleFilter) params.append('role', roleFilter);
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (params.toString()) url += `?${params.toString()}`;

        try {
            console.log('USERMANAGEMENT.JS: Realizando fetch a:', url);
            const res = await fetch(url);
            if (!res.ok) throw new Error((await res.json()).message || 'Error al cargar usuarios');
            const data = await res.json();
            console.log('USERMANAGEMENT.JS: Usuarios recibidos del API:', data);
            renderUsersTable(data);
        } catch (err) {
            console.error('USERMANAGEMENT.JS: Error al cargar usuarios:', err);
            if (usersTableBody) {
                usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar usuarios: ${err.message}</td></tr>`;
            }
            if (userCounter) userCounter.textContent = 'Error';
            showAppMessage(`Error al cargar usuarios: ${err.message}`, 'danger');
        }
    }

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            console.log('USERMANAGEMENT.JS: Botón "Agregar Usuario" clicado.');
            resetUserForm();
            toggleFunctionFieldVisibility(roleSelect.value); // Asegurar que la visibilidad inicial sea correcta
            userFormCollapseInstance?.show();
            if (!userFormCollapseInstance && userFormCollapse) userFormCollapse.style.display = 'block';
        });
    }

    if (cancelUserEditBtn) {
        cancelUserEditBtn.addEventListener('click', () => {
            console.log('USERMANAGEMENT.JS: Botón "Cancelar" clicado.');
            resetUserForm();
            userFormCollapseInstance?.hide();
            if (!userFormCollapseInstance && userFormCollapse) userFormCollapse.style.display = 'none';
        });
    }

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('USERMANAGEMENT.JS: Formulario de usuario enviado.');

            const id = userIdInput.value;
            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/admin/users/${id}` : '/api/admin/users';

            const userData = {
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                role: roleSelect.value,
                // Si el rol es 'empleado', envía el _id de la función seleccionada. De lo contrario, envía null.
                function: roleSelect.value === 'empleado' && functionSelect.value ? functionSelect.value : null, // <--- ¡Enviar el _id!
                isVerified: isVerifiedInput.checked,
                personalData: {
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim(),
                    dni: dniInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    address: addressInput.value.trim(),
                }
            };

            const isPersonalDataEmpty = Object.values(userData.personalData).every(val => !val);
            if (isPersonalDataEmpty) userData.personalData = {};

            if (method === 'PUT' && !userData.password) delete userData.password;
            if (method === 'POST' && !userData.password) {
                showAppMessage('La contraseña es obligatoria para nuevos usuarios.', 'warning');
                return;
            }

            try {
                console.log('USERMANAGEMENT.JS: Enviando datos de usuario:', userData);
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Error al guardar usuario');
                
                console.log('USERMANAGEMENT.JS: Operación exitosa:', data.message);
                resetUserForm();
                userFormCollapseInstance?.hide();
                if (!userFormCollapseInstance && userFormCollapse) userFormCollapse.style.display = 'none';
                loadUsers();
                showAppMessage(data.message, 'success');
            } catch (err) {
                console.error('USERMANAGEMENT.JS: Error al guardar usuario:', err);
                showAppMessage(`Error al guardar usuario: ${err.message}`, 'danger');
            }
        });
    }

    if (usersTableBody) {
        usersTableBody.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            const viewBtn = e.target.closest('.view-btn');

            if (editBtn) {
                const id = editBtn.dataset.id;
                console.log('USERMANAGEMENT.JS: Botón Editar clicado para ID:', id);
                try {
                    const res = await fetch(`/api/admin/users/${id}`);
                    if (!res.ok) throw new Error((await res.json()).message || 'Error al obtener usuario');
                    const user = await res.json();
                    console.log('USERMANAGEMENT.JS: Usuario recibido para edición:', user);

                    userIdInput.value = user._id;
                    usernameInput.value = user.username || '';
                    emailInput.value = user.email || '';
                    passwordInput.value = '';
                    passwordInput.placeholder = 'Dejar vacío para no cambiar';
                    roleSelect.value = user.role || '';
                    // Si el usuario tiene una función, selecciona su _id en el select
                    functionSelect.value = user.function?._id || ''; // <--- ¡Seleccionar por _id!
                    isVerifiedInput.checked = user.isVerified || false;

                    // Rellenar personalData
                    firstNameInput.value = user.personalData?.firstName || '';
                    lastNameInput.value = user.personalData?.lastName || '';
                    dniInput.value = user.personalData?.dni || '';
                    phoneInput.value = user.personalData?.phone || '';
                    addressInput.value = user.personalData?.address || '';

                    toggleFunctionFieldVisibility(user.role); // Ajustar visibilidad y poblar opciones si es empleado
                    userFormCollapseInstance?.show();
                    if (!userFormCollapseInstance && userFormCollapse) userFormCollapse.style.display = 'block';
                } catch (err) {
                    console.error('USERMANAGEMENT.JS: Error al editar usuario:', err);
                    showAppMessage(`Error al cargar datos del usuario: ${err.message}`, 'danger');
                }
            }

            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                console.log('USERMANAGEMENT.JS: Botón Eliminar clicado para ID:', id);
                if (customConfirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                    try {
                        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || 'Error al eliminar usuario');
                        
                        console.log('USERMANAGEMENT.JS: Usuario eliminado:', data.message);
                        loadUsers();
                        showAppMessage(data.message, 'success');
                    } catch (err) {
                        console.error('USERMANAGEMENT.JS: Error al eliminar usuario:', err);
                        showAppMessage(`Error al eliminar usuario: ${err.message}`, 'danger');
                    }
                }
            }

            if (viewBtn) {
                const id = viewBtn.dataset.id;
                console.log('USERMANAGEMENT.JS: Botón Ver Detalles clicado para ID:', id);
                try {
                    const res = await fetch(`/api/admin/users/${id}`);
                    if (!res.ok) throw new Error((await res.json()).message || 'Error al obtener usuario para detalles');
                    const user = await res.json();
                    console.log('USERMANAGEMENT.JS: Usuario recibido para detalles:', user);
                    showUserDetails(user);
                } catch (err) {
                    console.error('USERMANAGEMENT.JS: Error al ver detalles del usuario:', err);
                    showAppMessage(`Error: ${err.message}`, 'danger');
                }
            }
        });
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
            console.log('USERMANAGEMENT.JS: Rol cambiado a:', e.target.value);
            toggleFunctionFieldVisibility(e.target.value);
        });
    }

    if (filterRoleButtons) {
        filterRoleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const role = btn.dataset.role;
                console.log('USERMANAGEMENT.JS: Botón de filtro de rol clicado:', role || 'Todos');
                filterRoleButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadUsers(role, searchUsersInput.value);
            });
        });
    }

    let searchTimeout;
    if (searchUsersInput) {
        searchUsersInput.addEventListener('input', () => {
            console.log('USERMANAGEMENT.JS: Input de búsqueda de usuario:', searchUsersInput.value);
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const activeRoleButton = document.querySelector('.d-flex.gap-2.mb-3.flex-wrap button.active');
                const role = activeRoleButton?.dataset.role || '';
                loadUsers(role, searchUsersInput.value);
            }, 300);
        });
    }

    // Mostrar modal de detalles
    function showUserDetails(user) {
        if (!modal || !modalContent) {
            console.warn('USERMANAGEMENT.JS: Elementos del modal no encontrados. No se puede mostrar el modal de detalles.');
            return;
        }

        const currentModalInstance = typeof window.bootstrap !== 'undefined' && typeof window.bootstrap.Modal !== 'undefined'
            ? window.bootstrap.Modal.getOrCreateInstance(modal)
            : null;

        if (!currentModalInstance) {
            console.warn('USERMANAGEMENT.JS: Instancia de Bootstrap Modal no creada. El modal se manejará con display CSS.');
            modal.style.display = 'flex';
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
            modal.classList.add('show');
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        }
        
        if (modalTitle) modalTitle.textContent = `Detalles de ${user.username}`;

        const firstName = user.personalData?.firstName?.trim() || '';
        const lastName = user.personalData?.lastName?.trim() || '';
        let fullName = '';
        if (lastName && firstName) {
            fullName = `${lastName} ${firstName}`;
        } else if (lastName) {
            fullName = lastName;
        } else if (firstName) {
            fullName = firstName;
        } else {
            fullName = user.username;
        }
        fullName = fullName.trim();

        // Obtener el nombre de la función si está populada
        const functionName = user.function ? user.function.name : 'N/A';


        modalContent.innerHTML = `
            <p><strong>ID:</strong> ${user._id || 'N/A'}</p>
            <p><strong>Usuario:</strong> ${user.username || 'N/A'}</p>
            <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
            <p><strong>Rol:</strong> ${user.role || 'N/A'}</p>
            <p><strong>Verificado:</strong> ${user.isVerified ? 'Sí' : 'No'}</p>
            ${fullName ? `<p><strong>Nombre Completo:</strong> ${fullName}</p>` : ''}
            ${user.personalData?.dni ? `<p><strong>DNI:</strong> ${user.personalData.dni}</p>` : ''}
            ${user.personalData?.phone ? `<p><strong>Teléfono:</strong> ${user.personalData.phone}</p>` : ''}
            ${user.personalData?.address ? `<p><strong>Dirección:</strong> ${user.personalData.address}</p>` : ''}
            ${user.role === 'empleado' && functionName !== 'N/A' ? `<p><strong>Función:</strong> ${functionName}</p>` : ''}
            <p><strong>Registrado el:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        `;

        if (currentModalInstance) {
            currentModalInstance.show();
        }
    }

    // Cerrar modal
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            const currentModalInstance = typeof window.bootstrap !== 'undefined' && typeof window.bootstrap.Modal !== 'undefined'
                ? window.bootstrap.Modal.getInstance(modal)
                : null;
            if (currentModalInstance) {
                currentModalInstance.hide();
            } else {
                modal.style.display = 'none';
                modal.removeAttribute('aria-modal');
                modal.removeAttribute('role');
                modal.classList.remove('show');
                modal.style.backgroundColor = '';
            }
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const currentModalInstance = typeof window.bootstrap !== 'undefined' && typeof window.bootstrap.Modal !== 'undefined'
                    ? window.bootstrap.Modal.getInstance(modal)
                    : null;
                if (currentModalInstance) {
                    currentModalInstance.hide();
                } else {
                    modal.style.display = 'none';
                    modal.removeAttribute('aria-modal');
                    modal.removeAttribute('role');
                    modal.classList.remove('show');
                    modal.style.backgroundColor = '';
                }
            }
        });
    }

    // Escuchar el cambio en el selector de rol (PARA CARGAR FUNCIONES)
    if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
            console.log('USERMANAGEMENT.JS: Rol cambiado a:', e.target.value);
            toggleFunctionFieldVisibility(e.target.value);
        });
    }


    // --- Carga Inicial ---
    console.log('USERMANAGEMENT.JS: ---> Llamando a loadUsers() para carga inicial.');
    loadUsers(); // Carga todos los usuarios al inicializar
    console.log('USERMANAGEMENT.JS: ---> initializeUserManagement() finalizada.');
}
