import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApiRequestSchema, apiRequestConfigSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy API requests to handle CORS
  app.post("/api/proxy", async (req, res) => {
    try {
      const config = apiRequestConfigSchema.parse(req.body);
      const startTime = Date.now();

      // Build URL with query parameters
      const url = new URL(config.url);
      Object.entries(config.queryParams || {}).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      // Make the actual API request
      const response = await axios({
        method: config.method,
        url: url.toString(),
        headers: config.headers,
        data: config.body ? JSON.parse(config.body) : undefined,
        timeout: 30000,
        validateStatus: () => true, // Don't throw on any status code
      });

      const responseTime = `${Date.now() - startTime}ms`;

      // Store the request and response
      const apiRequest = await storage.createApiRequest({
        method: config.method,
        url: config.url,
        headers: config.headers || {},
        queryParams: config.queryParams || {},
        body: config.body,
        response: response.data,
        responseHeaders: response.headers as Record<string, string>,
        status: response.statusText,
        statusCode: response.status.toString(),
        responseTime,
      });

      res.json({
        id: apiRequest.id,
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        responseTime,
      });
    } catch (error: any) {
      console.error("Proxy error:", error);
      
      // Handle timeout and network errors
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: "Request timeout", 
          message: "The request took too long to complete" 
        });
      }
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return res.status(502).json({ 
          error: "Connection failed", 
          message: "Could not connect to the API endpoint" 
        });
      }

      res.status(500).json({ 
        error: "Request failed", 
        message: error.message || "An unexpected error occurred" 
      });
    }
  });

  // Get request history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getApiRequests();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get specific request
  app.get("/api/history/:id", async (req, res) => {
    try {
      const request = await storage.getApiRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
