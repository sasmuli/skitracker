export type Resort = {
  id: string;
  name: string;
  height_m: number | null;
  lifts: number | null;
  skislopes_km: number | null;
  location_area: string | null;
  location_city: string | null;
  location_country: string | null;
};


export type ResortOption = Pick<Resort, 'id' | 'name'>;

export type ResortInput = {
  name: string;
  height_m?: number | null;
  lifts?: number | null;
  skislopes_km?: number | null;
  location_city?: string | null;
  location_country?: string | null;
  location_area?: string | null
}
