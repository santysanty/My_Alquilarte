class MapaPropiedades {
  constructor(tabId, mapaId) {
    this.tabId = tabId;
    this.mapaId = mapaId;
    this.map = null;
    this.initialized = false;
    this.initEventListeners();
  }

  initEventListeners() {
    const tabButton = document.getElementById(this.tabId);
    if (!tabButton) {
      console.warn(`[MAPA] No se encontró el botón con ID "${this.tabId}"`);
      return;
    }

    tabButton.addEventListener('shown.bs.tab', () => this.initMap());

    if (tabButton.classList.contains('active')) {
      setTimeout(() => this.initMap(), 300);
    }
  }

  async initMap() {
    const mapaContainer = document.getElementById(this.mapaId);
    if (this.initialized || !mapaContainer) return;

    try {
      const res = await fetch('/propiedad/api/propiedades');
      if (!res.ok) throw new Error('No se pudieron obtener propiedades.');
      const propiedades = await res.json();

      console.log('[MAPA] Propiedades obtenidas:', propiedades);

      this.map = L.map(this.mapaId).setView([-34.6, -58.38], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      propiedades.forEach(p => {
        const lat = p.ubicacion?.coordenadas?.lat;
        const lng = p.ubicacion?.coordenadas?.lng;

        if (lat && lng) {
          const popup = `
            <strong>${p.titulo || 'Propiedad sin título'}</strong><br>
            ${p.ubicacion?.calle || ''} ${p.ubicacion?.numero || ''}<br>
            ${p.precio?.valor || ''} ${p.precio?.moneda || ''}<br>
            ${p.imagenUrl ? `<img src="${p.imagenUrl}" style="width:100%; max-width:200px;">` : ''}
          `;
          L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup(popup);
        }
      });

      this.initialized = true;
      console.log('[MAPA] Mapa inicializado correctamente.');
    } catch (error) {
      console.error('[MAPA] Error al cargar propiedades:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[MAPA] DOM completamente cargado.');
  new MapaPropiedades('mapa-tab', 'mapa');
});
