export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<DTO, T>(url: string, data: DTO): Promise<T>;
  put<DTO, T>(url: string, data: DTO): Promise<T>;
  delete(url: string): Promise<void>;
}