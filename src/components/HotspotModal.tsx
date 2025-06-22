
import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Hotspot } from '../types';

interface HotspotModalProps {
  hotspot: Hotspot;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({ hotspot, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="relative">
          {hotspot.image && (
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden">
              <img
                src={hotspot.image}
                alt={hotspot.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {!hotspot.image && (
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white/80" />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{hotspot.title}</h2>
              {hotspot.category && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-3">
                  {hotspot.category}
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {hotspot.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
