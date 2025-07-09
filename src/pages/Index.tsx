
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
