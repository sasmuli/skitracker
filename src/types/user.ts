export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  admin: boolean;
};

export type ProfileInput = {
  display_name: string;
  avatar_url: string;
};
