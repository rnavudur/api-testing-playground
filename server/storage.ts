import { type ApiRequest, type InsertApiRequest, type User, type InsertUser, apiRequests, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // API Request operations
  createApiRequest(request: InsertApiRequest): Promise<ApiRequest>;
  getApiRequests(): Promise<ApiRequest[]>;
  getApiRequest(id: string): Promise<ApiRequest | undefined>;
  
  // User operations for authentication
  createUser(user: InsertUser): Promise<User>;
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserByUsername(username: string): Promise<User | undefined>;
  findUserById(id: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  // API Request operations
  async createApiRequest(insertRequest: InsertApiRequest): Promise<ApiRequest> {
    const [apiRequest] = await db
      .insert(apiRequests)
      .values(insertRequest)
      .returning();
    return apiRequest;
  }

  async getApiRequests(): Promise<ApiRequest[]> {
    return await db
      .select()
      .from(apiRequests)
      .orderBy(apiRequests.createdAt);
  }

  async getApiRequest(id: string): Promise<ApiRequest | undefined> {
    const [apiRequest] = await db
      .select()
      .from(apiRequests)
      .where(eq(apiRequests.id, id));
    return apiRequest;
  }

  // User operations for authentication
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async findUserById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }
}

export class MemStorage implements IStorage {
  private apiRequests: Map<string, ApiRequest>;
  private users: Map<string, User>;

  constructor() {
    this.apiRequests = new Map();
    this.users = new Map();
  }

  async createApiRequest(insertRequest: InsertApiRequest): Promise<ApiRequest> {
    const id = randomUUID();
    const apiRequest: ApiRequest = { 
      ...insertRequest, 
      id,
      body: insertRequest.body || null,
      headers: insertRequest.headers || null,
      queryParams: insertRequest.queryParams || null,
      responseHeaders: insertRequest.responseHeaders || null,
      response: insertRequest.response || null,
      status: insertRequest.status || null,
      statusCode: insertRequest.statusCode || null,
      responseTime: insertRequest.responseTime || null,
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

  // User operations for authentication
  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = {
      ...user,
      id,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
}

export const storage = new DatabaseStorage();
