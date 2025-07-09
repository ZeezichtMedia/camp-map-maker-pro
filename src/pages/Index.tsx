
import React, { useState, useMemo } from 'react';
import { MapPin, Info } from 'lucide-react';
import { PublicMapView } from '../components/PublicMapView';
import { campingMapData } from '../data/campingData';

const Index = () => {
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

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>Klik op de groene punten voor meer informatie</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Public Map View */}
        <PublicMapView mapData={campingMapData} />

        {/* Info Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Welkom op onze camping
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
      </div>
    </div>
  );
};

export default Index;
