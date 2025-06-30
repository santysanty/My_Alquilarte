// bootstrapLoader.js

(function() {
  console.log('BOOTSTRAPLOADER.JS: Inicio');

  // URL del script Bootstrap (cambia si usas otra versión)
  const bootstrapScriptUrl = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';

  // Función para cargar script dinámicamente
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolvemos inmediatamente
      if (window.bootstrap && window.bootstrap.Tab) {
        console.log('BOOTSTRAPLOADER.JS: Bootstrap ya cargado.');
        resolve();
        return;
      }

      // Chequeamos si ya existe un script con esta URL
      const existingScript = Array.from(document.scripts).find(s => s.src === url);
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          console.log('BOOTSTRAPLOADER.JS: Script ya estaba en el DOM, cargado.');
          resolve();
        });
        existingScript.addEventListener('error', () => {
          reject(new Error('Error cargando el script bootstrap'));
        });
        return;
      }

      // Creamos el script nuevo
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        console.log('BOOTSTRAPLOADER.JS: Script Bootstrap cargado.');
        resolve();
      };
      script.onerror = () => reject(new Error('Error cargando el script bootstrap'));
      document.head.appendChild(script);
    });
  }

  // Función para inicializar pestañas (recibe el id del contenedor de tabs)
  function initTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`BOOTSTRAPLOADER.JS: No existe el contenedor con id "${containerId}"`);
      return;
    }

    const tabButtons = container.querySelectorAll('button, a.nav-link');

    tabButtons.forEach(button => {
      try {
        const tabTrigger = new window.bootstrap.Tab(button);

        if (button.classList.contains('active')) {
          activarTab(button.id);
        }

        button.addEventListener('shown.bs.tab', event => {
          const id = event.target.id;
          activarTab(id);
        });
      } catch (e) {
        console.error('BOOTSTRAPLOADER.JS: Error inicializando pestaña:', e);
      }
    });

    // Activar tab por defecto si existe función específica
    if (typeof initializeDepartmentManagement === 'function') initializeDepartmentManagement();
  }

  // Función para activar contenido según tab
  function activarTab(id) {
    if (id === 'departments-tab') {
      if (typeof initializeDepartmentManagement === 'function') initializeDepartmentManagement();
    } else if (id === 'mapa-tab') {
      if (typeof initializeMapTab === 'function') initializeMapTab();
    }
  }

  // Esperar DOM cargado
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      console.log('BOOTSTRAPLOADER.JS: DOMContentLoaded activado, cargando Bootstrap...');
      await loadScript(bootstrapScriptUrl);
      console.log('BOOTSTRAPLOADER.JS: Bootstrap listo, inicializando tabs...');
      initTabs('adminTabs');
    } catch (err) {
      console.error('BOOTSTRAPLOADER.JS: Error cargando Bootstrap:', err);
    }
  });

})();
