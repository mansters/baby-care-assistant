import type { IApiClient } from '@/lib/api-client.interface';

export abstract class BaseService {
  protected api: IApiClient;

  constructor(client: IApiClient, basePath: string) {
    this.api = client.create({
      baseUrl: `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280'}/api/${basePath}`,
    });
  }
}
