// Define TypeScript interfaces for the responses (adjust as needed)
export interface Design {
  uuid: string;
  name: string;
  description: string | null;
  is_active: boolean;
  favorited: boolean;
  category: {
    uuid: string;
    name: string;
    description: string;
    is_active: boolean;
  };
  image_status?: string;
  image_url?: string;
  user: any; // Adjust this type based on your user model (e.g., { uuid: string; username: string })
  heart_count: number;
  laugh_count: number;
  fire_count: number;
  trending_score: number;
  interactions_updated_at: string;
  last_score_update: string;
}

export interface DesignListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Design[];
}