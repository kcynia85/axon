import { createClient } from "@/shared/infrastructure/supabase/client";
import { API_BASE_URL } from "./config";

interface RequestOptions extends RequestInit {
  readonly body?: any;
}

const getAuthToken = async (): Promise<string | null> => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const token = await getAuthToken();
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json();
};

export const authenticatedClient = {
  get: <T>(path: string, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "GET" }),
    
  post: <T>(path: string, body?: any, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "POST", body }),
    
  put: <T>(path: string, body?: any, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "PUT", body }),
    
  patch: <T>(path: string, body?: any, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "PATCH", body }),
    
  delete: <T>(path: string, options?: RequestOptions) => 
    request<T>(path, { ...options, method: "DELETE" }),
};
