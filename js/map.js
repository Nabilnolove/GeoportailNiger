// Initialisation de la carte centrée sur Niger
let map = L.map('map').setView([17.6, 8.0], 6);

// Ajout de la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors | Géoportail Niger'
}).addTo(map);

// Variables globales
let currentLayer;
let thematicLayers = {};

// Éléments DOM
const infoDisplay = document.getElementById('info-display');
const locationName = document.getElementById('location-name');
const locationType = document.getElementById('location-type');
const locationArea = document.getElementById('location-area');
const locationPopulation = document.getElementById('location-population');
const additionalInfo = document.getElementById('additional-info');

// Gestion du panneau
const togglePanel = document.getElementById('toggle-panel');
const layersPanel = document.getElementById('layers-panel');
const closePanel = document.getElementById('close-panel');
const resetLayers = document.getElementById('reset-layers');

// Configuration complète des couches thématiques
const layerConfigs = {
  // Éducation
  'universities': {
    icon: '🎓',
    color: '#805ad5',
    data: [
      {name: 'Université Abdou Moumouni', lat: 13.5137, lng: 2.1098, type: 'Université publique', ville: 'Niamey'},
      {name: 'Université Islamique du Niger', lat: 13.5200, lng: 2.1200, type: 'Université privée', ville: 'Niamey'},
      {name: 'Université de Tahoua', lat: 14.8888, lng: 5.2692, type: 'Université publique', ville: 'Tahoua'}
    ]
  },
  'high-schools': {
    icon: '🏫',
    color: '#3182ce',
    data: [
      {name: 'Lycée Issa Korombé', lat: 13.5100, lng: 2.1000, type: 'Lycée public', ville: 'Niamey'},
      {name: 'Lycée Bosso', lat: 13.5300, lng: 2.1300, type: 'Lycée public', ville: 'Niamey'},
      {name: 'Lycée de Zinder', lat: 13.8000, lng: 8.9880, type: 'Lycée public', ville: 'Zinder'}
    ]
  },
  'primary-schools': {
    icon: '🏫',
    color: '#dd6b20',
    data: [
      {name: 'École Primaire Centre', lat: 13.5150, lng: 2.1050, type: 'École primaire', ville: 'Niamey'},
      {name: 'École Primaire Terminus', lat: 13.5250, lng: 2.1150, type: 'École primaire', ville: 'Niamey'},
      {name: 'École Primaire Agadez', lat: 16.9735, lng: 7.9861, type: 'École primaire', ville: 'Agadez'}
    ]
  },
  
  // Santé
  'hospitals': {
    icon: '🏥',
    color: '#e53e3e',
    data: [
      {name: 'Hôpital National Lamordé', lat: 13.5180, lng: 2.1080, type: 'Hôpital national', ville: 'Niamey'},
      {name: 'Hôpital National de Zinder', lat: 13.8000, lng: 8.9880, type: 'Hôpital régional', ville: 'Zinder'},
      {name: 'Hôpital Régional d\'Agadez', lat: 16.9735, lng: 7.9861, type: 'Hôpital régional', ville: 'Agadez'}
    ]
  },
  'health-centers': {
    icon: '⚕️',
    color: '#3182ce',
    data: [
      {name: 'Centre de Santé Intégré', lat: 13.5120, lng: 2.1020, type: 'Centre de santé', ville: 'Niamey'},
      {name: 'CSI Poudrière', lat: 13.5220, lng: 2.1120, type: 'Centre de santé', ville: 'Niamey'},
      {name: 'CSI Maradi', lat: 13.5000, lng: 7.1019, type: 'Centre de santé', ville: 'Maradi'}
    ]
  },
  'pharmacies': {
    icon: '💊',
    color: '#dd6b20',
    data: [
      {name: 'Pharmacie Centrale', lat: 13.5160, lng: 2.1060, type: 'Pharmacie', ville: 'Niamey'},
      {name: 'Pharmacie du Sahel', lat: 13.5260, lng: 2.1160, type: 'Pharmacie', ville: 'Niamey'},
      {name: 'Pharmacie Zinder', lat: 13.8050, lng: 8.9900, type: 'Pharmacie', ville: 'Zinder'}
    ]
  },
  
  // Infrastructure
  'airports-int': {
    icon: '✈️',
    color: '#3182ce',
    data: [
      {name: 'Aéroport International Diori Hamani', lat: 13.4815, lng: 2.1836, type: 'Aéroport international', ville: 'Niamey'}
    ]
  },
  'airports-nat': {
    icon: '✈️',
    color: '#38a169',
    data: [
      {name: 'Aéroport de Zinder', lat: 13.7789, lng: 8.9956, type: 'Aéroport national', ville: 'Zinder'},
      {name: 'Aéroport d\'Agadez', lat: 16.9658, lng: 7.9961, type: 'Aéroport national', ville: 'Agadez'}
    ]
  },
  
  // Agriculture
  'markets': {
    icon: '🏪',
    color: '#dd6b20',
    data: [
      {name: 'Grand Marché de Niamey', lat: 13.5115, lng: 2.1254, type: 'Marché principal', ville: 'Niamey'},
      {name: 'Marché de Zinder', lat: 13.8089, lng: 8.9889, type: 'Marché régional', ville: 'Zinder'},
      {name: 'Marché d\'Agadez', lat: 16.9728, lng: 7.9889, type: 'Marché régional', ville: 'Agadez'}
    ]
  },
  
  // Environnement
  'water-bodies': {
    icon: '💧',
    color: '#3182ce',
    data: [
      {name: 'Fleuve Niger', lat: 13.5200, lng: 2.1200, type: 'Fleuve', ville: 'Niamey'},
      {name: 'Lac Tchad (zone)', lat: 13.4500, lng: 14.0500, type: 'Lac', ville: 'Diffa'},
      {name: 'Mare de Tabalak', lat: 15.0000, lng: 6.0000, type: 'Mare', ville: 'Tabalak'}
    ]
  }
};

// Fonction pour créer des marqueurs thématiques
function createThematicLayer(layerType) {
  const config = layerConfigs[layerType];
  if (!config) return null;

  const layerGroup = L.layerGroup();
  
  config.data.forEach(item => {
    const marker = L.marker([item.lat, item.lng], {
      icon: L.divIcon({
        html: `<div style="background: ${config.color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">${config.icon}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    });
    
    marker.bindPopup(`
      <div style="font-family: 'Segoe UI', sans-serif;">
        <h4 style="color: ${config.color}; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
          ${config.icon} ${item.name}
        </h4>
        <p style="margin: 4px 0;"><strong>Type:</strong> ${item.type}</p>
        <p style="margin: 4px 0;"><strong>Ville:</strong> ${item.ville}</p>
      </div>
    `);
    
    layerGroup.addLayer(marker);
  });

  return layerGroup;
}

// Gestion des événements du panneau
togglePanel.addEventListener('click', () => {
  layersPanel.classList.add('show');
});

closePanel.addEventListener('click', () => {
  layersPanel.classList.remove('show');
});

// Gestion des sections accordéon
document.querySelectorAll('.section-header').forEach(header => {
  header.addEventListener('click', () => {
    const section = header.dataset.section;
    const content = document.getElementById(section + '-content');
    
    // Fermer toutes les autres sections
    document.querySelectorAll('.section-content').forEach(c => {
      if (c !== content) {
        c.classList.remove('show');
      }
    });
    document.querySelectorAll('.section-header').forEach(h => {
      if (h !== header) {
        h.classList.remove('active');
      }
    });
    
    // Toggle la section actuelle
    content.classList.toggle('show');
    header.classList.toggle('active');
  });
});

// Gestion des couches thématiques
document.querySelectorAll('input[data-layer]').forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    const layerType = e.target.dataset.layer;
    
    if (e.target.checked) {
      if (!thematicLayers[layerType]) {
        thematicLayers[layerType] = createThematicLayer(layerType);
      }
      if (thematicLayers[layerType]) {
        map.addLayer(thematicLayers[layerType]);
      }
    } else {
      if (thematicLayers[layerType]) {
        map.removeLayer(thematicLayers[layerType]);
      }
    }
  });
});

// Réinitialisation des couches
resetLayers.addEventListener('click', () => {
  document.querySelectorAll('input[data-layer]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  Object.values(thematicLayers).forEach(layer => {
    if (layer && map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
});


// Affichage des informations
function showLocationInfo(feature, layerType) {
  const p = feature.properties;
  const name = p.nom || p.admin1Name || p.Commune || p.Départeme || "Zone administrative";
  const superficie = p.superficie || p.Superficie || "Non spécifiée";
  const population = p.population || p.Population || p["Statistique-Feuil1_Population Total"] || "Non spécifiée";
  const popHomme = p["Pop Hom"] || p.pop_homme || p["Statistique-Feuil1_Total Homme"] || null;
  const popFemme = p["Popu Fem"] || p.pop_femme || p["Statistique-Feuil1_Total Femme"] || null;
  const nbrDep = p["Nbr_dep"] || p.nbr_departements || null;
  const nbrCom = p["Nbr_Com"] || p.nbr_communes || null;

  locationName.textContent = name;
  locationType.textContent = layerType.charAt(0).toUpperCase() + layerType.slice(1);
  locationArea.textContent = typeof superficie === 'number' ? `${superficie.toLocaleString()} km²` : superficie;
  locationPopulation.textContent = typeof population === 'number' ? `${population.toLocaleString()} habitants` : population;

   let additionalInfoHtml = '';
  
  if (popHomme !== null) {
    additionalInfoHtml += `<p style="color: red;"><span class="info-label">Hommes:</span> ${typeof popHomme === 'number' ? popHomme.toLocaleString() : popHomme}</p>`;
  }
  
  if (popFemme !== null) {
    additionalInfoHtml += `<p style="color: red;"><span class="info-label">Femmes:</span> ${typeof popFemme === 'number' ? popFemme.toLocaleString() : popFemme}</p>`;
  }
  
  if (nbrDep !== null) {
    additionalInfoHtml += `<p style="color: red;"><span class="info-label">Départements:</span> ${nbrDep}</p>`;
  }
  
  if (nbrCom !== null) {
    additionalInfoHtml += `<p style="color: red;"><span class="info-label">Communes:</span> ${nbrCom}</p>`;
  }

  // Appliquer aussi la couleur rouge aux éléments principaux
  locationName.style.color = 'red';
  locationType.style.color = 'red';
  locationArea.style.color = 'red';
  locationPopulation.style.color = 'red';

  additionalInfo.innerHTML = additionalInfoHtml;
  infoDisplay.classList.add('show');
}

// Chargement des GeoJSON
const geoJsonPaths = {
  regions: 'data/regions.geojson',
  departements: 'data/departements.geojson',
  communes: 'data/communes.geojson'
};

async function loadGeoJSON(type) {
  try {
    if (currentLayer) {
      map.removeLayer(currentLayer);
    }

    const response = await fetch(geoJsonPaths[type]);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    currentLayer = L.geoJSON(data, {
      style: {
        weight: 2,
        opacity: 1,
        fillOpacity: 0.1,
        color: type === 'regions' ? '#73a6d6ff' : 
               type === 'departements' ? '#5ea57fff' : '#967ecaff',
        fillColor: type === 'regions' ? '#71a1ceff' : 
                   type === 'departements' ? '#6bbe92ff' : '#805ad5'
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({
              weight: 3,
              fillOpacity: 0.3
            });
            showLocationInfo(feature, type);
          },
          mouseout: (e) => {
            e.target.setStyle({
              weight: 2,
              fillOpacity: 0.1
            });
            hideLocationInfo();
          },
          click: (e) => {
            // Zoom sur la feature avec un niveau de zoom approprié
            if (type === 'regions') {
              map.fitBounds(e.target.getBounds(), {padding: [20, 20], maxZoom: 8});
            } else if (type === 'departements') {
              map.fitBounds(e.target.getBounds(), {padding: [20, 20], maxZoom: 10});
            } else {
              map.fitBounds(e.target.getBounds(), {padding: [20, 20], maxZoom: 12});
            }
          }
        });

    
      }
    }).addTo(map);

    if (currentLayer.getBounds().isValid()) {
      map.fitBounds(currentLayer.getBounds(), {padding: [20, 20]});
    }
  } catch (error) {
    console.error("Erreur de chargement:", error);
    alert("Erreur lors du chargement des données. Veuillez vérifier votre connexion.");
  }
}

// Initialisation
document.getElementById('level-selector').addEventListener('change', (e) => {
  loadGeoJSON(e.target.value);
});

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
  loadGeoJSON('regions');
  setTimeout(() => infoDisplay.classList.add('show'), 1000);
});