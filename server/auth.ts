import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User, InsertUser, LoginRequest, SignupRequest } from "@shared/schema";

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async createUser(userData: Omit<SignupRequest, "confirmPassword">): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();
    
    return user;
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

  async authenticateUser(credentials: LoginRequest): Promise<User | null> {
    const user = await this.findUserByEmail(credentials.email);
    
    if (!user) {
      return null;
    }

    const isValidPassword = await this.verifyPassword(credentials.password, user.password);
    
    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}

export const authService = new AuthService();