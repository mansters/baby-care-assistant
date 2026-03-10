import { fetchAuthSession } from 'aws-amplify/auth';
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@smithy/protocol-http";
import { Sha256 } from "@aws-crypto/sha256-js";

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultHeaders = config.defaultHeaders || {};
  }

  private async getAuthToken(): Promise<string | undefined> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch {
      return undefined;
    }
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  private async buildHeaders(path: string, method: string, customHeaders?: HeadersInit, body?: unknown): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
    });

    if (customHeaders) {
      const custom = new Headers(customHeaders);
      custom.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    const token = await this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Determine if the URL is an AWS Lambda Function URL
    const url = new URL(this.buildUrl(path));
    if (url.hostname.includes('lambda-url')) {
      const regionMatch = url.hostname.match(/\.lambda-url\.([a-z0-9-]+)\.on\.aws/);
      const region = regionMatch ? regionMatch[1] : process.env.AWS_REGION || 'ap-northeast-1';

      const plainHeaders: Record<string, string> = {
        host: url.hostname,
      };
      headers.forEach((value, key) => {
        plainHeaders[key] = value;
      });

      const request = new HttpRequest({
        method: method,
        hostname: url.hostname,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()),
        headers: plainHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      try {
        const signer = new SignatureV4({
          credentials: defaultProvider(),
          region: region,
          service: 'lambda',
          sha256: Sha256,
        });

        const signedRequest = await signer.sign(request);
        
        for (const [key, value] of Object.entries(signedRequest.headers)) {
          headers.set(key, value);
        }
      } catch (error) {
        console.error('Failed to sign request with AWS SigV4:', error);
      }
    }

    return headers;
  }

  async fetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers: customHeaders, method = 'GET', ...restOptions } = options;
    
    const url = this.buildUrl(path);
    const headers = await this.buildHeaders(path, method, customHeaders, body);

    const response = await fetch(url, {
      ...restOptions,
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) as T : undefined as T;
  }

  async get<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'GET' });
  }

  async post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'POST', body });
  }

  async put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'PUT', body });
  }

  async patch<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'PATCH', body });
  }

  async delete<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'DELETE' });
  }

  create(config: Partial<ApiClientConfig>): ApiClient {
    return new ApiClient({
      baseUrl: config.baseUrl || this.baseUrl,
      defaultHeaders: { ...this.defaultHeaders, ...config.defaultHeaders },
    });
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

export const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280',
});