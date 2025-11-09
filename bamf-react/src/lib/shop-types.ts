// lib/shop-types.ts
export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type VariantListItem = {
  sku: string;
  groupId?: string | null;
  groupSlug?: string | null;
  groupName: string;
  price: number;
  inStock: boolean;
  color?: string | null;
  size?: string | null;
  primaryImageUrl?: string | null;
  moreVariantsCount?: number;
};

export type SkuListItem = {
  sku: string;
  objectId: string;
  slug?: string;
  groupName: string;
  mainCategory: string;
  color: string;
  size: string;
  price: number;
  inStock: boolean;
  primaryImageUrl?: string;
  groupLink: string;
  moreVariantsCount: number;
};

export type GroupedProductCard = {
  groupId: string;
  groupSlug?: string | null;
  groupName: string;
  primaryImageUrl?: string | null;
  minPrice: number;
  maxPrice: number;
  totalVariants: number;
  anyInStock: boolean;
  sampleSku?: string;
};

export type GroupDetail = {
  groupId: string;
  groupSlug?: string | null;
  name: string;
  mainCategory: string;
  heroImageUrl?: string | null;
  minPrice: number;
  maxPrice: number;
  inStockAny: boolean;
  variants: Array<{
    id: string;
    sku: string;
    color?: string | null;
    size?: string | null;
    price: number;
    inStock: boolean;
    primaryImageUrl?: string | null;
  }>;
  facets: {
    colors: Array<{ value: string; count: number }>;
    sizes: Array<{ value: string; count: number }>;
  };
};