
import { MapData } from '../types';

// Hardcoded camping plattegrond data
export const campingMapData: MapData = {
  backgroundImage: '/lovable-uploads/912dd3f4-5e66-43f4-b6c0-58b145a39946.png',
  hotspots: [
    {
      id: '1',
      x: 40,
      y: 75,
      title: 'Receptie',
      description: 'Hier kunt u inchecken en uitchecken. Openingstijden: 08:00 - 20:00',
      category: 'Service',
    },
    {
      id: '2',
      x: 25,
      y: 45,
      title: 'Restaurant',
      description: 'Ons restaurant biedt heerlijke lokale gerechten. Open van 12:00 - 22:00',
      category: 'Horeca',
    },
    {
      id: '3',
      x: 20,
      y: 35,
      title: 'Recreatieruimte',
      description: 'Binnen recreatieruimte voor alle leeftijden',
      category: 'Recreatie',
    },
    {
      id: '4',
      x: 45,
      y: 40,
      title: 'Privé Sanitair',
      description: 'Privé sanitairvoorzieningen voor extra comfort',
      category: 'Sanitair',
    },
    {
      id: '5',
      x: 35,
      y: 50,
      title: 'Wasgelegenheid',
      description: 'Wasserette met moderne wasmachines en drogers',
      category: 'Service',
    },
    {
      id: '6',
      x: 75,
      y: 85,
      title: 'Parkeerplaats',
      description: 'Ruime parkeerplaats voor gasten',
      category: 'Parkeren',
    }
  ]
};

// Je kunt hier meer plattegronden toevoegen als je meerdere kaarten wilt
export const availableMaps = {
  main: campingMapData,
};
