const API_URL = "http://localhost:3000";

// Custom error class to carry HTTP status codes to your Redux Thunks
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Enforces a safe leading forward slash if omitted by the developer
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${formattedEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Skip content-type header if sending FormData (useful for file uploads later)
  if (options?.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  // Handle network/server processing rejections safely
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      // Try to parse detailed error messages if sent back by the backend api
      const errorData = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Fallback if response body is not parseable JSON
    }
    throw new ApiError(errorMessage, response.status);
  }

  // HTTP 204 means "No Content" (common for DELETE requests)
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // json-server returns empty text for some empty DELETE pipelines
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as unknown as T;
  }

  return response.json();
}
