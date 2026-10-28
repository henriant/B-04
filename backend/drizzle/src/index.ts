import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema.js';

export const createDb = (d1: D1Database) => drizzle(d1, schema);
export * from "./db/schema.js";

/*
export interface Env {
  Backlog_Binding: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.Backlog_Binding);
  },
};
*/