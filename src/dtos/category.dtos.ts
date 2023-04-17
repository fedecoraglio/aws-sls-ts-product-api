export type CategoryDto = Partial<{
  categoryId: string;
  name: string;
  summary: string;
  content: string;
}>;

export type CategoryCategoryDto = Readonly<{
  categoryParentId: string;
  categoryId?: string;
  createdAt?: Date;
}>;
