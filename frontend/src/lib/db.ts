import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!import.meta.env.VITE_DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL is not defined in environment variables');
}

const sql = neon(import.meta.env.VITE_DATABASE_URL);
export const db = drizzle(sql);
