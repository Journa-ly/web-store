// Define TypeScript interfaces for the responses (adjust as needed)
export interface PipelineJob {
  id: number;
  uuid: string;
  task_id: string | null;
  initial_images: any[];
  initial_prompt: string;
  created_at: string;
  updated_at: string;
  status: string;
  session_id: string;
  enhanced_prompt: string;
  initial_quote_prompt: string;
  aspect_ratio: string;
  result_image_count: number;
  pipeline: number;
  user: number | null;
  generation_group: number;
  theme: string | null;
}

export interface GenerationImage {
  id: number;
  uuid: string;
  image: ProductImage;
  status: string;
  created_at: string;
  pipeline_job: PipelineJob;
  favorited: boolean;
}

export interface ProductImage {
  uuid: string;
  image?: string;
  product_id?: string;
  image_url?: string;
}

// Base interface for common design properties
export interface BaseDesign {
  uuid: string;
  name: string;
  is_active: boolean;
  category: string | null;
  created_by: string;
  heart_count: number;
  laugh_count: number;
  fire_count: number;
  trending_score: number;
  interactions_updated_at: string;
  last_score_update: string;
  user_reactions: string[];
  product_image: ProductImage | null;
  prompt: string;
  quote_prompt: string;
}

// Interface for trending designs (uses DesignSerializer)
export interface TrendingDesign extends BaseDesign {}

// Interface for user designs (uses DesignWithGenerationGroupImageSerializer)
export interface UserDesign extends BaseDesign {
  image: GenerationImage;
  favorite: boolean;
}

// Response interfaces for different endpoints
export interface TrendingDesignListResponse {
  results: TrendingDesign[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface UserDesignListResponse {
  results: UserDesign[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface CreateDesignRequest {
  prompt: string;
  quote_prompt?: string;
  theme?: string;
  livestream_uuid?: string;
}

// Response interfaces for actions
export interface ToggleFavoriteResponse {
  detail: string;
  design: UserDesign;
}

export interface ToggleInteractionResponse {
  detail: string;
}

export interface ShareDesignResponse {
  detail: string;
}

export interface AttachUserResponse {
  detail: string;
  designs_attached_count: number;
}
