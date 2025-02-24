
export interface Category {
  uuid: string;
  name: string;
  description: string | null;
  priority: number;
  image_url: string | null;
  design_count: number;
}