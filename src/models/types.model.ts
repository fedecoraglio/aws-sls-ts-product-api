export type MetaDataType = Readonly<{
  key: string;
  content: string;
}>;

export type CommonDataType = Partial<{
  name: string;
  summary: string;
  content: string;
  metaData: MetaDataType[];
  metaDataKeys?: string[];
  createdAt: string;
}>;

export type ProductType = Readonly<{
  productId: string;
  categoryIds?: string[];
}> &
  CommonDataType;

export type CategoryType = Readonly<{
  categoryId: string;
  categoryParentIds?: string[];
}> &
  CommonDataType;
