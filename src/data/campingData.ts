
import { MapData } from '../types';

// Hardcoded camping plattegrond data
export const campingMapData: MapData = {
  backgroundImage: '/camping-map.jpg', // Plaats je plattegrond hier in de public folder
  hotspots: [
    {
      id: '1',
      x: 20,
      y: 30,
      title: 'Receptie',
      description: 'Hier kunt u inchecken en uitchecken. Openingstijden: 08:00 - 20:00',
      category: 'Service',
    },
    {
      id: '2',
      x: 45,
      y: 25,
      title: 'Restaurant',
      description: 'Ons restaurant biedt heerlijke lokale gerechten. Open van 12:00 - 22:00',
      category: 'Horeca',
    },
    {
      id: '3',
      x: 70,
      y: 40,
      title: 'Speeltuin',
      description: 'Leuke speeltuin voor kinderen van alle leeftijden. Gratis toegang.',
      category: 'Recreatie',
    },
    {
      id: '4',
      x: 30,
      y: 60,
      title: 'Sanitairgebouw A',
      description: 'Modern sanitairgebouw met douches, toiletten en wasmachines.',
      category: 'Sanitair',
    },
    {
      id: '5',
      x: 80,
      y: 70,
      title: 'Zwembad',
      description: 'Buitenzwembad met kindergedeelte. Open van mei tot september.',
      category: 'Recreatie',
    },
    {
      id: '6',
      x: 15,
      y: 80,
      title: 'Camping winkel',
      description: 'Kleine supermarkt voor dagelijkse boodschappen. Open 08:00 - 19:00',
      category: 'Service',
    }
  ]
};

// Je kunt hier meer plattegronden toevoegen als je meerdere kaarten wilt
export const availableMaps = {
  main: campingMapData,
  // beach: beachMapData, // bijvoorbeeld voor een strandkaart
};
