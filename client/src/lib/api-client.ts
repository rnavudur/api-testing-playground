import { apiRequest } from "./queryClient";
import type { ApiRequestConfig } from "@shared/schema";

export interface ApiResponse {
  id: string;
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  responseTime: string;
}

export async function makeApiRequest(config: ApiRequestConfig): Promise<ApiResponse> {
  const response = await apiRequest("POST", "/api/proxy", config);
  return response.json();
}

export async function getRequestHistory() {
  const response = await apiRequest("GET", "/api/history");
  return response.json();
}

export async function getRequest(id: string) {
  const response = await apiRequest("GET", `/api/history/${id}`);
  return response.json();
}
