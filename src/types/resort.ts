export type Resort = {
  id: string;
  name: string;
  height_m: number | null;
  lifts: number | null;
  skislopes_km: number | null;
  location: string | null;
};

export type ResortOption = Pick<Resort, 'id' | 'name'>;
