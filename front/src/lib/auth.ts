import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, type NewUser } from './schema';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-fallback-secret-key';

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    try {
      const existingUser = await db.select().from(users).where(eq(users.email, data.email));
      
      if (existingUser.length > 0) {
        throw new Error('User with this email already exists');
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      const newUser: NewUser = {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      const [createdUser] = await db.insert(users).values(newUser).returning();

      const token = jwt.sign(
        { 
          userId: createdUser.id, 
          email: createdUser.email 
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      const authUser: AuthUser = {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName || undefined,
        lastName: createdUser.lastName || undefined,
      };

      return { user: authUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(data: LoginData): Promise<{ user: AuthUser; token: string }> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, data.email));

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      };

      return { user: authUser, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));

      if (!user) {
        throw new Error('User not found');
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      };

      return authUser;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Invalid token');
    }
  }

  static async getCurrentUser(token: string): Promise<AuthUser> {
    return this.verifyToken(token);
  }
}
