export type ProductDto = Partial<{
  productId: string;
  name: string;
  summary: string;
  content: string;
  metaData: { key: string; content: string }[];
  metaDataKeys: string[];
  categoryIds: string[];
  entityType: string;
}>;

export type ProductCategoryDto = Readonly<{
  productId: string;
  categoryId?: string;
  createdAt?: Date;
}>;

export type ListProductDto = {
  count: number;
  items: ProductDto[];
};

export type ProductCategoryResp = Readonly<{
  success: boolean;
}>;
