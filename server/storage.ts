import { type ApiRequest, type InsertApiRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createApiRequest(request: InsertApiRequest): Promise<ApiRequest>;
  getApiRequests(): Promise<ApiRequest[]>;
  getApiRequest(id: string): Promise<ApiRequest | undefined>;
}

export class MemStorage implements IStorage {
  private apiRequests: Map<string, ApiRequest>;

  constructor() {
    this.apiRequests = new Map();
  }

  async createApiRequest(insertRequest: InsertApiRequest): Promise<ApiRequest> {
    const id = randomUUID();
    const apiRequest: ApiRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date()
    };
    this.apiRequests.set(id, apiRequest);
    return apiRequest;
  }

  async getApiRequests(): Promise<ApiRequest[]> {
    return Array.from(this.apiRequests.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getApiRequest(id: string): Promise<ApiRequest | undefined> {
    return this.apiRequests.get(id);
  }
}

export const storage = new MemStorage();
