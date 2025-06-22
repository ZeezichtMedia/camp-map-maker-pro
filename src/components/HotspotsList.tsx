
import React from 'react';
import { MapPin, Eye, Edit3 } from 'lucide-react';
import { Hotspot } from '../types';

interface HotspotsListProps {
  hotspots: Hotspot[];
  filteredHotspots: Hotspot[];
  isAdminMode: boolean;
  onHotspotClick: (hotspot: Hotspot) => void;
  onEditHotspot: (hotspot: Hotspot) => void;
}

export const HotspotsList: React.FC<HotspotsListProps> = ({
  hotspots,
  filteredHotspots,
  isAdminMode,
  onHotspotClick,
  onEditHotspot,
}) => {
  if (hotspots.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Locaties overzicht</h2>
          <p className="text-sm text-gray-500">
            {filteredHotspots.length} van {hotspots.length} locaties weergegeven
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {hotspot.image && (
              <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={hotspot.image}
                  alt={hotspot.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 flex-1">{hotspot.title}</h3>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onHotspotClick(hotspot)}
                  className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                  title="Bekijken"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {isAdminMode && (
                  <button
                    onClick={() => onEditHotspot(hotspot)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Bewerken"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {hotspot.category && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-2">
                {hotspot.category}
              </span>
            )}
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {hotspot.description}
            </p>
          </div>
        ))}
      </div>

      {filteredHotspots.length === 0 && hotspots.length > 0 && (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Geen locaties gevonden voor de geselecteerde filters</p>
        </div>
      )}
    </div>
  );
};
