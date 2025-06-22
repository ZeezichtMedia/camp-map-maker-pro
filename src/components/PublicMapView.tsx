
import React, { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { MapEditor } from './MapEditor';
import { CategoryFilter } from './CategoryFilter';
import { HotspotsList } from './HotspotsList';
import { HotspotModal } from './HotspotModal';
import { Hotspot, MapData } from '../types';

interface PublicMapViewProps {
  mapData: MapData;
}

export const PublicMapView: React.FC<PublicMapViewProps> = ({ mapData }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = useMemo(() => {
    const categorySet = new Set(
      mapData.hotspots
        .map(h => h.category)
        .filter(Boolean) as string[]
    );
    return Array.from(categorySet).sort();
  }, [map Data.hotspots]);

  const filteredHotspots = useMemo(() => {
    if (selectedCategories.length === 0) {
      return mapData.hotspots;
    }
    return mapData.hotspots.filter(hotspot => 
      hotspot.category && selectedCategories.includes(hotspot.category)
    );
  }, [mapData.hotspots, selectedCategories]);

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

  if (!mapData.backgroundImage) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Plattegrond wordt geladen...
        </h2>
        <p className="text-gray-500">
          De interactieve plattegrond wordt binnenkort beschikbaar gesteld.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onClearAll={handleClearCategories}
        />
      )}

      {/* Interactive Map */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <MapEditor
          backgroundImage={mapData.backgroundImage}
          hotspots={filteredHotspots}
          isAdminMode={false}
          onHotspotsChange={() => {}} // Read-only for public
        />
      </div>

      {/* Hotspots List */}
      <HotspotsList
        hotspots={mapData.hotspots}
        filteredHotspots={filteredHotspots}
        isAdminMode={false}
        onHotspotClick={handleHotspotClick}
        onEditHotspot={() => {}} // No edit for public
      />

      {/* Modal */}
      {showModal && selectedHotspot && (
        <HotspotModal
          hotspot={selectedHotspot}
          onClose={() => {
            setShowModal(false);
            setSelectedHotspot(null);
          }}
        />
      )}
    </div>
  );
};
