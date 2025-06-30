// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('¡El JavaScript de login se está ejecutando en el DOMContentLoaded!');
    const loginForm = document.getElementById('loginForm');
    const errorMessageElement = document.getElementById('errorMessage'); // Asegúrate de tener un elemento para mostrar errores en tu login.pug

    if (loginForm) {
        console.log('Formulario de login encontrado.');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
            console.log('Evento submit del formulario detectado. Prevención del default.');

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            console.log('Email:', email);
            // console.log('Password:', password); // Por seguridad, no loguear la contraseña en producción

            if (errorMessageElement) {
                errorMessageElement.textContent = ''; // Limpiar mensajes de error previos
                errorMessageElement.style.display = 'none';
            }

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' // Indicar al servidor que esperamos JSON
                    },
                    body: JSON.stringify({ email, password })
                });

                console.log('Respuesta de la API recibida. Status:', response.status);

                // IMPORTANTE: Manejar la respuesta como JSON solo si es exitosa o si la API lo indica
                if (response.ok) { // Si la respuesta es 200-299 (éxito)
                    const data = await response.json();
                    console.log('Datos de respuesta (JSON):', data);

                    if (data.success || response.status === 200) { // Si hay una bandera de éxito o el status es 200
                        console.log('Login exitoso. Redirigiendo a:', data.redirectTo);
                        window.location.href = data.redirectTo; // REDIRECCIÓN CONTROLADA POR EL FRONTEND
                    } else {
                        // Aunque response.ok sea true, puede haber un mensaje de error dentro del JSON
                        console.error('Error lógico en la respuesta:', data.message);
                        if (errorMessageElement) {
                            errorMessageElement.textContent = data.message || 'Error desconocido al iniciar sesión.';
                            errorMessageElement.style.display = 'block';
                        }
                    }
                } else {
                    // Si la respuesta no es OK (4xx, 5xx)
                    const errorData = await response.json(); // Intentar parsear como JSON si el servidor envía un error JSON
                    console.error('Error de la API (status ' + response.status + '):', errorData.message);
                    if (errorMessageElement) {
                        errorMessageElement.textContent = errorData.message || 'Error en el servidor. Intenta de nuevo.';
                        errorMessageElement.style.display = 'block';
                    }
                }

            } catch (error) {
                console.error('Error de red o del servidor (catch):', error);
                if (errorMessageElement) {
                    errorMessageElement.textContent = 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.';
                    errorMessageElement.style.display = 'block';
                }
            }
        });
    } else {
        console.error('No se encontró el formulario de login con ID #loginForm.');
    }
});