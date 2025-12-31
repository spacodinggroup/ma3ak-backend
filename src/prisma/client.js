import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
const isProduction = process.env.NODE_ENV === "production";
const pool = new Pool({
    connectionString,
    // Enable TLS in production (Render/Supabase) while allowing self-signed/managed
    // certificates; use non-SSL locally.
    ssl: isProduction ? { rejectUnauthorized: false } : false,
});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
//# sourceMappingURL=client.js.map