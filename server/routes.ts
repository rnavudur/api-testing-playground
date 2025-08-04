import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApiRequestSchema, apiRequestConfigSchema, loginSchema, signupSchema } from "@shared/schema";
import axios from "axios";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { authService } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.findUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const existingUsername = await storage.findUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Create user
      const user = await authService.createUser({
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      res.status(201).json({ 
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.findUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValid = await authService.verifyPassword(data.password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session and save it
      (req.session as any).userId = user.id;
      
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }
        
        res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        });
      });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.findUserById(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Proxy API requests to handle CORS
  app.post("/api/proxy", requireAuth, async (req, res) => {
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

      // Store the request and response with user ID
      const userId = (req.session as any)?.userId;
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
        userId,
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
  app.get("/api/history", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      const history = await storage.getApiRequestsByUserId(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get specific request
  app.get("/api/history/:id", requireAuth, async (req, res) => {
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
