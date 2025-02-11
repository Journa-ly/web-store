export interface PrintfulProductTemplate {
  placement_area: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  print_details: {
    print_area_width: number;
    print_area_height: number;
    dpi: number;
    available_techniques: string[];
  };
}

export interface PrintfulSyncProduct {
  id: number;
  external_id: string;
  store_id: number;
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    variants: PrintfulSyncVariant[];
  };
  sync_variants: PrintfulSyncVariant[];
  template_details: PrintfulProductTemplate;
}

export interface PrintfulSyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  variant_id: number;
  retail_price: string;
  sku: string;
  files: PrintfulFile[];
}

export interface PrintfulFile {
  id: number;
  type: string;
  hash: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: string;
  created: string;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
  position: {
    area_width: number;
    area_height: number;
    width: number;
    height: number;
    top: number;
    left: number;
    limit_to_print_area: boolean;
  };
}
