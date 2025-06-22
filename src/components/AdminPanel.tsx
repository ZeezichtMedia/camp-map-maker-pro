
import React, { useState } from 'react';
import { Save, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Hotspot } from '../types';
import { ScrollArea } from './ui/scroll-area';

interface AdminPanelProps {
  hotspot: Hotspot;
  onSave: (hotspot: Hotspot) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  hotspot,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Hotspot>(hotspot);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isExisting = hotspot.id && hotspot.title !== 'Nieuwe Locatie';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <h2 className="text-xl font-bold">
            {isExisting ? 'Hotspot Bewerken' : 'Nieuwe Hotspot'}
          </h2>
          <p className="text-green-100 text-sm mt-1">
            Pas de details van deze locatie aan
          </p>
        </div>

        <ScrollArea className="h-full max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Bijvoorbeeld: Zwembad, Restaurant, Speeltuin..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecteer een categorie</option>
                <option value="Faciliteiten">Faciliteiten</option>
                <option value="Recreatie">Recreatie</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Accommodatie">Accommodatie</option>
                <option value="Service">Service</option>
                <option value="Algemeen">Algemeen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Beschrijf deze locatie in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Afbeelding
              </label>
              <div className="space-y-3">
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: undefined })}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Klik om afbeelding te uploaden</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50">
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Opslaan
          </button>
          
          {isExisting && (
            <button
              type="button"
              onClick={() => onDelete(hotspot.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
