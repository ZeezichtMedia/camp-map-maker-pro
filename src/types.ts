
export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  image?: string;
  category?: string;
}

export interface MapData {
  backgroundImage: string;
  hotspots: Hotspot[];
}
