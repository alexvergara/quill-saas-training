import { sql } from "@vercel/postgres";
import { drizzle, VercelPgDatabase } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export const db = drizzle(sql, { schema });
//export const db: VercelPgDatabase = drizzle(sql)
//export const db = drizzle(sql);
