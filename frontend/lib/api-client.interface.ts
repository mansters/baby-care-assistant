export interface IApiClient {
  get<T = unknown>(path: string, options?: RequestInit): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, options?: RequestInit): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, options?: RequestInit): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, options?: RequestInit): Promise<T>;
  delete<T = unknown>(path: string, options?: RequestInit): Promise<T>;
  create(config: { baseUrl?: string; defaultHeaders?: Record<string, string> }): IApiClient;
}
