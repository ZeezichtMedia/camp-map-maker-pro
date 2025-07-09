import React, { useState, useRef } from 'react';
import { MapPin, Info, Settings, Eye, Upload, FileText } from 'lucide-react';
import { PublicMapView } from '../components/PublicMapView';
import { MapEditor } from '../components/MapEditor';
import { campingMapData } from '../data/campingData';

const Index = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mapData, setMapData] = useState(campingMapData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHotspotsChange = (newHotspots: any[]) => {
    setMapData(prev => ({
      ...prev,
      hotspots: newHotspots
    }));
  };

  const exportMapData = () => {
    const dataStr = JSON.stringify(mapData, null, 2);
    console.log('Updated map data for hardcoding:');
    console.log(dataStr);
    
    // Create downloadable file
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campingMapData.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      alert('Selecteer een geldig JSON bestand');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validate if it has the expected structure
        if (jsonData.hotspots && Array.isArray(jsonData.hotspots)) {
          setMapData(jsonData);
          console.log('Map data imported successfully:', jsonData);
        } else {
          alert('Het JSON bestand heeft niet de juiste structuur. Het moet een "hotspots" array bevatten.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Fout bij het lezen van het JSON bestand. Controleer of het geldig JSON is.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const generatePlugin = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Camping Plattegrond</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f9ff 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .header-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        .header h1 {
            color: #1f2937;
            font-size: 24px;
            font-weight: 700;
        }
        
        .header p {
            color: #6b7280;
            font-size: 14px;
        }
        
        .category-filters {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .category-filters h3 {
            margin-bottom: 15px;
            color: #1f2937;
            font-size: 18px;
        }
        
        .filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .filter-btn {
            padding: 8px 16px;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            color: #4b5563;
        }
        
        .filter-btn:hover {
            border-color: #10b981;
            color: #10b981;
        }
        
        .filter-btn.active {
            background: #10b981;
            border-color: #10b981;
            color: white;
        }
        
        .map-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-bottom: 30px;
        }
        
        .map {
            position: relative;
            width: 100%;
            height: 600px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        
        .hotspot {
            position: absolute;
            width: 32px;
            height: 32px;
            background: #10b981;
            border: 4px solid white;
            border-radius: 50%;
            cursor: pointer;
            transform: translate(-50%, -50%);
            transition: all 0.2s;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .hotspot:hover {
            background: #059669;
            transform: translate(-50%, -50%) scale(1.1);
        }
        
        .hotspot::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .modal-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
        }
        
        .modal-category {
            display: inline-block;
            background: #dcfce7;
            color: #16a34a;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .modal-description {
            color: #4b5563;
            line-height: 1.6;
        }
        
        .locations-list {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .locations-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .locations-icon {
            width: 40px;
            height: 40px;
            background: #dcfce7;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #16a34a;
        }
        
        .locations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .location-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.2s;
            cursor: pointer;
        }
        
        .location-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .location-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .location-category {
            display: inline-block;
            background: #dcfce7;
            color: #16a34a;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .location-description {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.5;
        }
        
        @media (max-width: 768px) {
            .map {
                height: 400px;
            }
            
            .filter-buttons {
                flex-direction: column;
            }
            
            .filter-btn {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-icon">📍</div>
            <div>
                <h1>Camping Plattegrond</h1>
                <p>Interactieve kaart van ons park</p>
            </div>
        </div>

        <!-- Category Filters -->
        <div class="category-filters">
            <h3>Filter op categorie:</h3>
            <div class="filter-buttons">
                <button class="filter-btn active" data-category="all">Alle locaties</button>
            </div>
        </div>

        <!-- Interactive Map -->
        <div class="map-container">
            <div class="map" id="map" style="background-image: url('${mapData.backgroundImage}');">
                <!-- Hotspots will be inserted here by JavaScript -->
            </div>
        </div>

        <!-- Locations List -->
        <div class="locations-list">
            <div class="locations-header">
                <div class="locations-icon">📍</div>
                <div>
                    <h2 style="color: #1f2937; font-size: 20px; font-weight: 700;">Locaties overzicht</h2>
                    <p style="color: #6b7280; font-size: 14px;">Alle beschikbare locaties op de camping</p>
                </div>
            </div>
            <div class="locations-grid" id="locations-grid">
                <!-- Location cards will be inserted here by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal" id="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modal-title"></h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-category" id="modal-category"></div>
            <p class="modal-description" id="modal-description"></p>
        </div>
    </div>

    <script>
        // Map data
        const mapData = ${JSON.stringify(mapData, null, 8)};
        
        let selectedCategories = [];
        
        // Initialize the map
        function initMap() {
            const map = document.getElementById('map');
            const filterButtons = document.querySelector('.filter-buttons');
            const locationsGrid = document.getElementById('locations-grid');
            
            // Get unique categories
            const categories = [...new Set(mapData.hotspots.map(h => h.category).filter(Boolean))].sort();
            
            // Create filter buttons
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.textContent = category;
                btn.dataset.category = category;
                btn.onclick = () => toggleCategory(category);
                filterButtons.appendChild(btn);
            });
            
            // Create hotspots
            createHotspots();
            
            // Create location cards
            createLocationCards();
        }
        
        function createHotspots() {
            const map = document.getElementById('map');
            map.innerHTML = ''; // Clear existing hotspots
            
            const filteredHotspots = selectedCategories.length === 0 ? 
                mapData.hotspots : 
                mapData.hotspots.filter(h => h.category && selectedCategories.includes(h.category));
            
            filteredHotspots.forEach(hotspot => {
                const hotspotEl = document.createElement('div');
                hotspotEl.className = 'hotspot';
                hotspotEl.style.left = hotspot.x + '%';
                hotspotEl.style.top = hotspot.y + '%';
                hotspotEl.onclick = () => openModal(hotspot);
                hotspotEl.title = hotspot.title;
                map.appendChild(hotspotEl);
            });
        }
        
        function createLocationCards() {
            const grid = document.getElementById('locations-grid');
            grid.innerHTML = '';
            
            const filteredHotspots = selectedCategories.length === 0 ? 
                mapData.hotspots : 
                mapData.hotspots.filter(h => h.category && selectedCategories.includes(h.category));
            
            filteredHotspots.forEach(hotspot => {
                const card = document.createElement('div');
                card.className = 'location-card';
                card.onclick = () => openModal(hotspot);
                card.innerHTML = \`
                    <div class="location-title">\${hotspot.title}</div>
                    \${hotspot.category ? \`<div class="location-category">\${hotspot.category}</div>\` : ''}
                    <div class="location-description">\${hotspot.description}</div>
                \`;
                grid.appendChild(card);
            });
        }
        
        function toggleCategory(category) {
            const btn = document.querySelector(\`[data-category="\${category}"]\`);
            const allBtn = document.querySelector('[data-category="all"]');
            
            if (selectedCategories.includes(category)) {
                selectedCategories = selectedCategories.filter(c => c !== category);
                btn.classList.remove('active');
            } else {
                selectedCategories.push(category);
                btn.classList.add('active');
                allBtn.classList.remove('active');
            }
            
            if (selectedCategories.length === 0) {
                allBtn.classList.add('active');
            }
            
            createHotspots();
            createLocationCards();
        }
        
        function openModal(hotspot) {
            const modal = document.getElementById('modal');
            const title = document.getElementById('modal-title');
            const category = document.getElementById('modal-category');
            const description = document.getElementById('modal-description');
            
            title.textContent = hotspot.title;
            category.textContent = hotspot.category || 'Algemeen';
            category.style.display = hotspot.category ? 'inline-block' : 'none';
            description.textContent = hotspot.description;
            
            modal.classList.add('active');
        }
        
        function closeModal() {
            const modal = document.getElementById('modal');
            modal.classList.remove('active');
        }
        
        // Close modal when clicking outside
        document.getElementById('modal').onclick = function(e) {
            if (e.target === this) {
                closeModal();
            }
        }
        
        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', initMap);
    </script>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'camping-plattegrond.html';
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('Plugin gegenereerd en gedownload!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Camping Plattegrond
                </h1>
                <p className="text-sm text-gray-500">
                  Interactieve kaart van ons park
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Admin Mode Toggle */}
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAdminMode 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAdminMode ? <Settings className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isAdminMode ? 'Admin Modus' : 'Bekijk Modus'}
              </button>

              {isAdminMode && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Import JSON
                  </button>
                  
                  <button
                    onClick={generatePlugin}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Plugin
                  </button>
                  
                  <button
                    onClick={exportMapData}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Export Data
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </>
              )}

              {!isAdminMode && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>Klik op de groene punten voor meer informatie</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdminMode ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Admin Modus - Hotspots Bewerken
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  • Klik op de kaart om nieuwe hotspots toe te voegen
                </p>
                <p>
                  • Klik op bestaande hotspots om ze te bewerken
                </p>
                <p>
                  • Gebruik "Import JSON" om eerder geëxporteerde data te laden
                </p>
                <p>
                  • Gebruik "Generate Plugin" om een complete standalone website te downloaden
                </p>
                <p>
                  • Gebruik "Export Data" om de bijgewerkte data te downloaden voor hardcoding
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <MapEditor
                backgroundImage={mapData.backgroundImage}
                hotspots={mapData.hotspots}
                isAdminMode={true}
                onHotspotsChange={handleHotspotsChange}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Public Map View */}
            <PublicMapView mapData={mapData} />

            {/* Info Section */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Welkom op Camping Boogaard
                </h3>
                
                <div className="text-sm text-green-700 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Interactieve plattegrond:</strong> Klik op de groene markers om meer informatie te zien over verschillende locaties op onze camping.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Filter op categorie:</strong> Gebruik de categoriefilters bovenaan om alleen bepaalde typen locaties te tonen.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Locaties overzicht:</strong> Bekijk alle locaties in de lijst onder de plattegrond.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
