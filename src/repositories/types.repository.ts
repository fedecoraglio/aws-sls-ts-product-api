export interface SaveBatchRepository<T> {
  saveBatch(id: string, dtos: T[]): Promise<boolean>;
}
export interface DeleteBatchRepository<T> {
  deleteBatch(id: string, dtos: T[]): Promise<boolean>;
}
