// public/js/admin/MAPAMANAGEMENT.JS

// Asume que Leaflet (L) ya está cargado globalmente por layoutAdmin.pug
// (Asegúrate de que layoutAdmin.pug tiene <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>)

class MapaPropiedades {
  constructor(mapaId) {
    this.mapaId = mapaId;
    this.map = null;
    this.initialized = false;
  }

  async initMap() {
    const mapaContainer = document.getElementById(this.mapaId);
    // CRÍTICO: Asegurarse de que el contenedor del mapa exista Y que el mapa no se haya inicializado ya.
    if (!mapaContainer || this.initialized) {
      if (this.initialized) console.log(`[MAPA] Mapa para #${this.mapaId} ya inicializado.`);
      return;
    }

    try {
      // RUTA DE API CORREGIDA: Apunta a /api/propiedades
      const res = await fetch('/api/propiedades');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error al cargar propiedades: ${res.status}`);
      }
      const propiedades = await res.json();
      console.log('[MAPA] Propiedades obtenidas:', propiedades);

      this.map = L.map(this.mapaId).setView([-34.6, -58.38], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      propiedades.forEach(p => {
        if (p.lat && p.lng) {
          const popup = `
            <strong>${p.titulo}</strong><br>
            ${p.direccion || ''}<br>
            ${p.precio} ${p.moneda}<br>
            ${p.imagenUrl ? `<img src="${p.imagenUrl}" style="width:100%; max-width:200px;">` : ''}
          `;
          L.marker([p.lat, p.lng]).addTo(this.map).bindPopup(popup);
        }
      });

      this.initialized = true;
      console.log(`[MAPA] Mapa para #${this.mapaId} inicializado correctamente con marcadores.`);
    } catch (error) {
      console.error(`[MAPA] Error al cargar propiedades desde la API para #${this.mapaId}:`, error);
      if (mapaContainer) mapaContainer.innerHTML = `<p class="text-danger">Error al cargar el mapa: ${error.message}</p>`;
    }
  }
}

// Función de inicialización que será llamada por adminDashboard.js
export function initializeMapTab() {
    console.log('[MAPA] Intentando inicializar el mapa...');
    const mapaInstance = new MapaPropiedades('mapa');
    mapaInstance.initMap();
}