import { drizzle } from 'drizzle-orm/d1';

export * from "./db/schema.js";

export interface Env {
  Backlog_Binding: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.Backlog_Binding);
  },
};