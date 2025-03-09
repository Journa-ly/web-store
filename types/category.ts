export interface Category {
  uuid: string;
  path: string;
  name: string;
  description: string | null;
  priority: number;
  image_url: string | null;
  design_count: number;
}
