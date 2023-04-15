export type ListItem<T> = {
  count: number;
  items: T[];
  lastEvaluatedKey?: string | null;
};

export type PaginationItem = {
  limit?: number | null;
  lastEvaluatedKey?: string | null;
};

export type SimpleSearchParam = {
  query: string;
};

export const DEFAULT_LIMIT_PAGINATION = 10;
