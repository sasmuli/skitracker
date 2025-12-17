export type SkiDay = {
  id: string;
  date: string;
  hours: number | null;
  rating: number | null;
  resort: {
    id: string;
    name: string;
  } | null;
};

export type SkiDayInput = {
  date: string;
  resort_id: string;
  hours?: number | null;
  rating?: number | null;
  distance_km?: number | null;
  notes?: string | null;
  ski_types?: string[] | null;
};
