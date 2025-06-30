// public/js/admin/departmentManagement.js

// No se necesita importar Collapse porque bootstrap.bundle.min.js ya lo hace global.
// Accederemos a ello como window.bootstrap.Collapse.

export function initializeDepartmentManagement() {
    console.log('departmentManagement.js: Inicializando gestión de departamentos...'); // Deberías ver este log

    // Selectores de elementos DOM para Departamentos
    const departmentFormCollapse = document.getElementById('departmentFormCollapse');
    const departmentForm = document.getElementById('departmentForm');
    const addDepartmentBtn = document.getElementById('addDepartmentBtn');
    const departmentIdInput = document.getElementById('departmentId');
    const departmentNameInput = document.getElementById('departmentName');
    const departmentDescriptionInput = document.getElementById('departmentDescription');
    const departmentActiveInput = document.getElementById('departmentActive'); // Referencia correcta
    const cancelDepartmentEditButton = document.getElementById('cancelDepartmentEdit');
    const departmentsTableBody = document.getElementById('departmentsTableBody');
    const departmentCounter = document.getElementById('departmentCounter');
    const searchDepartmentsInput = document.getElementById('searchDepartments');

    // Inicializar Collapse de Bootstrap si el elemento existe
    // CORRECCIÓN FINAL: Usar 'window.bootstrap.Collapse' para acceder al objeto global
    const departmentFormCollapseInstance = departmentFormCollapse ? new window.bootstrap.Collapse(departmentFormCollapse, { toggle: false }) : null;

    // Event Listeners
    if (addDepartmentBtn) {
        addDepartmentBtn.addEventListener('click', () => {
            resetDepartmentForm();
            if (departmentFormCollapseInstance) departmentFormCollapseInstance.toggle();
        });
    }

    if (cancelDepartmentEditButton) {
        cancelDepartmentEditButton.addEventListener('click', () => {
            resetDepartmentForm();
            if (departmentFormCollapseInstance) departmentFormCollapseInstance.hide();
        });
    }

    // Funciones
    function resetDepartmentForm() {
        if (departmentForm) departmentForm.reset();
        // Asegúrate de que esto sea departmentIdInput y NO departmentIdIdInput
        if (departmentIdInput) departmentIdInput.value = '';
        // CORRECCIÓN: Usar la variable correcta departmentActiveInput
        if (departmentActiveInput) departmentActiveInput.checked = true;
    }

    async function loadDepartments(searchTerm = '') {
        console.log('departmentManagement.js: loadDepartments() se ha EJECUTADO. Intentando fetch a /api/admin/departments.');
        try {
            const response = await fetch('/api/admin/departments'); // RUTA DE API
            if (!response.ok) throw new Error((await response.json()).message || 'Error al cargar departamentos');

            let departments = await response.json();

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                departments = departments.filter(dep =>
                    dep.name.toLowerCase().includes(term) ||
                    (dep.description && dep.description.toLowerCase().includes(term))
                );
            }

            renderDepartmentsTable(departments);
        } catch (error) {
            console.error('Error al cargar departamentos:', error);
            if (departmentsTableBody) departmentsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar departamentos: ${error.message}</td></tr>`;
            if (departmentCounter) departmentCounter.textContent = 'Error';
        }
    }

    function renderDepartmentsTable(departments) {
        if (!departmentsTableBody) return;

        departmentsTableBody.innerHTML = '';
        if (departments.length === 0) {
            departmentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay departamentos registrados.</td></tr>';
            if (departmentCounter) departmentCounter.textContent = '0 registrados';
            return;
        }

        departments.forEach(department => {
            const row = departmentsTableBody.insertRow();
            row.innerHTML = `
                <td>${department._id}</td>
                <td>${department.name}</td>
                <td>${department.description || ''}</td>
                <td>${department.isActive ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${department._id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${department._id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
            `;
        });

        if (departmentCounter) departmentCounter.textContent = `${departments.length} registrados`;
    }

    if (departmentForm) {
        departmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = departmentIdInput ? departmentIdInput.value : '';
            const name = departmentNameInput ? departmentNameInput.value.trim() : '';
            const description = departmentDescriptionInput ? departmentDescriptionInput.value.trim() : '';
            const isActive = departmentActiveInput ? departmentActiveInput.checked : false;

            if (!name) {
                alert('El nombre del departamento es obligatorio.');
                return;
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/admin/departments/${id}` : '/api/admin/departments'; // RUTA DE API

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description, isActive })
                });

                if (!response.ok) throw new Error((await response.json()).message || `Error al ${id ? 'actualizar' : 'crear'} departamento`);

                resetDepartmentForm();
                if (departmentFormCollapseInstance) departmentFormCollapseInstance.hide();
                loadDepartments();

            } catch (error) {
                console.error(`Error al ${id ? 'actualizar' : 'crear'} departamento:`, error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    if (departmentsTableBody) {
        departmentsTableBody.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');

            if (editBtn) {
                const id = editBtn.dataset.id;
                try {
                    const response = await fetch(`/api/admin/departments/${id}`); // RUTA DE API
                    if (!response.ok) throw new Error((await response.json()).message || 'Error al obtener departamento');

                    const department = await response.json();

                    if (departmentIdInput) departmentIdInput.value = department._id;
                    if (departmentNameInput) departmentNameInput.value = department.name;
                    if (departmentDescriptionInput) departmentDescriptionInput.value = department.description || '';
                    if (departmentActiveInput) departmentActiveInput.checked = department.isActive;

                    if (departmentFormCollapseInstance) departmentFormCollapseInstance.show();
                } catch (error) {
                    console.error('Error al editar departamento:', error);
                    alert(`Error al cargar datos: ${error.message}`);
                }
            }

            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
                    try {
                        const response = await fetch(`/api/admin/departments/${id}`, { method: 'DELETE' }); // RUTA DE API
                        if (!response.ok) throw new Error((await response.json()).message || 'Error al eliminar departamento');
                        loadDepartments();
                    } catch (error) {
                        console.error('Error al eliminar departamento:', error);
                        alert(`Error: ${error.message}`);
                    }
                }
            }
        });
    }

    let searchTimeout;
    if (searchDepartmentsInput) {
        searchDepartmentsInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadDepartments(searchDepartmentsInput.value);
            }, 300);
        });
    }

    // Carga inicial de departamentos
    loadDepartments();
}