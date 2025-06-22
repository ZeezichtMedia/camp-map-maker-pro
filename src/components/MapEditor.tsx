
import React, { useState, useRef } from 'react';
import { MapPin, Edit3, Eye } from 'lucide-react';
import { Hotspot } from '../types';
import { HotspotModal } from './HotspotModal';
import { AdminPanel } from './AdminPanel';

interface MapEditorProps {
  backgroundImage: string;
  hotspots: Hotspot[];
  isAdminMode: boolean;
  onHotspotsChange: (hotspots: Hotspot[]) => void;
}

export const MapEditor: React.FC<MapEditorProps> = ({
  backgroundImage,
  hotspots,
  isAdminMode,
  onHotspotsChange,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdminMode || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newHotspot: Hotspot = {
      id: Date.now().toString(),
      x,
      y,
      title: 'Nieuwe Locatie',
      description: 'Beschrijving van deze locatie...',
      category: 'Algemeen',
    };

    setEditingHotspot(newHotspot);
  };

  const handleHotspotClick = (hotspot: Hotspot, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isAdminMode) {
      setEditingHotspot(hotspot);
    } else {
      setSelectedHotspot(hotspot);
      setShowModal(true);
    }
  };

  const handleSaveHotspot = (hotspot: Hotspot) => {
    const existingIndex = hotspots.findIndex(h => h.id === hotspot.id);
    if (existingIndex >= 0) {
      const updatedHotspots = [...hotspots];
      updatedHotspots[existingIndex] = hotspot;
      onHotspotsChange(updatedHotspots);
    } else {
      onHotspotsChange([...hotspots, hotspot]);
    }
    setEditingHotspot(null);
  };

  const handleDeleteHotspot = (id: string) => {
    onHotspotsChange(hotspots.filter(h => h.id !== id));
    setEditingHotspot(null);
  };

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="relative w-full h-96 md:h-[600px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-lg"
        onClick={handleMapClick}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!backgroundImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center text-green-600">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Upload een plattegrond om te beginnen</p>
              <p className="text-sm opacity-75">Ondersteunt JPG, PNG en andere afbeeldingsformaten</p>
            </div>
          </div>
        )}

        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
            }}
            onClick={(e) => handleHotspotClick(hotspot, e)}
          >
            <div className="relative group">
              <div className="w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-110 animate-pulse hover:animate-none">
                <MapPin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              {!isAdminMode && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {hotspot.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAdminMode && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Edit3 className="w-4 h-4" />
              <span className="font-medium">Admin Modus</span>
            </div>
            <p className="text-xs text-gray-600">Klik om hotspots toe te voegen</p>
          </div>
        )}
      </div>

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
