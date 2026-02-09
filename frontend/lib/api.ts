// T020: API client base class with JWT handling

/**
 * API error class for handling backend errors
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "APIError";
  }
}

/**
 * Get JWT token from session cookie
 * In the browser, we can access cookies directly via document.cookie
 */
async function getToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    // Browser environment - read from cookies
    const match = document.cookie.match(/(?:^|; )session=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  return null;
}

/**
 * Base API client for backend communication
 * Automatically attaches JWT token to requests
 */
class APIClient {
  private baseURL: string;

  constructor() {
    // Use hardcoded backend URL for production, env var for local dev
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Debug logging
    if (typeof window !== "undefined") {
      console.log(`[API] Fetching: ${url}`);
    }

    // Try to get token, but don't let token failure block the request
    let token: string | null = null;
    try {
      token = await getToken();
    } catch {
      // Ignore token errors - proceed without auth
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (fetchError) {
      // Provide more context for network errors
      console.error(`[API] Network error for ${url}:`, fetchError);
      throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to fetch'}. URL: ${url}`);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new APIError(response.status, error.detail || "Request failed");
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   * Returns empty object for 204 No Content or 404 (already deleted)
   */
  async delete<T>(endpoint: string): Promise<T> {
    const token = await getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    // 404 on delete means resource already exists - treat as success
    if (response.status === 404 || response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new APIError(response.status, error.detail || "Request failed");
    }

    return response.json();
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export singleton instance
export const api = new APIClient();
