export type CategoryDto = Partial<{
  categoryId: string;
  name: string;
  summary: string;
  content: string;
}>;

export interface ListCategoryDto {
  count: number;
  items: CategoryDto[];
}
