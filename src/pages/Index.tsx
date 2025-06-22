import React, { useState, useMemo } from 'react';
import { Upload, MapPin, Settings, Eye, Edit3, Download, Share2, LogOut } from 'lucide-react';
import { MapEditor } from '../components/MapEditor';
import { CategoryFilter } from '../components/CategoryFilter';
import { HotspotsList } from '../components/HotspotsList';
import { HotspotModal } from '../components/HotspotModal';
import { AdminPanel } from '../components/AdminPanel';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { Hotspot, MapData } from '../types';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [mapData, setMapData] = useState<MapData>({
    backgroundImage: '',
    hotspots: [],
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Get unique categories from hotspots
  const categories = useMemo(() => {
    const categorySet = new Set(
      mapData.hotspots
        .map(h => h.category)
        .filter(Boolean) as string[]
    );
    return Array.from(categorySet).sort();
  }, [mapData.hotspots]);

  // Filter hotspots based on selected categories
  const filteredHotspots = useMemo(() => {
    if (selectedCategories.length === 0) {
      return mapData.hotspots;
    }
    return mapData.hotspots.filter(hotspot => 
      hotspot.category && selectedCategories.includes(hotspot.category)
    );
  }, [mapData.hotspots, selectedCategories]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMapData({
          ...mapData,
          backgroundImage: e.target?.result as string,
        });
        toast.success('Plattegrond succesvol geüpload!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHotspotsChange = (hotspots: Hotspot[]) => {
    setMapData({
      ...mapData,
      hotspots,
    });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setShowModal(true);
  };

  const handleEditHotspot = (hotspot: Hotspot) => {
    setEditingHotspot(hotspot);
  };

  const handleSaveHotspot = (hotspot: Hotspot) => {
    const existingIndex = mapData.hotspots.findIndex(h => h.id === hotspot.id);
    if (existingIndex >= 0) {
      const updatedHotspots = [...mapData.hotspots];
      updatedHotspots[existingIndex] = hotspot;
      handleHotspotsChange(updatedHotspots);
    } else {
      handleHotspotsChange([...mapData.hotspots, hotspot]);
    }
    setEditingHotspot(null);
    toast.success('Hotspot opgeslagen!');
  };

  const handleDeleteHotspot = (id: string) => {
    handleHotspotsChange(mapData.hotspots.filter(h => h.id !== id));
    setEditingHotspot(null);
    toast.success('Hotspot verwijderd!');
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(mapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'camping-plattegrond.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Plattegrond data geëxporteerd!');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setMapData(importedData);
          toast.success('Plattegrond data geïmporteerd!');
        } catch (error) {
          toast.error('Fout bij importeren van data');
        }
      };
      reader.readAsText(file);
    }
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
                  Interactieve Plattegrond
                </h1>
                <p className="text-sm text-gray-500">
                  Voor campings & recreatieparken
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isAdminMode
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAdminMode ? (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Admin Modus
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Bekijk Modus
                  </>
                )}
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        {!mapData.backgroundImage && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Upload je plattegrond
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Begin met het uploaden van een plattegrond van je camping, vakantiepark of andere recreatiefaciliteit. 
                  Daarna kun je interactieve hotspots toevoegen voor verschillende locaties.
                </p>
                
                <label className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Upload className="w-5 h-5" />
                  Plattegrond Uploaden
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Controls Bar */}
        {mapData.backgroundImage && (
          <>
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Nieuwe Plattegrond</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="text-sm text-gray-500">
                      {mapData.hotspots.length} hotspot{mapData.hotspots.length !== 1 ? 's' : ''} geplaatst
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Exporteren</span>
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg cursor-pointer transition-colors duration-200">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Importeren</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            {!isAdminMode && categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                onClearAll={handleClearCategories}
              />
            )}
          </>
        )}

        {/* Map Editor */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <MapEditor
            backgroundImage={mapData.backgroundImage}
            hotspots={filteredHotspots}
            isAdminMode={isAdminMode}
            onHotspotsChange={handleHotspotsChange}
          />
        </div>

        {/* Hotspots List */}
        {!isAdminMode && (
          <HotspotsList
            hotspots={mapData.hotspots}
            filteredHotspots={filteredHotspots}
            isAdminMode={isAdminMode}
            onHotspotClick={handleHotspotClick}
            onEditHotspot={handleEditHotspot}
          />
        )}

        {/* Instructions */}
        {mapData.backgroundImage && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                {isAdminMode ? 'Admin Instructies' : 'Gebruikers Instructies'}
              </h3>
              
              {isAdminMode ? (
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Hotspot toevoegen:</strong> Klik op een locatie op de plattegrond om een nieuwe hotspot toe te voegen.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Hotspot bewerken:</strong> Klik op een bestaande hotspot om de details aan te passen.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Data beheren:</strong> Gebruik de export/import functie om je plattegrond op te slaan of te delen.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Voorbeeldmodus:</strong> Schakel naar bekijk modus om te zien hoe bezoekers de plattegrond ervaren.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-green-700 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Interactieve hotspots:</strong> Klik op de groene markers om meer informatie te zien over verschillende locaties op de plattegrond.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Filter op categorie:</strong> Gebruik de categoriefilters om alleen bepaalde typen locaties te tonen.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Locaties overzicht:</strong> Bekijk alle locaties in een overzichtelijke lijst onder de plattegrond.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && selectedHotspot && (
        <HotspotModal
          hotspot={selectedHotspot}
          onClose={() => {
            setShowModal(false);
            setSelectedHotspot(null);
          }}
        />
      )}

      {editingHotspot && (
        <AdminPanel
          hotspot={editingHotspot}
          onSave={handleSaveHotspot}
          onDelete={handleDeleteHotspot}
          onCancel={() => setEditingHotspot(null)}
        />
      )}
    </div>
  );
};

export default Index;
