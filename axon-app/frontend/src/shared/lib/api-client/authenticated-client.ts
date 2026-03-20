import { createClient } from "@/shared/infrastructure/supabase/client";

/**
 * A centralized, authentication-aware fetch wrapper.
 * Automatically injects the Supabase access token into headers.
 */

const getHeaders = async (customHeaders: HeadersInit = {}): Promise<HeadersInit> => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = await getHeaders(options.headers);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
};

export const authenticatedClient = {
  get: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => 
    request<T>(endpoint, { ...options, method: "GET" }),

  post: async <T>(endpoint: string, data: unknown, options: RequestInit = {}): Promise<T> => 
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: async <T>(endpoint: string, data: unknown, options: RequestInit = {}): Promise<T> => 
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => 
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
